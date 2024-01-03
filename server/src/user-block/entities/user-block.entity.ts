
import { User } from "src/user/entities/user.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UserBlock {

    @PrimaryGeneratedColumn({name:'block_id'})
    id:number

    @ManyToOne(()=>User)
    @JoinColumn({name:"blocking_id"})
    blocking_user:User

    @ManyToOne(()=>User)
    @JoinColumn({name:"blocked_id"})
    blocked_user:User

    @CreateDateColumn()
    createAt:Date;

    @UpdateDateColumn()
    updateAt:Date;

}
