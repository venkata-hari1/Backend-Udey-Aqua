import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { HomeService } from './home.service';
import { HeaderDto, HomeDto } from './dto/home.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Home, HomeDocument } from './home.schema';
import {  FilesInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/lib/aws';
import { ValidationGuard } from 'src/jwt/validation/validation.guard';

@Controller('home')
@UseGuards(ValidationGuard)
export class HomeController {
  constructor(private readonly homeservice: HomeService,
    private readonly awsService: AwsService,
    @InjectModel(Home.name) private readonly HomeModel: Model<HomeDocument>) { }
  @Post('header')
  async createHome(@Body() body: HeaderDto) {
    return this.homeservice.create(this.HomeModel, body)
  }
  @Post('common')
  @UseInterceptors(FilesInterceptor('files')) 
  async upload(@UploadedFiles() files:any, @Body() body: HomeDto) {
    let fileUrls: string[] | any = [];

    if (files && files.length > 0) {
       fileUrls = await Promise.all(
        files.map((file) => this.awsService.uploadFile(file))
      );
    }

    return this.homeservice.createFileUpload(this.HomeModel,fileUrls,this.awsService,body);
  } 
  @Get('common')
  async GetHomeData(@Query() query: any){
    return this.homeservice.getCommonData(this.HomeModel,query)
  }
  @Delete('common/:section/:sid/:fid')
  async DeleteHomeImages(@Param('section') section:string,@Param('sid') sid:string ,@Param('fid') fid:string){
    return this.homeservice.DeleteHomeImages(this.HomeModel,section,sid,fid,this.awsService)
  }
}
