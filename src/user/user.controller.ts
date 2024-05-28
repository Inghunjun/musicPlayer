import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
//5f6
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/join")//회원가입
  @ApiOperation({ summary : '회원가입', description : '회원가입'})
  @ApiCreatedResponse({description : "회원가입성공"})
  @ApiNotFoundResponse({description : "이메일 인증이 안됨"})
  @ApiConflictResponse({ description: '아이디 또는 이메일 중복' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post("setPassword")
  setPassword(@Body() updateUserDto : UpdateUserDto){
    return this.userService.reSetPassword(updateUserDto)
  }

}
