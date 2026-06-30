import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({timestamps:true})
export class Product {

    @Prop({required:true})
    title:string = "";

    @Prop({required:true})
    description:string = "";

    @Prop({required:true})
    price:number = 0;

    @Prop({required:true})
    stock:number = 0;


}


export const ProductSchema = SchemaFactory.createForClass(Product)
