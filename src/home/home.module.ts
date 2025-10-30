import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Home, HomeSchema } from './home.schema';
import { AwsService } from 'src/lib/aws';

@Module({
    imports:[MongooseModule.forFeature([{name:Home.name,schema:HomeSchema}])],
    controllers:[HomeController],
    providers:[HomeService,AwsService]
})
export class HomeModule {}
