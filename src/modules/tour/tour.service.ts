import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tour } from '../../entities/tour.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateTourDto } from './dto/create_tour.dto';
import { GetToursDto } from './dto/get_tours.dto';
import { OrderSort } from 'src/common/enum/enum';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';
import { UpdateTourDto } from './dto/update_tour.dto';
import { Multer } from 'multer';
import { CloudinaryService } from 'src/service/cloudinary.service';
import { Discount } from 'src/entities/discount.entity';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    private readonly entityManager: EntityManager,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  async create(createTourDto: CreateTourDto, Images: Multer.File[]) {
    const tour = new Tour(createTourDto);

    if (Images && Images.length > 0) {
      const imageUrls = await Promise.all(
        Images.map(async (file) => {
          return await this.cloudinaryService.uploadAndReturnImageUrl(file);
        }),
      );
      tour.images = imageUrls;
    } else {
      tour.images = [];
    }

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
      .where('tour.id = :id', { id })
      .getOne();

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }
    return { tour, message: 'Success' };
  }

  async update(
    id: string,
    updateTourDto: UpdateTourDto,
    images: Multer.File[],
  ) {
    const tour = await this.tourRepository.findOneBy({ id });
    if (!tour) {
      throw new NotFoundException('Tour not found');
    }

    tour.name = updateTourDto.name;
    tour.description = updateTourDto.description;
    tour.price = updateTourDto.price;
    tour.duration = updateTourDto.duration;
    tour.start_date = new Date(updateTourDto.start_date);
    tour.end_date = new Date(updateTourDto.end_date);
    tour.available_seats = updateTourDto.available_seats;
    tour.sale_percentage = updateTourDto.sale_percentage;

    if (images && images.length > 0) {
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          return await this.cloudinaryService.uploadAndReturnImageUrl(file);
        }),
      );
      tour.images = imageUrls;
    }
    await this.entityManager.save(tour);

    return { tour, message: 'Tour updated successfully' };
  }

  async remove(id: string) {
    const tour = await this.tourRepository.findOne({
      where: { id },
    });

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }
    await this.entityManager.remove(tour);
    return { message: 'Tour deleted successfully' };
  }
}
