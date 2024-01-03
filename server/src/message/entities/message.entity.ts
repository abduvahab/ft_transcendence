
import { Chat } from "src/chat/entities/chat.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Message {

  @PrimaryGeneratedColumn()
  id:number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userID' })
  sender: User;

  @ManyToOne(() => Chat)
  @JoinColumn({ name: 'chatID' })
  chat: Chat;

  @Column()
  text:string

  @CreateDateColumn()
  createAt:Date;

  @UpdateDateColumn()
  updateAt:Date;

}
