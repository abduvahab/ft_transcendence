import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChatMemeber } from "./chatMember.entity";
import { Message } from "src/message/entities/message.entity";


@Entity()
export class Chat {

  constructor() {
    this.messages = null; // Set the default value to null
    this.members = null; // Set the default value to null
  }

  @PrimaryGeneratedColumn()
  id:number

  @Column()
  type:string
  
  @Column()
  name:string

  @ManyToOne(()=>User)
  @JoinColumn({name:"creater_id"})
  creator:User

  @Column({default:false})
  isProtected:boolean

  @Column({nullable:true})
  password:string

  @OneToMany(() => ChatMemeber, (chatMember) => chatMember.chat, { cascade: true, onDelete: "CASCADE" })
  members: ChatMemeber[];

  @OneToMany(() => Message, (message) => message.chat, { cascade: true, onDelete: "CASCADE" })
  messages: Message[];


  @CreateDateColumn()
  createAt:Date;

  @UpdateDateColumn()
  updateAt:Date;

}
