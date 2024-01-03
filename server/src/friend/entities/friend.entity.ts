
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Friend {

    @PrimaryGeneratedColumn({name:'friend_id'})
    id:number

    @ManyToOne(()=>User)
    @JoinColumn({name:"first_id"})
    first_user:User

    @ManyToOne(()=>User)
    @JoinColumn({name:"second_id"})
    second_user:User

    @Column({nullable:true})
    status:string

    @CreateDateColumn()
    createAt:Date;

    @UpdateDateColumn()
    updateAt:Date;

}
