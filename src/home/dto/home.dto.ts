import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested, ArrayMinSize, IsObject, minLength, MinLength, Matches, IsNumber } from 'class-validator';
import { emailRegex, phoneRegex } from 'src/utils/validate';
export class FileDto {
  @IsNotEmpty()
  @IsString()
  image: string;
}
export class TextDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  text: string;
}
export class TextWithFilesDto extends TextDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];
}

export class HeroSectionDto extends TextWithFilesDto {}
export class AboutUsDto extends TextWithFilesDto {}
export class ChooseUsDto extends TextWithFilesDto  {}
export class Corporates extends TextWithFilesDto {}
export class GetInTouch extends TextWithFilesDto{}
export class Footer extends TextWithFilesDto{}


export class HeaderDto {
  @IsNotEmpty()
  @IsString()
  @Matches(emailRegex,{message:'Invalid Email'})
  email: string;

  @IsNotEmpty()
  @IsNumber() 
  @Matches(phoneRegex,{message:'Invalid Indian phone number'})
  phone:number;

  @IsNotEmpty()
  @IsString()
  address: string;
}

export class HomeDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => HeaderDto)
  header?: HeaderDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HeroSectionDto)
  herosection?: HeroSectionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AboutUsDto)
  aboutus?: AboutUsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ChooseUsDto)
  chooseus?: ChooseUsDto;

  @IsOptional()
  @ValidateNested()
  @Type(()=>Corporates)
  corporates?:Corporates

  @IsOptional()
  @ValidateNested()
  @Type(()=>GetInTouch)
  getintouch?:GetInTouch

  @IsOptional()
  @ValidateNested()
  @Type(()=>Footer)
  footer?:Footer
}


