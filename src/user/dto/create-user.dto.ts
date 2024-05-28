import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsBoolean, IsEmail, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @Exclude()
  uuid : string;
  
  @IsString()
  @ApiProperty({ description: '이름' })
  name : string;

  @IsEmail()
  @ApiProperty({ description: '이메일' })
  email : string;

  @IsStrongPassword()//특수문자 대문자 소문자 숫자
  @ApiProperty({ description: '비번' })
  password : string;

  @Exclude()
  salt : string;

}
