import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminAction } from 'src/entities/admin_action.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateAdminActionDto } from './dto/create_admin_action.dto';
import { GetAdminActionDto } from './dto/get_admin_action.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AdminActionService {
  constructor(
    @InjectRepository(AdminAction)
    private readonly adminActionRepository: Repository<AdminAction>,
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAdminActionDto: CreateAdminActionDto) {
    const user = await this.userRepository.findOne({
      where: { id: createAdminActionDto.admin_id },
    });
    if (!user) throw new NotFoundException('User not found');
    const adminAction = this.adminActionRepository.create({
      admin: user,
      action_type: createAdminActionDto.action_type,
    });
    await this.entityManager.save(adminAction);
    return { adminAction, message: 'Admin action created successfully' };
  }

  async getAll(params: GetAdminActionDto) {
    const adminActions = this.adminActionRepository
      .createQueryBuilder('adminAction')
      .select(['adminAction', 'admin'])
      .leftJoin('adminAction.admin', 'admin')
      .skip(params.skip)
      .take(params.take)
      .orderBy('adminAction.createdAt', 'DESC');

    const [result, total] = await adminActions.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const adminAction = await this.adminActionRepository
      .createQueryBuilder('adminAction')
      .select(['adminAction', 'admin'])
      .leftJoin('adminAction.admin', 'admin')
      .where('adminAction.id = :id', { id })
      .getOne();
    if (!adminAction) {
      throw new NotFoundException('Admin action not found');
    }
    return { adminAction, message: 'Success' };
  }

  async update(id: string, updateAdminActionDto: CreateAdminActionDto) {
    const adminAction = await this.adminActionRepository.findOne({
      where: { id: id },
      relations: ['admin'],
    });
    if (!adminAction) {
      throw new NotFoundException('Admin action not found');
    }
    if (updateAdminActionDto.admin_id) {
      const user = await this.userRepository.findOne({
        where: { id: updateAdminActionDto.admin_id },
      });
      if (!user) throw new NotFoundException('User not found');
      adminAction.admin = user;
    }
      adminAction.action_type = updateAdminActionDto.action_type;
      await this.entityManager.save(adminAction);
      return { adminAction, message: 'Admin action updated successfully' };

  }

  async remove(id: string) {
    const adminAction = await this.adminActionRepository.findOneBy({ id });
    if (!adminAction) {
      throw new NotFoundException('Admin action not found');
    }
    if (adminAction) {
      await this.entityManager.remove(adminAction);
      return { message: 'Admin action deleted successfully' };
    }
  }
}
