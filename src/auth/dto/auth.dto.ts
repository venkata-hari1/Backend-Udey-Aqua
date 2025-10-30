import { IsNotEmpty, IsString, Matches } from "class-validator";
import { emailRegex, PasswordRegex } from "src/utils/validate";
class EmailDto{
    @IsString()
    @IsNotEmpty()
    @Matches(emailRegex,{message:'Invalid email'})
    email:string
}
export class RegsiterDto extends EmailDto{
   
    @IsString()
    @IsNotEmpty()
    @Matches(PasswordRegex,{message:'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'})
    password:string
}
export class LoginDto extends EmailDto{
    @IsNotEmpty()
    password:string

}