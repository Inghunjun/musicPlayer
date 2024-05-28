import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsString, Length } from "class-validator";

export class CreateMusicDto {

  @Exclude()
  musicId : string;

  @Exclude()
  img : string

  @Exclude()
  sound : string

  @Exclude()
  userName : string

  @Exclude()
  uuid : string

  @Exclude()
  disclosure : boolean

  @IsString()
  @Length(1,50)
  @ApiProperty({ description: '제목' })
  title : string
}
