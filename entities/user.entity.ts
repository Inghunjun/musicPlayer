import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Music } from "./music.entity";

@Entity({schema : "soundcloud", name : "user"})
export class User {
  @PrimaryGeneratedColumn("uuid")
  uuid : string;

  @Column({name : "name",type : "varchar", length : 12 ,unique : true})
  name : string

  @Column({name : "email", type : "varchar",length : 60,unique : true})
  email : string;

  @Column({name : "password", type : "text"})
  password : string;

  @Column({name : "salt", type : "text"})
  salt : string;

  @OneToMany(()=>Music,(music)=>music.uuid,{cascade : true})
  useruuid : Music | string
} 