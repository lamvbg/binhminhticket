import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from 'src/entities/discount.entity';
import { In, Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create_discount.dto';
import { GetDiscountDto } from './dto/get_discount.dto';
import { PageMetaDto } from 'src/common/dtos/pageMeta';
import { ResponsePaginate } from 'src/common/dtos/reponsePaginate';

@Injectable()
export class DiscountService {
    constructor(
        @InjectRepository(Discount)
        private readonly discountRepository: Repository<Discount>,
    ) {}

    async create(createDiscountDto: CreateDiscountDto) {
        const discount = new Discount(createDiscountDto);
        await this.discountRepository.save(discount);
        return { discount, message: 'Discount created successfully' };
    }

    async getAll(params: GetDiscountDto) {
        const discounts = this.discountRepository
        .createQueryBuilder('discount')
        .select(['discount'])
        .skip(params.skip)
        .take(params.take)
        .orderBy('discount.createdAt', 'DESC');

        if (params.code) {
            discounts.andWhere('discount.code ILIKE :code', {
                code: `%${params.code}%`,
            });
        }

        const [result, total] = await discounts.getManyAndCount();
        const pageMetaDto = new PageMetaDto({
            itemCount: total,
            pageOptionsDto: params,
        });
        return new ResponsePaginate(result, pageMetaDto, 'Success');
    }

    async get(id: string) {
        const discount = await this.discountRepository
            .createQueryBuilder('discount')
            .select(['discount'])
            .where('discount.id = :id', { id })
            .getOne();
        if (!discount) {
            throw new NotFoundException('Discount not found');
        }
        return { discount, message: 'Success' };
    }

    async update(id: string, updateDiscountDto: CreateDiscountDto) {
        const discount = await this.discountRepository.findOneBy({ id });
        if (!discount) {
            throw new NotFoundException('Discount not found');
        }
        if (discount) {
            Object.assign(discount, updateDiscountDto);
            await this.discountRepository.save(discount);
            return { discount, message: 'Discount updated successfully' };
        }
    }

    async remove(id: string) {
        const discount = await this.discountRepository.findOneBy({ id });
        if (!discount) {
            throw new NotFoundException('Discount not found');
        }
        if (discount) {
            await this.discountRepository.remove(discount);
            return { message: 'Discount deleted successfully' };
        }
    }
}
