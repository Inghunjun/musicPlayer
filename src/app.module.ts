import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from 'orm.config';
import { CacheModule } from '@nestjs/cache-manager';
import { MailModule } from './mail/mail.module';
import { MusicModule } from './music/music.module';
  import { ConfigModule } from '@nestjs/config';


@Module({
  imports : [
    AuthModule, UserModule,MailModule,MusicModule,
    TypeOrmModule.forRootAsync({useFactory : ormConfig}),
    CacheModule.register({
      ttl : 120000,//캐싱시간
      max : 200,//최대수
      isGlobal : true
    }),
    ConfigModule.forRoot({
      isGlobal : true
    })
    
  ],
  providers : [],
})
export class AppModule {}

//npm i cookie-parser @types/cookie-parser
//npm install class-transformer
//npm install class-validator  
//npm i @nestjs/jwt
//npm i @nestjs/typeorm typeorm mysql2
//npm i @types/nodemailer nodemailer
