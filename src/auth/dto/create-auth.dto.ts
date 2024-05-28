import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword, Length } from "class-validator";

export class CreateAuthDto {
  @IsEmail()
  @Length(1,60)
  @ApiProperty({ description: '이메일' })
  email : string;

  @IsStrongPassword()
  @ApiProperty({ description: '비밀번호' })
  password : string
}
