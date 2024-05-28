import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from "bcrypt"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private user : Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager : Cache
  ){}

  async create(createUserDto: CreateUserDto) {//회원가입
    try{
      console.log("asflj")
      const {email,name,password} = createUserDto
      const userdata = await this.user.findOne({where : {email : email,name}})
      const cacheData = await this.cacheManager.get(email)
      console.log(cacheData)
      if (userdata) {
        throw new HttpException({status : HttpStatus.CONFLICT},409)//아이디 또는이메일 중복
      }
      if (!cacheData) {
        throw new HttpException({status : HttpStatus.BAD_REQUEST},404)//이메일 인증이 되지 않은경우
      }
      if (cacheData[0]!=1) {
        throw new HttpException({status : HttpStatus.BAD_REQUEST},404)//이메일 인증이 되지 않은경우
      }

      createUserDto.salt = await bcrypt.genSalt();
      createUserDto.password = await bcrypt.hash(password,createUserDto.salt)
      console.log(createUserDto.password)

      await this.user.save(createUserDto)
      await this.cacheManager.del(email)//이메일 인증 완료하고 회원가입 완료우 캐시 삭제
      return new HttpException({status : HttpStatus.CREATED},201)

    }catch (error) {
      if(error) {
        throw error
      }else {
        console.log(error)//Helloo1!
        throw new HttpException({status : HttpStatus.INTERNAL_SERVER_ERROR},500)
      }
    }
  }

  async reSetPassword(updateUserDto : UpdateUserDto){
    try{
      const userData = await this.user.findOne({where : {email : updateUserDto.email}})
      if(updateUserDto.email||updateUserDto.email){
        throw new BadRequestException("존재하지 않는 이메일")
      }

      const cacheData = await this.cacheManager.get(updateUserDto.email)
      if(!cacheData||cacheData[0]==0){
        throw new UnauthorizedException("인증되지 않은이메일")
      }
      
      //이메일 인증후 존재하늰 계정일겨우
      const hashPassword = await bcrypt.hash(updateUserDto.password,userData.salt)
      userData.password = hashPassword
      await this.user.save(userData);
      return new HttpException({status : HttpStatus.OK},200)
      
    }catch(error){
      if(error){
        throw error
      }else{
        throw new HttpException({status : HttpStatus.INTERNAL_SERVER_ERROR},500)
      }
    }
  }

}
