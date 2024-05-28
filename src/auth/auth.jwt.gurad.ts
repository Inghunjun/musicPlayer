import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "entities/user.entity";
import { Repository } from "typeorm";
import { Request,Response } from "express";
export class AuthJwtGurad implements CanActivate{
  
  constructor(
    private jwtService : JwtService,
   @InjectRepository(User)
    private user : Repository<User>
  ){}
  async canActivate(context: ExecutionContext)  {
    const req = context.switchToHttp().getRequest();//요청객체 가져오기
    const token = this.getToken(req);
    if(!token){
      throw new UnauthorizedException("토큰이없습니다")
    }

    try{
      const loginData = await this.jwtService.verifyAsync(token,{secret : "secret"})
      const data = await this.user.findOne({where : {uuid : loginData.uuid}})
      if(!data){
        throw ({message : "권한이 없습니다", status : 404})
      }
      return true
    } catch(error) {
        throw new UnauthorizedException("토큰이없어요ㅠㅠ")
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