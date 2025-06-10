import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create_cart.dto';
import { CartService } from './cart.service';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GetCartsDto } from './dto/get_cart.dto';
import { UpdateCartDto } from './dto/update_cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiBody({ type: CreateCartDto })
  @ApiResponse({ status: 201, description: 'Cart created successfully' })
  async create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of carts' })
  async getAll(@Query() params: GetCartsDto) {
    return this.cartService.getAll(params);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Cart found successfully' })
  async get(@Param('id') id: string) {
    return this.cartService.get(id);
  }

  @Get('/user/:userId')
  @ApiResponse({ status: 200, description: 'Cart found successfully' })
  async getByUserId(@Param('userId') userId: string) {
    return this.cartService.getCartByUserId(userId);
  }

  @Patch('id')
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({ status: 200, description: 'Cart updated successfully' })
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    const result = await this.cartService.update(id, updateCartDto);
    return { result, message: 'Success' };
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Cart deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
