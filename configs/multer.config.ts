import { MulterOptionsFactory } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as multer from "multer";
import * as fs from "fs"
import * as path from "path"
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from "@nestjs/common";

export class MulterConfig implements MulterOptionsFactory{

  createMulterOptions(){
    const imgPath = path.join(__dirname,"..","..","postFile","img")
    const mp3Path = path.join(__dirname,"..","..","postFile","mp3")
    const option = {
      storage : multer.diskStorage({
        destination: function (req, file, cb) {
          if (file.mimetype=="image/png") {
            cb(null,imgPath)
          }else if(file.mimetype=="audio/mpeg"){
            cb(null,mp3Path)
          }
        },
        filename: (req, file, cb)=>{
          // 파일명 조작 (ex: 임의의 이름 생성 + 확장자)
          const extname = path.extname(file.originalname)//파일확장자 가져오기
          const uniqueFileName = `${uuidv4()}${extname}`;
          cb(null,uniqueFileName)
        },
      }),
      fileFilter : (req,file,cb)=>{
        if (file.mimetype=="image/png"||file.mimetype=="image/jpeg") {
          cb(null,true)
          return
        }else if(file.mimetype=="audio/mpeg"){
          cb(null,true)
          return
        }
        cb(null,false)
      }
      
    }
    return option
  }
  
}