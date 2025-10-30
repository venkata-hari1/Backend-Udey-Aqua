import { PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { emailRegex, PasswordRegex } from "src/utils/validate";

class EmailDto{
    @IsString()
    @IsNotEmpty()
    @Matches(emailRegex,{message:'Invalid email'})
    email:string
    @IsString()
    @IsNotEmpty()
    @Matches(PasswordRegex,{message:'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'})
    password:string
}
export class ForgetPasswordDto extends PickType(EmailDto,['email'] as const){}
export class RegsiterDto extends EmailDto{}
export class LoginDto extends EmailDto{}
export class ResetPasswordDto extends EmailDto{
    @Matches(PasswordRegex,{message:'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'})
    confirmpassword:string
}