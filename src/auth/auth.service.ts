import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { generateOTP } from 'src/utils/Otp';

@Injectable()
export class AuthService {
    async register(model, body) {
       try{
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(body.password, salt)
        const data = {
            ...body,
            password: hashPassword,
        };
        const result = await model.findOneAndUpdate({}, { $set: data }, { upsert: true, new: true })
        return {
            message: 'Admin registered successfully',
            admin: result,
        };
    }
    catch(error){
        throw new InternalServerErrorException('Failed to generate OTP');
    }
    }
    async login(model, JwtService, body) {
        try{
        const exist = await model.findOne({ email: body.email }).lean()
        if (!exist) {
            throw new NotFoundException('Email Not exist')
        }
        const IsPassword = await bcrypt.compare(body.password, exist.password)
        if (!IsPassword) {
            throw new BadRequestException('Invalid creditional')
        }
        const payload = {
            user: {
                id: exist._id,
                email: exist.email
            }
        }
        const accesstoken = await JwtService.signAsync(payload)
        return { status: true, accesstoken }
    }
    catch(error){
        if (error instanceof NotFoundException || error instanceof BadRequestException) {
            throw error; 
          }
        throw new InternalServerErrorException(error);
    }
    }
    async ForgetPassword(Model, body) {
        try{
        const exist = await Model.findOne({ email: body.email }).lean()
        if (!exist) {
            throw new NotFoundException('Email not found. Please enter a registered email.');
        }
        const OTP=generateOTP(4)
        await Model.findOneAndUpdate({email:body.email},{$set:{otp:OTP}},{new:true})
        return { status: true,OTP}
    }
    catch(error){
        if (error instanceof NotFoundException) {
            throw error; 
          }
        throw new InternalServerErrorException(error);
    }
    }
 async ResetPassword(Model,body){
    try{
     
    }
    catch(error){
        if (error instanceof NotFoundException) {
            throw error; 
          }
        throw new InternalServerErrorException(error)
    }
 }
}

