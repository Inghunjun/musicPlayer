import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateMailDto {
  @IsEmail()
  @Length(1,60)
  @ApiProperty({ description: '이메일' })
  email : string;

}
