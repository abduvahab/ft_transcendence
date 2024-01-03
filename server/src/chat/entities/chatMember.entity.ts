import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity()
export class ChatMemeber {

  @PrimaryGeneratedColumn()
  id:number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userID' })
  user: User;

  @ManyToOne(() => Chat)
  @JoinColumn({ name: 'chatID' })
  chat: Chat;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ default: false })
  isCreator: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false })
  isMuted: boolean;
  
  @CreateDateColumn()
  createAt:Date;

  @UpdateDateColumn()
  updateAt:Date;

}