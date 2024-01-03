import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ChatMemeber } from "./chatMember.entity";
import { Message } from "src/message/entities/message.entity";
import { PrivateMessage } from "src/message/entities/privateMessage.entity";


@Entity()
export class PrivateChat {
  constructor() {
    this.messages = null; // Set the default value to null
  }

  @PrimaryGeneratedColumn()
  id:number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user1ID' })
  member1:User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user2ID' })
  member2:User;


  @OneToMany(() => PrivateMessage, (message) => message.chat, { cascade: true, onDelete: "CASCADE" })
  messages: PrivateMessage[];


  @CreateDateColumn()
  createAt:Date;

  @UpdateDateColumn()
  updateAt:Date;

}
