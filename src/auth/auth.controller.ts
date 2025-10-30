import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegsiterDto, LoginDto } from './dto/auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './auth.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
@Controller('auth')
export class AuthController {
  constructor(@InjectModel(Auth.name) private readonly Model: Model<AuthDocument>,
    private readonly authService: AuthService,
    private readonly JwtService: JwtService
  ) { }
  @Post('register')
  async register(@Body() body:RegsiterDto) {
    return this.authService.register(this.Model, body)
  }
  @Post('login')
  async login(@Body() body:LoginDto) {
    return this.authService.login(this.Model, this.JwtService, body)
  }

}
