import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, HttpException } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';
import { MailAuthDto } from './dto/mailAuth-mail.dto';
import { HttpExceptionFilter } from 'http-exception.filter';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('mail')
@ApiTags('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post("/send")
  @ApiOperation({ summary: '인증메일발송', description: '인증메일발송'})
  @ApiOkResponse({description : "메일발송성공", })
  sendMail(@Body() createMailDto : CreateMailDto){
    return this.mailService.asendMail(createMailDto)
  }

  @Post("/auth")
  @ApiOperation({ summary: '메일인증하기', description: '메일인증하기'})
  @ApiOkResponse({ description: '메일인증하기'})
  @ApiNotFoundResponse({ description : "인증번호가 맞지 않아요" })
  @ApiBadRequestResponse({ description : "인증메일부터 발송해 주세요" })
  authMail(@Body() mailAuthDto : MailAuthDto){
    
    return this.mailService.authMail(mailAuthDto)
  }
}
