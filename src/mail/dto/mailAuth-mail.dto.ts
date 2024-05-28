import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class MailAuthDto {
  @IsEmail()
  @ApiProperty({ description: '이메일' })
  email : string;

  @IsString()
  @Length(4)
  @ApiProperty({ description: '이메일' })
  authNumber : string
}
