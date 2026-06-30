import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Types } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.create(createProductDto)
    if(!product) return null
    return product;
  }

  async findAll() {
    const products = await this.productModel.find()
    if(!products) return null
    return products;
  }

  async findOne(id: string) {
    const product = await this.productModel.findOne({_id:new Types.ObjectId(id)})
    if(!product) return null
    return product;
  }

 async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(new Types.ObjectId(id),updateProductDto,{new:true})
    if(!product) return null
    return product;
  }

 async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(new Types.ObjectId(id),{new:true})
    if(!product) return null
    return product;
  }
}
