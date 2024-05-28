import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  @ApiOperation({ summary: '로그인', description: '로그인하는거입니다'})
  @ApiUnauthorizedResponse({description : "로그인 실패했을때"})
  @ApiOkResponse({
    description: '성공적으로 로그인했을 때의 응답',
    schema: {
      example : {
        response : { token : "string" }
      }
    }
  })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

}
