import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({schema : "soundcloud", name : "music"})
export class Music {
  @PrimaryGeneratedColumn("uuid",{name : "musicId"})
  musicId : string;

  @Column({name : "img", type : "text", nullable : true})
  img : string

  @Column({name : "sound", type : "text", nullable : true})
  sound : string

  @Column({name : "title", type : "varchar", length : 50})
  title : string

  @Column({name : "username",type : "varchar", length : 12})
  userName : string
  
  @Column({name : "disclosure",type : "boolean", default : false})
  disclosure : boolean

  @ManyToOne(()=>User,(user)=>user.uuid,{onDelete : "CASCADE"})
  uuid : string
}
