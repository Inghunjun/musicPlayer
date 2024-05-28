import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, Req, UploadedFile, ConsoleLogger, Res, BadRequestException } from '@nestjs/common';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthJwtGurad } from 'src/auth/auth.jwt.gurad';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('music')
@ApiTags('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post('/uploads')
  @UseGuards(AuthJwtGurad)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary : '업로드', description : '업로드'})
  @ApiOkResponse({description : "성공"})
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'mp3', maxCount: 1 },
    { name: 'img', maxCount: 1, },
  ]))
  async uploadFile(
    @UploadedFiles() files : {mp3 : Express.Multer.File[], img : Express.Multer.File[],},
    @Body() createMusicDto : CreateMusicDto,
    @Req() req : Request
    ) {
      return await this.musicService.upload(files,createMusicDto,req);
  }

  /*
  @Post("/create")
  @UseGuards(AuthJwtGurad)
  @ApiOperation({ summary : '노래 게시물 생성', description : '노래 게시물 생성'})
  @ApiCreatedResponse({description :"생성 성공"})
  create(@Body() createMusicDto : CreateMusicDto, @Req() req : Request){
    return this.musicService.create(createMusicDto,req)
  }*/

  @Get("/findMyMusic")
  @UseGuards(AuthJwtGurad)
  @ApiOperation({ summary : '나의 노래 찾기', description : '나의 노래 찾기'})
  @ApiOkResponse({description : "찾기 성공", schema: {
    example : {
      response: {
        musicData : [
            {
                musicId: "6e485b8b-aa3a-4abf-88d7-24cc54637a2d",
                title: "wdwd",
                userName: "내밑에강민우",
                "disclosure": true
            },
            {
                musicId: "f57455dd-f183-4829-a988-65c5f03290c0",
                title: "섹스",
                userName: "내밑에강민우",
                "disclosure": false
            }
        ]
    },
    }
  } 
})
  findMyMusic(@Req() req : Request){
    return this.musicService.findMyMusic(req)
  }


  @Get("musicStream/:musicId")
  @ApiOperation({ summary : '노래재생', description : '노래재생'})
  @ApiOkResponse({description :"노래재생완"})
  @ApiNotFoundResponse({description : "노래를찾을수없어요"})
  musicStream( @Param("musicId") musicId : string,@Res() res : Response){
    return this.musicService.musicStream(musicId,res)
  }

  @Get('/img/:musicId')
  @ApiOperation({ summary : '이미지불러오기', description : '이미지불러오기'})
  async serveImage(@Param("musicId") musicId : string,@Res() res: Response) {
    return this.musicService.imgload(musicId,res)
  }

  

  @Get("/search/:search")
  @ApiOperation({ summary : '검색', description : '검색'})
  @ApiOkResponse({description : "검색성공",schema : {example : {    "response": {
    musicData: [
        {
            musicId : "6e485b8b-aa3a-4abf-88d7-24cc54637a2d",
            title : "wdwd",
            userName : "내밑에강민우"
        }
    ]
},}}})
  search(@Param("search") search : string) {
    return this.musicService.search(search);
  }

  @Get("/findAll")
  @ApiOperation({ summary : '모두찾기', description : '모두찾기'})
  @ApiOkResponse({description : "성공",schema : {example : {    "response": {
    musicData: [
        {
            musicId : "6e485b8b-aa3a-4abf-88d7-24cc54637a2d",
            title : "wdwd",
            userName : "내밑에강민우"
        },
        {
          musicId : "string",
          title : "string",
          userName : "string"
      }
    ]
},}}})
  findAll() {
    return this.musicService.findAll();
  }

  @Get(':musicId')
  @ApiOperation({ summary : '상세보기', description : '상세보기'})
  @ApiOkResponse({description : " 상세보기 성공"})
  findOne(@Param('musicId') musicId: string) {

    return this.musicService.findOne(musicId);
  }

  @Patch(':musicId')
  @UseGuards(AuthJwtGurad)
@ApiOperation({ summary : '수정', description : '수정', requestBody : {content : {'application/json' : {example : {title : "string"}}}}})
  update(@Param('musicId') musicId: string, @Body() updateMusicDto: UpdateMusicDto, @Req() req : Request) {
    return this.musicService.update(musicId, updateMusicDto,req);
  }

  @Patch('disclosure/:musicId')
  @UseGuards(AuthJwtGurad)
  @ApiOperation({ summary : '공개 또는 비공개로 전환', description : '공개면비공개로 비공개면 공개로 전환합니다 description=true 공개 false 비공개'})
  disclosure(@Param('musicId') musicId : string,@Req() req : Request) {
    return this.musicService.disclosure(musicId,req);
  }

  @Patch("/upload/:musicId")
  @UseGuards(AuthJwtGurad)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary : '업로드된 파일 수정', description : '노래 또는 사진업로드'})
  @ApiNotFoundResponse({description : "게시물이없어요"})
  @ApiCreatedResponse({description :"업로드 성공"})
  upload(@UploadedFile() file : Express.Multer.File,@Req() req : Request, @Param("musicId") musicId : string) {
    console.log(file)
    return this.musicService.uploads(musicId,file,req);
  }

  @Delete(':musicId')
  @UseGuards(AuthJwtGurad)
  @ApiOperation({ summary : '삭제', description : '삭제'})
  @ApiOkResponse({description : "삭제완료"})
  remove(@Param('musicId') musicId : string,@Req() req : Request) {
    return this.musicService.remove(musicId,req);
  }

}
