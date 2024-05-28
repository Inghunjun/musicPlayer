import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfig } from 'configs/multer.config';
import { diskStorage } from 'multer';
import * as path from "path"
import { v4 as uuidv4 } from 'uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Music } from 'entities/music.entity';

@Module({
  imports : [
    MulterModule.registerAsync({
      useClass : MulterConfig
  }),
  TypeOrmModule.forFeature([User,Music]),
  AuthModule
],
  controllers: [MusicController],
  providers: [MusicService],
})
export class MusicModule {}
