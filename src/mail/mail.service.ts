import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { MailAuthDto } from './dto/mailAuth-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService : MailerService,
    @Inject(CACHE_MANAGER)
    private cacheManager : Cache
  ){}

  async asendMail (createMailDto : CreateMailDto) : Promise<any> {
    const {email} = createMailDto
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;//난수생성
    console.log(randomNumber)
    try{
      await this.mailerService.sendMail({
        to : email,
        from : "bimilbimil613@gmail.com",
        subject : "subject",  
        text : `${randomNumber}`,
        html : ""
      })
      
      await this.cacheManager.set(email,[0,`${randomNumber}`])
      return new HttpException({status : HttpStatus.OK},200)
    }catch (error) {
      console.log("hello")
      console.log(error)
      throw new HttpException("ise",500)
    }
  }

  async authMail(MailAuthDto : MailAuthDto){
    try{
      const {email,authNumber} = MailAuthDto
      const cacheData = await this.cacheManager.get(email)
      if (!cacheData) {
        throw new HttpException({
          status : HttpStatus.NOT_FOUND,
          message : "이메일 발송부터해주세요",
        },404)
      }
      if (cacheData[1]!=authNumber) {
        throw new HttpException ({
          status : HttpStatus.BAD_REQUEST,
          message : "인증번호가 맞지 않아요"
        },400)
      }

      await this.cacheManager.set(email,[1,authNumber])
      const test = await this.cacheManager.get(email)
      console.log(test)
      return new HttpException({
        status : HttpStatus.OK
      },200)      
    }catch (error) {
      if (error) {
        throw error
      }else {
        throw new HttpException("ise",500)
      }
    }
  }


}
