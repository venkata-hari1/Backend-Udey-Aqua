import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HomeModule } from './home/home.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
  ConfigModule.forRoot({isGlobal:true}),
  JwtModule.registerAsync({
    global:true,
    imports:[ConfigModule],
    useFactory:async(configService:ConfigService)=>({
      secret:configService.get('JWT_KEY'),
      signOptions:{expiresIn:'100d'}
    }),
    inject:[ConfigService]
  }),
  MongooseModule.forRootAsync({
    imports:[ConfigModule],
    useFactory:async(configService:ConfigService)=>({
      uri:configService.get<string>('MONGO_URL')
    }),
    inject:[ConfigService]
  }),
  HomeModule,
  AuthModule
  ],
 
})
export class AppModule {}
