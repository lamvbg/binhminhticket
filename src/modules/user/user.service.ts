import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create_user.dto';
import { GetUserDto } from './dto/get_user.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { UpdateUserDto } from './dto/update_user.dto';
import { Discount } from 'src/entities/discount.entity';
import * as crypto from 'crypto';
import { Tour } from 'src/entities/tour.entity';
import { GetFavouriteDto } from './dto/get_user_favourite_tour.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
  ) {}

  hashPassword(password: string, salt: string): string {
    if (!password || !salt) {
      throw new Error('Password and salt are required for hashing');
    }
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    return `${hash}.${salt}`;
  }

  async create(createUserDto: CreateUserDto) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = this.hashPassword(createUserDto.password, salt);
    if (await this.userRepository.findOneBy({ email: createUserDto.email })) {
      throw new BadRequestException('Email already exists');
    }
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    if (createUserDto.discount_code) {
      const discount = await this.discountRepository.findOne({
        where: { code: createUserDto.discount_code },
        relations: ['users'],
      });

      if (!discount) {
        throw new BadRequestException('Discount code not found');
      }
      const alreadyLinked = discount.users?.some((u) => u.id === user.id);
      if (!alreadyLinked) {
        discount.users.push(user);
        await this.entityManager.save(discount);
      }
    }
    await this.entityManager.save(user);
    return { user, message: 'User created successfully' };
  }

  async getAll(params: GetUserDto) {
    const users = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.discounts', 'discount')
      .skip(params.skip)
      .take(params.take)
      .orderBy('user.createdAt', 'DESC');

    if (params.name) {
      users.andWhere('user.name ILIKE :name', {
        name: `%${params.name}%`,
      });
    }

    if (params.email) {
      users.andWhere('user.email ILIKE :email', {
        email: `%${params.email}%`,
      });
    }

    if (params.role) {
      users.andWhere('user.role = :role', { role: params.role });
    }

    const [result, total] = await users.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.discounts', 'discount')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { user, message: 'Success' };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user) {
      if (updateUserDto.email) {
        if (
          await this.userRepository.findOneBy({ email: updateUserDto.email })
        ) {
          throw new BadRequestException('Email already exists');
        } else {
          user.email = updateUserDto.email;
        }
      }
      if (updateUserDto.name) {
        user.name = updateUserDto.name;
      }
      if (updateUserDto.password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = this.hashPassword(updateUserDto.password, salt);
        user.password = hashedPassword;
      }
      if (updateUserDto.role) {
        user.role = updateUserDto.role;
      }
      if (updateUserDto.phone) {
        user.phone = updateUserDto.phone;
      }
      if (updateUserDto.address) {
        user.address = updateUserDto.address;
      }
      if (updateUserDto.discount_code) {
        const discount = await this.discountRepository.findOneBy({
          code: updateUserDto.discount_code,
        });

        if (!discount) {
          throw new NotFoundException('Discount not found');
        }

        user.discounts = [];
        user.discounts = [discount];
      } else {
        user.discounts = [];
      }
      await this.entityManager.save(user);
      return { user, message: 'User updated successfully' };
    }
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.discounts?.length > 0) {
      for (const discount of user.discounts) {
        discount.users = discount.users?.filter((u) => u.id !== user.id);
        await this.entityManager.save(discount);
      }
    }
    await this.entityManager.remove(user);
    return { message: 'User deleted successfully' };
  }

  async addFavouriteTour(userId: string, tourId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favouriteTours'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tour = await this.tourRepository.findOneBy({ id: tourId });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    const alreadyExists = user.favouriteTours?.some((t) => t.id === tour.id);

    if (alreadyExists) {
      throw new BadRequestException('Tour already in favourites');
    }

    user.favouriteTours = [...(user.favouriteTours || []), tour];
    await this.userRepository.save(user);

    return { message: 'Tour added to favourites successfully' };
  }

  async removeFavouriteTour(userId: string, tourId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favouriteTours'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.favouriteTours = user.favouriteTours?.filter((t) => t.id !== tourId);
    await this.userRepository.save(user);

    return { message: 'Tour removed from favourites successfully' };
  }

  async getFavouriteTours(params: GetFavouriteDto) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.favouriteTours', 'favouriteTours')
      .where('user.id = :userId', { userId: params.userId });

    const [user] = await query.getMany();

    if (!user) {
      throw new NotFoundException('User not found or has no favourites');
    }

    const allFavourites = user.favouriteTours;

    const skip = params.skip ?? 0;
    const take = params.take ?? allFavourites.length;
    const paginated = allFavourites.slice(skip, skip + take);

    const pageMetaDto = new PageMetaDto({
      itemCount: allFavourites.length,
      pageOptionsDto: params,
    });

    return new ResponsePaginate(
      [
        {
          user_id: user.id,
          favourites: paginated,
        },
      ],
      pageMetaDto,
      'Success',
    );
  }
}
