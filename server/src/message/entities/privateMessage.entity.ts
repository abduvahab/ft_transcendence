
import { PrivateChat } from "src/chat/entities/privateChat.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PrivateMessage {

  @PrimaryGeneratedColumn()
  id:number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userID' })
  sender: User;

  @ManyToOne(() => PrivateChat)
  @JoinColumn({ name: 'chatID' })
  chat: PrivateChat;

  @Column()
  text:string

  @CreateDateColumn()
  createAt:Date;

  @UpdateDateColumn()
  updateAt:Date;

}