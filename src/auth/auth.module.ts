import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthJwtGurad } from './auth.jwt.gurad';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';

@Module({
  imports : [
    JwtModule.register({
    secret : "secret",
    signOptions : {expiresIn : "3000000s"}, 
  }),
  TypeOrmModule.forFeature([User])

  ],
  controllers: [AuthController],
  providers: [AuthService,AuthJwtGurad,],
  exports : [JwtModule,AuthService,AuthJwtGurad]
})
export class AuthModule {}
