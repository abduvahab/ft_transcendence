
import { User } from 'src/user/entities/user.entity';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity()
export class Game {

    /* **************** */
    /* Game information */
    /* **************** */

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({name:"playerOne_id"})
    playerOne: User;

    @ManyToOne(() => User)
    @JoinColumn({name:"playerTwo_id"})
    playerTwo: User;

    @Column()
    scorePlayerOne: number;

    @Column()
    scorePlayerTwo: number;

    @Column()
    playedOn: Date;
}
