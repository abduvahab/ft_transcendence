import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {


    @PrimaryGeneratedColumn()
    id:number

    @Column({unique:true, nullable:false})
    username:string

    @Column({unique:true, nullable:false})
    name:string

    @Column({nullable:false})
    email:string

    @Column({nullable:true})
    password:string

    @Column({default:0})
    rank:number
    
    @Column({default:0})
    matchs:number

    @Column({default:0})
    wins:number
 ///code ------------------------------
    @Column({ default: 0 })
	lose: number;

	@Column({type: "decimal", scale: 2, default: 0 })
	streak: number;

    @Column({default: 0})
	xp: number;

	//Stat for the ladder
	@Column({default: 500})
	elo: number;
 ///code ------------------------------
    @Column({default:false})
    onLine:boolean

    @Column({default:false})
    inGame:boolean

    @Column({default:false})
    haveInvitatio:boolean

    @Column({nullable:true})
    avatar:string

    @Column({default:false})
    twoFAenabled:boolean

    @Column({nullable:true})
    twoFAsecret:string

    @CreateDateColumn()
    createAt:Date

    @UpdateDateColumn()
    updateAt:Date
}
