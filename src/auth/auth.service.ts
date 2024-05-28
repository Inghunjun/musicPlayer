import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"
import { Response,Request } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private jwtService : JwtService,
    @InjectRepository(User)
    private user : Repository<User>
  ){}

  async login(createAuthDto : CreateAuthDto){
    const {email,password} = createAuthDto
    try{
      const userdata = await this.user.findOne({where : {email}})
      if (!userdata) {
        throw new NotFoundException({message : "일치하는 유저를 찾을 수 없음"})
      }
      const hashPassword = await bcrypt.hash(password,userdata.salt)
      if (userdata.password!=hashPassword) {
      throw new UnauthorizedException({message : "비밀번호가 일치 하지 않음"})
      }

      const token = this.jwtService.sign({uuid : userdata.uuid, name : userdata.name})
      return new HttpException({token : token, status : HttpStatus.OK},200)
    }catch(error){
      if(error){
        throw error
      }else{
        throw new HttpException({},500)
      }
    }
  }



  async verify(req : Request){
    try{
      const token = this.getToken(req)
      if (!token) {
         throw new UnauthorizedException("만료된거나 없는토큰")
      }
      const verify = await this.jwtService.verifyAsync(token,{secret : "secret"})
      return verify
    }catch (error) {
      if (error) {
        throw error
      }else{
        throw new HttpException({},409)
      }
    }
  }

  getToken(req : Request){
    const authorization = req.headers.authorization;
    if(authorization && authorization.startsWith("Bearer ")){//Bearer으로 시작하는 문자열 찾기 
      return authorization.split(" ")[1]//공백을 기준으로 배열로 분할 
    }
    return null
  }

} 
