import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ConflictException } from '@nestjs/common';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    if(!product) return new ConflictException("no se pudo crear en producto")
    return {status:"success",payload:product}
  }

  @Get()
  async findAll() {
    const products = await this.productsService.findAll();
    if(!products) return new ConflictException("error al obtener los productos")
    return {status:"success",payload:products}
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    if(!product) return new ConflictException("error al obtener el producto")
    return {status:"success",payload:product}
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const product = await this.productsService.update(id, updateProductDto);
    if(!product) return new ConflictException("error al actualizar el producto")
    return {status:"success",payload:product}
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.productsService.remove(id);
    if(!product) return new ConflictException("error al eliminar el producto")
    return {status:"success",payload:product}
  }
}
