import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
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
    })
    await this.entityManager.save(user);
    return { user, message: 'User created successfully' };
  }

  async getAll(params: GetUserDto) {
    const users = this.userRepository
      .createQueryBuilder('user')
      .select(['user'])
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
      .select(['user'])
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
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = this.hashPassword(updateUserDto.password, salt);
    if (user) {
      user.name = updateUserDto.name;
      user.email = updateUserDto.email;
      user.password = hashedPassword;
      user.role = updateUserDto.role;
      user.phone = updateUserDto.phone;
      user.address = updateUserDto.address;
      if (updateUserDto.discount_code) {
        const discount = await this.discountRepository.findOneBy({
          code: updateUserDto.discount_code,
        });

        if (!discount) {
          throw new NotFoundException('Discount not found');
        }

        if (discount) {
          discount.user = user;
          await this.discountRepository.save(discount);
        }
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
    if (user) {
      await this.entityManager.remove(user);
      return { message: 'User deleted successfully' };
    }
  }
}
