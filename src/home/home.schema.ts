import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema({ _id: true })
class FileItem {
    @Prop()
    image: string;
}
const FileItemSchema = SchemaFactory.createForClass(FileItem);
@Schema({ _id: true })
class Header {
    @Prop({ unique: true, index: true })
    email: string
    @Prop({ unique: true, index: true })
    phone: string
    @Prop()
    address: string
}
@Schema({ _id: true })
class Herosection {
    @Prop({type:[FileItemSchema],default:[]})
    files: FileItem[];
    @Prop()
    text: string
}
@Schema({ _id: true })
class Corporates{
    @Prop({type:[FileItemSchema],default:[]})
    files: FileItem[];
}
@Schema({ _id: true })
class AboutUs {
    @Prop({type:[FileItemSchema],default:[]})
    files:FileItem[];
    @Prop()
    text: string
}
@Schema({ _id: true })
class ChooseUs {
    @Prop({type:[FileItemSchema],default:[]})
    files:FileItem[];
    @Prop()
    text: string
}
@Schema({ _id: true })
class GetInTouch{
    @Prop({type:[FileItemSchema],default:[]})
    files:FileItem[];
    @Prop()
    text:string
}
@Schema({ _id: true })
class Footer{
    @Prop({type:[FileItemSchema],default:[]})
    files:FileItem[];
    @Prop()
    text:string
}

@Schema({ timestamps: true })
export class Home {
    @Prop({ type: Header })
    header?: Header
    @Prop({ type: Herosection })
    herosection?: Herosection
    @Prop({ type: AboutUs })
    aboutus?: AboutUs
    @Prop({ type: ChooseUs })
    chooseus?: ChooseUs
    @Prop({type:Corporates})
    corporates?:Corporates
    @Prop({type:GetInTouch})
    getintouch?:GetInTouch
    @Prop({type:Footer})
    footer?:Footer
}
export type HomeDocument = Home & Document
export const HomeSchema = SchemaFactory.createForClass(Home)