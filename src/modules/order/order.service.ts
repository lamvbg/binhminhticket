import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create_order.dto';
import { User } from 'src/entities/user.entity';
import { Tour } from 'src/entities/tour.entity';
import { OrderDetail } from 'src/entities/order_detail.entity';
import { OrderResponseDto } from './dto/order_response.dto';
import { OrderDetailResponseDto } from '../order-detail/dto/order_detail_response.dto';
import { GetOrdersDto } from './dto/get_orders.dto';
import { OrderSort } from 'src/common/enum/enum';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { UpdateOrderDto } from './dto/update_order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
  ): Promise<{ data: OrderResponseDto; message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: createOrderDto.user_id },
    });
    if (!user) throw new NotFoundException('User not found');

    let totalAmount = 0;
    const order = this.orderRepository.create({
      user,
      status: createOrderDto.status,
    });
    const newOrder = await this.orderRepository.save(order);

    const orderDetails = await Promise.all(
      createOrderDto.orderDetails.map(async (item) => {
        const tour = await this.tourRepository.findOne({
          where: { id: item.tour_id },
        });

        if (!tour) {
          throw new NotFoundException('Tour not found');
        }

        const detail = this.orderDetailRepository.create({
          order: newOrder,
          tour,
          quantity: item.quantity,
          price: item.price,
          total_amount: item.total_amount,
        });

        return detail;
      }),
    );

    await this.orderDetailRepository.save(orderDetails);

    const orderDetailDtos: OrderDetailResponseDto[] = orderDetails.map(
      (detail) => ({
        id: detail.id,
        quantity: detail.quantity,
        price: detail.price,
        tour_id: detail.tour.id,
        tour_name: detail.tour.name,
        total_amount: detail.total_amount,
      }),
    );

    const responseDto: OrderResponseDto = {
      id: newOrder.id,
      status: newOrder.status,
      created_at: newOrder.createdAt,
      updated_at: newOrder.updatedAt,
      orderDetails: orderDetailDtos,
    };

    return { data: responseDto, message: 'Order created successfully' };
  }

  async getAll(
    params: GetOrdersDto,
  ): Promise<ResponsePaginate<OrderResponseDto>> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderDetails', 'orderDetail')
      .leftJoinAndSelect('orderDetail.tour', 'tour')
      .skip(params.skip || 0)
      .take(params.take || 10)
      .orderBy('order.createdAt', OrderSort.DESC);

    if (params.search) {
      query.andWhere('LOWER(tour.name) LIKE LOWER(:search)', {
        search: `%${params.search}%`,
      });
    }

    if (params.status) {
      query.andWhere('order.status = :status', { status: params.status });
    }

    const [orders, total] = await query.getManyAndCount();

    const data: OrderResponseDto[] = orders.map((order) => ({
      id: order.id,
      status: order.status,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      orderDetails: order.orderDetails.map((detail) => ({
        id: detail.id,
        quantity: detail.quantity,
        price: detail.price,
        tour_id: detail.tour.id,
        tour_name: detail.tour.name,
        total_amount: detail.total_amount,
      })),
    }));

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(data, pageMetaDto, 'Success');
  }

  async get(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderDetails', 'orderDetails.tour'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return {
      id: order.id,
      status: order.status,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      orderDetails: order.orderDetails.map((detail) => ({
        id: detail.id,
        quantity: detail.quantity,
        price: detail.price,
        total_amount: detail.total_amount,
        tour_id: detail.tour.id,
        tour_name: detail.tour.name,
      })),
    };
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<{ data: OrderResponseDto; message: string }> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderDetails', 'orderDetails.tour'],
    });
    if (!order) throw new NotFoundException('Order not found');

    if (order.status){
      order.status = updateOrderDto.status;
    }
    
    let updatedOrderDetails = order.orderDetails;

    if (updateOrderDto.orderDetails && updateOrderDto.orderDetails.length > 0) {
      await this.orderDetailRepository.delete({ order: { id } });

      let totalAmount = 0;
      const newDetails = await Promise.all(
        updateOrderDto.orderDetails.map(async (item) => {
          const tour = await this.tourRepository.findOne({
            where: { id: item.tour_id },
          });
          if (!tour)
            throw new NotFoundException(`Tour ${item.tour_id} not found`);

          const total = item.price * item.quantity;
          totalAmount += total;

          return this.orderDetailRepository.create({
            order,
            tour,
            quantity: item.quantity,
            price: item.price,
            total_amount: total,
          });
        }),
      );

      await this.orderDetailRepository.save(newDetails);
      updatedOrderDetails = newDetails;
    }

    const responseDto: OrderResponseDto = {
      id: order.id,
      status: order.status,
      created_at: order.createdAt,
      updated_at: new Date(),
      orderDetails: updatedOrderDetails.map((detail) => ({
        id: detail.id,
        quantity: detail.quantity,
        price: detail.price,
        total_amount: detail.total_amount,
        tour_id: detail.tour.id,
        tour_name: detail.tour.name,
      })),
    };

    return { data: responseDto, message: 'Order updated successfully' };
  }

  async remove(id: string): Promise<{ message: string }> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    await this.orderDetailRepository.delete({ order: { id } });
    await this.orderRepository.delete({ id });

    return { message: 'Order deleted successfully' };
  }
}
