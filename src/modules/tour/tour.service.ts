import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tour } from '../../entities/tour.entity';
import { EntityManager, Not, Repository } from 'typeorm';
import { CreateTourDto } from './dto/create_tour.dto';
import { GetToursDto } from './dto/get_tours.dto';
import { OrderSort } from 'src/common/enum/enum';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { UpdateTourDto } from './dto/update_tour.dto';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createTourDto: CreateTourDto) {
    const tour = new Tour(createTourDto);
    await this.entityManager.save(tour);
    return { tour, message: 'Tour created successfully' };
  }

  async getAll(params: GetToursDto) {
    const tours = this.tourRepository
      .createQueryBuilder('tour')
      .select(['tour'])
      .skip(params.skip)
      .take(params.take)
      .orderBy('tour.createdAt', OrderSort.DESC);

    if (params.search) {
      tours.andWhere('tour.name ILIKE :search', {
        search: `%${params.search}%`,
      });
    }

    const [result, total] = await tours.getManyAndCount();
    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: params,
    });
    return new ResponsePaginate(result, pageMetaDto, 'Success');
  }

  async get(id: string) {
    const tour = await this.tourRepository
      .createQueryBuilder('tour')
      .select(['tour'])
      .where('tour.id = :id', { id })
      .getOne();
    if (!tour) {
      throw new NotFoundException('Tour not found');
    }
    return { tour, message: 'Success' };
  }

  async update(id: string, updateTourDto: UpdateTourDto) {
    const tour = await this.tourRepository.findOneBy({ id });
    if (!tour) {
      throw new NotFoundException('Tour not found');
    }
    if (tour) {
      tour.name = updateTourDto.name;
      tour.description = updateTourDto.description;
      tour.price = updateTourDto.price;
      tour.duration = updateTourDto.duration;
      tour.start_date = new Date(updateTourDto.start_date);
      tour.end_date = new Date(updateTourDto.end_date);
      tour.available_seats = updateTourDto.available_seats;
      await this.entityManager.save(tour);
      return { tour, message: 'Tour updated successfully' };
    }
  }

  async remove(id: string) {
    const tour = await this.tourRepository.findOneBy({ id });
    if (!tour) {
      throw new NotFoundException('Tour not found');
    }
    if (tour) {
      await this.entityManager.remove(tour);
      return { message: 'Tour deleted successfully' };
    }
  }
}
