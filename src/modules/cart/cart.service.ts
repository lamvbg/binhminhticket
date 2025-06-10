import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateCartDto } from './dto/create_cart.dto';
import { GetCartsDto } from './dto/get_cart.dto';
import { OrderSort } from 'src/common/enum/enum';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { UpdateCartDto } from './dto/update_cart.dto';
import { User } from 'src/entities/user.entity';
import { Tour } from 'src/entities/tour.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const user = await this.userRepository.findOne({
      where: { id: createCartDto.user_id },
    });
    if (!user) throw new NotFoundException('User not found');

    const tour = await this.tourRepository.findOne({
      where: { id: createCartDto.tour_id },
    });
    if (!tour) throw new NotFoundException('Tour not found');
    const cart = this.cartRepository.create({
      user,
      tour,
      quantity: createCartDto.quantity,
      total_price: createCartDto.total_price,
      discount_code: createCartDto.discount_code,
    });
    await this.entityManager.save(cart);
    return { cart, message: 'Cart created successfully' };
  }

  async getAll(params: GetCartsDto) {
    const carts = this.cartRepository
      .createQueryBuilder('cart')
      .select(['cart', 'user', 'tour'])
      .leftJoin('cart.user', 'user')
      .leftJoin('cart.tour', 'tour')
      .skip(params.skip)
      .take(params.take)
      .orderBy('cart.createdAt', OrderSort.DESC);

    const [result, total] = await carts.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const cart = await this.cartRepository
      .createQueryBuilder('cart')
      .select(['cart', 'user', 'tour'])
      .leftJoin('cart.user', 'user')
      .leftJoin('cart.tour', 'tour')
      .where('cart.id = :id', { id })
      .getOne();
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return { cart, message: 'Success' };
  }

  async getCartByUserId(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const carts = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'tour'],
      order: { createdAt: 'DESC' },
    });

    return {
      carts,
      message: 'Carts retrieved successfully',
    };
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'tour'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (updateCartDto.user_id) {
      const user = await this.userRepository.findOne({
        where: { id: updateCartDto.user_id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      cart.user = user;
    }
    if (updateCartDto.tour_id) {
      const tour = await this.tourRepository.findOne({
        where: { id: updateCartDto.tour_id },
      });

      if (!tour) {
        throw new NotFoundException('Tour not found');
      }
      cart.tour = tour;
    }

    cart.quantity = updateCartDto.quantity;
    cart.total_price = updateCartDto.total_price;
    cart.discount_code = updateCartDto.discount_code;

    await this.cartRepository.save(cart);

    const updatedCart = await this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'tour'],
    });

    return { cart: updatedCart, message: 'Cart updated successfully' };
  }

  async remove(id: string) {
    const cart = await this.cartRepository.findOneBy({ id });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    if (cart) {
      await this.entityManager.remove(cart);
      return { message: 'Cart deleted successfully' };
    }
  }
}
