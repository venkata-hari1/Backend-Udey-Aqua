import { CanActivate, createParamDecorator, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class ValidationGuard implements CanActivate {
  constructor(
    private readonly JwtService:JwtService,
    private readonly ConfigService:ConfigService
  ){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request=context.switchToHttp().getRequest()
    const authHeader=request.headers['authorization']
    const[type,token]=authHeader?.split(' ') ?? []
    if(type!=='Bearer' ||  !token){
      throw new UnauthorizedException()
    }
    const secret=this.ConfigService.get('JWT_KEY') 
    try{
      const decode=await this.JwtService.verifyAsync(token,{secret})
       request.user=decode
      return true
    }
    catch(error){
      throw new UnauthorizedException(error)
    }

  }
}

export const GetUser=createParamDecorator(( data:unknown,context: ExecutionContext,)=>{
 const request=context.switchToHttp().getRequest()
 console.log(request.user)
 return request.user
})