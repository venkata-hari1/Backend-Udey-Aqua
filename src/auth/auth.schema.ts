import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema({timestamps:true})
export class Auth{
    @Prop({required:true,unique:true})
     email:string
    @Prop({required:true})
     password:string
    @Prop()
    otp:string
}
export type AuthDocument=Auth & Document
export const AuthSchema=SchemaFactory.createForClass(Auth)