import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CtvOrder } from 'src/entities/ctv_order.entity';
import { Order } from 'src/entities/order.entity';
import { User } from 'src/entities/user.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { CreateCtvOrderDto } from './dto/create_ctv_order.dto';
import { GetCtvOrderDto } from './dto/get_ctv_order.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { UpdateCtvOrderDto } from './dto/update_ctv_order.dto';

@Injectable()
export class CtvOrderService {
  constructor(
    @InjectRepository(CtvOrder)
    private readonly ctvOrderRepository: Repository<CtvOrder>,
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createCtvOrderDto: CreateCtvOrderDto) {
    const user = await this.userRepository.findOne({
      where: { id: createCtvOrderDto.ctv_id },
    });
    if (!user) throw new NotFoundException('User not found');

    const order = await this.orderRepository.findOne({
      where: { id: createCtvOrderDto.order_id },
    });
    if (!order) throw new NotFoundException('Order not found');

    const ctvOrder = this.ctvOrderRepository.create({
      ctv: user,
      order: order,
      commission_amount: createCtvOrderDto.commission_amount,
      status: createCtvOrderDto.status,
    });
    await this.entityManager.save(ctvOrder);
    return { ctvOrder, message: 'CTV order created successfully' };
  }

  async getAll(params: GetCtvOrderDto) {
    const ctvOrders = this.ctvOrderRepository
      .createQueryBuilder('ctvOrder')
      .select(['ctvOrder', 'ctv', 'order'])
      .leftJoin('ctvOrder.ctv', 'ctv')
      .leftJoin('ctvOrder.order', 'order')
      .skip(params.skip)
      .take(params.take)
      .orderBy('ctvOrder.createdAt', 'DESC');

    const [result, total] = await ctvOrders.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const ctvOrder = await this.ctvOrderRepository
      .createQueryBuilder('ctvOrder')
      .select(['ctvOrder', 'ctv', 'order'])
      .leftJoin('ctvOrder.ctv', 'ctv')
      .leftJoin('ctvOrder.order', 'order')
      .where('ctvOrder.id = :id', { id })
      .getOne();
    if (!ctvOrder) {
      throw new NotFoundException('CTV order not found');
    }
    return { ctvOrder, message: 'Success' };
  }

  async update(id: string, updateCtvOrderDto: UpdateCtvOrderDto) {
    const ctvOrder = await this.ctvOrderRepository.findOne({
      where: { id: id },
      relations: ['ctv', 'order'],
    });
    if (!ctvOrder) {
      throw new NotFoundException('CTV order not found');
    }

    if (updateCtvOrderDto.ctv_id) {
      const user = await this.userRepository.findOne({
        where: { id: updateCtvOrderDto.ctv_id },
      });
      if (!user) throw new NotFoundException('User not found');
      ctvOrder.ctv = user;
    }
    if (updateCtvOrderDto.order_id) {
      const order = await this.orderRepository.findOne({
        where: { id: updateCtvOrderDto.order_id },
      });
      if (!order) throw new NotFoundException('Order not found');
      ctvOrder.order = order;
    }
    if (updateCtvOrderDto.commission_amount) {
      ctvOrder.commission_amount = updateCtvOrderDto.commission_amount;
    }
    if (updateCtvOrderDto.status) {
      ctvOrder.status = updateCtvOrderDto.status;
    }
    await this.entityManager.save(ctvOrder);
    return {
      ctvOrder,
      message: 'CTV order updated successfully',
    };
  }

  async remove(id: string) {
    const ctvOrder = await this.ctvOrderRepository.findOneBy({ id });
    if (!ctvOrder) {
      throw new NotFoundException('CTV order not found');
    }
    if (ctvOrder) {
      await this.entityManager.remove(ctvOrder);
      return { message: 'CTV order deleted successfully' };
    }
  }
}
