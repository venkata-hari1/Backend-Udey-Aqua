import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    async register(model,body){
     try{
        const salt=await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(body.password,salt)
        const data = {
            ...body,
            password:hashPassword, 
          };
        const result=await model.findOneAndUpdate({},{$set:data},{upsert:true,new:true})
        return {
            message: 'Admin registered successfully',
            admin: result,
          };
     }
     catch(err){
        throw new InternalServerErrorException(err.message || err)
     }
    }
    async login(model,JwtService,body){
    try{
        const exist=await model.findOne({email:body.email}).lean()
        if(!exist){
          throw new NotFoundException('Email Not exist')
        }
        const IsPassword=await bcrypt.compare(body.password,exist.password)
        if(!IsPassword){
            throw new BadRequestException('Invalid creditional')
        }
        const payload={
            user:{
                id:exist._id,
                email:exist.email
            }
        }
        const accesstoken=await JwtService.signAsync(payload)
        return {status:true,accesstoken}
    }
    catch(error){
        throw new InternalServerErrorException(error)
    }
    }
}

