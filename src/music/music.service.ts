import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Music } from 'entities/music.entity';
import { Like, Repository } from 'typeorm';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import * as path from "path"
import * as fs from "fs"

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private music : Repository<Music>,
    private authService : AuthService
  ){}

  async create(createMusicDto: CreateMusicDto,req : Request) {
    try{
      const verify = await this.authService.verify(req)
      createMusicDto.userName = verify.name
      createMusicDto.uuid = verify.uuid

      await this.music.save(createMusicDto)
      return new HttpException({status : HttpStatus.CREATED },201)
    }catch(error){
      if(error){
        throw error
      }else{
        console.log(error)
        throw new HttpException({status : HttpStatus.INTERNAL_SERVER_ERROR},500)
      }
    }
  }

  async upload(
    files : {mp3 : Express.Multer.File[], img : Express.Multer.File[],},
    createMusicDto : CreateMusicDto,
    req : Request
    ){
    try{
      
      const verify = await this.authService.verify(req)
      createMusicDto.userName = verify.name
      createMusicDto.uuid = verify.uuid

      const filePath = path.join(__dirname,"..","..","..","postFile")
      const mp3File = files.mp3 ? files.mp3[0] : null; // Get the first mp3 file if exists
      const imgFile = files.img ? files.img[0] : null; // Get the first img file if exists)

      if (!mp3File&&imgFile) {
        await this.fileUnlink(`${filePath}/${imgFile.destination.slice(-3)}/${imgFile.filename}`)
        throw new BadRequestException()
      }else if(!imgFile&&mp3File){
        await this.fileUnlink(`${filePath}/${mp3File.destination.slice(-3)}/${mp3File.filename}`)
       throw new BadRequestException()
      }

      if(imgFile.mimetype!="image/png"||mp3File.mimetype!="audio/mpeg"){
        await this.fileUnlink(`${filePath}/${imgFile.destination.slice(-3)}/${imgFile.filename}`)
        await this.fileUnlink(`${filePath}/${mp3File.destination.slice(-3)}/${mp3File.filename}`)
        throw new BadRequestException()
      }

      createMusicDto.sound = mp3File.filename
      createMusicDto.img = imgFile.filename

      await this.music.save(createMusicDto)
      console.log("wjsquddn")
      return new HttpException({status : HttpStatus.OK},200)

    }catch(error){
      if(error){
        throw error
      }else{
        console.log("ERERER",error)
        throw new InternalServerErrorException()
      }
    }
  }

  async uploads(musicId : string,file : Express.Multer.File, req : Request){
    try{
      const verify = await this.authService.verify(req)
      
      const filePath = path.join(__dirname,"..","..","..","postFile",file.destination.slice(-3))
      const extname = path.extname(file.originalname)
      const {name,uuid} = verify
      const musicData = await this.music.findOne({where : {userName : name,musicId}})
      if (!musicData) {
        await this.fileUnlink(`${filePath}/${file.filename}`)
          throw new NotFoundException()
      }
      
      if (file.mimetype=="audio/mpeg") {
        if (musicData.sound) {
          await this.fileUnlink(`${filePath}/${musicData.sound}`)
        }
        musicData.sound = file.filename

      }else {
        if (musicData.img) {
          await this.fileUnlink(`${filePath}/${musicData.img}`)
          }
        musicData.img = file.filename
      }

      await this.music.save(musicData)
      return new HttpException({status : HttpStatus.CREATED},201)

    }catch(error){
      if (error) {
        throw error
      }else {
        throw new HttpException({},500)
      }
    }
  }

  async musicStream(musicId : string, res : Response){
    try{
      const musicData = await this.music.findOne({where : {musicId}})
      console.log("msuciData : ",musicData)
      if(!musicData){
        throw new NotFoundException()
      }

      const mp3Path = path.join(__dirname,"..","..","..","postFile","mp3",musicData.sound)
      if (!fs.existsSync(mp3Path)) {
        throw new NotFoundException()
      }

      const stat = fs.statSync(mp3Path);
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size,
      });

      const readStream = fs.createReadStream(mp3Path);
      readStream.pipe(res);

    }catch(error){
        throw error
    }
  }

  async findMyMusic(req : Request){
    try{
      const verify = await this.authService.verify(req)
      const {name,uuid} = verify

      const musicData = await this.music.find({
        where : {userName : name,uuid},
        select : ["musicId","title","userName","disclosure"]
      })
      
      return new HttpException({status : HttpStatus.OK, musicData},200)
      
    }catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  async findAll() {
    try{
      const musicData = await this.music.find({
        select : ["title","userName","musicId"],
      });

      return new HttpException({status : HttpStatus.OK,musicData},200)
    }catch(error){
      throw new InternalServerErrorException()
    }
  }
  
  async search(find : string) {
    try{
      const musicData = await this.music.find({
        select : ["title","userName","musicId"], 
        where : {title : Like(`%${find}%`)}
      });

      return new HttpException({status : HttpStatus.OK,musicData},200)
    }catch(error){
      throw new InternalServerErrorException()
    }
  }

  async findOne(musicId: string) {//상세보기
    try{
      const musicData = await this.music.findOne({
        where : {musicId},
        select : ["title","userName","musicId"]
      })

      if (!musicData) {
        throw new NotFoundException()
      }
      return new HttpException({status : HttpStatus.OK,musicData},200)

    }catch (error) {

      if (error) {
        throw error
      }else { 
        throw new HttpException({},500)
      }
    }
  }

  async update(musicId: string, updateMusicDto: UpdateMusicDto,req : Request) {
    try{
      const verify = await this.authService.verify(req)
      const {name,uuid} = verify
      const musicData = await this.music.findOne({where : {userName : name,musicId,uuid}})
      if(!musicData){
        throw new NotFoundException()
      }

      musicData.title = updateMusicDto.title
      await this.music.save(musicData)
      return new HttpException({status : HttpStatus.CREATED},201)
    }catch(error){

      if(error){
        throw error
      }else{
        throw new InternalServerErrorException()
      }
    }
  }

  async remove(musicId: string,req : Request) {
    try{
      const verify = await this.authService.verify(req)
      const {name,uuid} = verify
      const musicData = await this.music.findOne({where : {userName : name,musicId,uuid}})

      if(!musicData){
        throw new NotFoundException()
      }
      await this.music.remove(musicData)

      return new HttpException({status : HttpStatus.OK},200)

    }catch(error){

      if (error) {
        throw error
      }else {
        throw new InternalServerErrorException()
      }
    }
  }

  async disclosure(musicId: string,req : Request){
    try{
      const verify = await this.authService.verify(req)
      const {name,uuid} = verify
      const musicData = await this.music.findOne({where : {userName : name,musicId,uuid}})

      if(!musicData){
        throw new NotFoundException()
      }
      
      if(!musicData.img||!musicData.sound){
        throw new BadRequestException({message : "사진과노래가모두올라와있어야가능합니다"})
      }

      if(musicData.disclosure==true){
        musicData.disclosure = false
      }else{
        musicData.disclosure = true
      }

      await this.music.save(musicData)
      return new HttpException({status : HttpStatus.OK,disclosure : musicData.disclosure },200)

    }catch(error){

      if (error) {
        throw error
      }else {
        throw new InternalServerErrorException()
      }
    }
  }

  async imgload(musicId : string,res : Response){
    try{
      const ffilePath = path.join(__dirname,"..","..","..","postFile","img")
      const musicData = await this.music.findOne({where : {musicId}})
      
      if(!musicData||!musicData.img){
        throw new NotFoundException()
      }

      const filePath = path.resolve(ffilePath,`${musicData.img}`);
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }

      throw new NotFoundException()

    }catch(error){

      if (error) {
        throw error
      }else {
        throw new InternalServerErrorException()
      }
    }
  }

  async fileUnlink(filePath : string){
    console.log(filePath)
    try{
       fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          return null;
        }
        fs.unlink(`${filePath}`,(error)=>{
          if(error){
            console.log(error)
          }
        });
      });
    }catch(error){
     // console.log(error)
    }
}
}
