import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "./entities/game.entity";
import { Repository } from "typeorm";
import { GameConstants, GameState, PlayerState, UserSocket } from "./entities/gamestate.entity";
import { GameAuthGuard } from "./jwt/jwt.strategy";
import { Server } from "socket.io";
import { UserService } from "../user/user.service";


@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game)
		private readonly gameRepository: Repository<Game>,
		private readonly userService: UserService,
		private readonly authGuard: GameAuthGuard,
	) {}

	private activeGames: GameState[] = [];
	private sanitizeGameState(game: GameState): GameState {
		const sanitized = {...game};
		delete sanitized.player1_socket;
		delete sanitized.player2_socket;
		delete sanitized.player1_pressUp;
		delete sanitized.player2_pressUp;
		delete sanitized.player1_pressDown;
		delete sanitized.player2_pressDown;
		return sanitized;
	}

	updateGames(server: Server) {
		for (let game of this.activeGames) {
			let playSound = false;
			// Scoring Detect
			if (game.ballX >= GameConstants.LEFT
				&& game.ballVelX >= 0) {
				game.score1 += 1;
				game.ballVelX = -2;
			}
			else if (game.ballX <= GameConstants.RIGHT
				&& game.ballVelX <= 0) {
				game.score2 += 1;
				game.ballVelX = 2;
			}
			if (game.ballX <= GameConstants.RIGHT || game.ballX >= GameConstants.LEFT)
			{
				game.ballVelY = 0;
				game.ballX = 0;
				game.ballY = 0;
				game.paddle1 = 0;
				game.paddle2 = 0;
			}

			// Ending Trigger
			if ((game.score1 > 10 || game.score2 > 10)
				&& (Math.abs(game.score1 - game.score2) >= 2))
			{
				this.endGame(server, game);
				continue;
			}

			// Movements PADDLE
			if (game.player1_pressDown)
				game.paddle1 < GameConstants.TOP - (GameConstants.PADDLE_HEIGHT / 2) ? game.paddle1 += 2 : game.paddle1;
			if (game.player1_pressUp)
				game.paddle1 > GameConstants.BOTTOM + (GameConstants.PADDLE_HEIGHT / 2) ? game.paddle1 -= 2 : game.paddle1;

			if (game.player2_pressDown)
				game.paddle2 < GameConstants.TOP - (GameConstants.PADDLE_HEIGHT / 2) ? game.paddle2 += 2 : game.paddle2;
			if (game.player2_pressUp)
				game.paddle2 > GameConstants.BOTTOM + (GameConstants.PADDLE_HEIGHT / 2) ? game.paddle2 -= 2 : game.paddle2;

			// Ball Movements
			game.ballX += game.ballVelX;
			game.ballY += game.ballVelY;

			// Walls Collisions
			if ((game.ballY + (GameConstants.BALL_RADIUS / 2) >= GameConstants.TOP && game.ballVelY >= 0)
				|| (game.ballY - (GameConstants.BALL_RADIUS / 2) <= GameConstants.BOTTOM && game.ballVelY <= 0)) {
				game.ballVelY = -game.ballVelY;
				playSound = true;
			}

			// Paddles Collisions
			if ((game.ballX + (GameConstants.BALL_RADIUS / 2) >= GameConstants.LEFT - GameConstants.PADDLE_WIDTH
					&& game.ballY <= game.paddle2 + (GameConstants.PADDLE_HEIGHT / 2)
					&& game.ballY >= game.paddle2 - (GameConstants.PADDLE_HEIGHT / 2)
					&& game.ballVelX >= 0)
				|| ( game.ballX - (GameConstants.BALL_RADIUS / 2) <= GameConstants.RIGHT + GameConstants.PADDLE_WIDTH
					&& game.ballY <= game.paddle1 + (GameConstants.PADDLE_HEIGHT / 2)
					&& game.ballY >= game.paddle1 - (GameConstants.PADDLE_HEIGHT / 2)
					&& game.ballVelX <= 0)) {
				game.ballVelX = (-game.ballVelX) * 1.1;
				game.ballVelY = (Math.random() - 0.5) * 8;
				playSound = true;
			}

			// Sends Update
			const room_name = 'game_' + game.player1_socket + '_' + game.player2_socket;
			const sanitizedGame = this.sanitizeGameState(game);
			server.to(room_name).emit('gameUpdate', { ...sanitizedGame, playSound: playSound});
		}
	}

	async connect(client: UserSocket) {
		const token = client.handshake.auth.token;
		if (!token) {
			console.log('Client disconnected: No token provided');
			client.disconnect(true);
			return;
		}

		const user = this.authGuard.validateToken(token);
		if (!user) {
			console.log('Client disconnected: Invalid token');
			client.disconnect(true);
			return;
		}

		client.data.state = PlayerState.NONE;
		client.data.game = undefined;
		client.data.user = (await user).id;
		const one = await this.userService.findById(+client.data.user);
		one.inGame = true
		this.userService.updateUser(one.id,one);

		console.log('New client connected', client.data);
	}

	async disconnect(server: Server, client: UserSocket) {
		for (let game of this.activeGames) {
			if (game.player1_socket == client.id) {
				game.score1 = -1;
				game.score2 = 11;
				this.endGame(server, game);
				break;
			}
			if (game.player2_socket == client.id) {
				game.score1 = 11;
				game.score2 = -1;
				this.endGame(server, game);
				break;
			}
		}
		const one = await this.userService.findById(+client.data.user);
		// console.log("one",one)
		one.inGame = false
		this.userService.updateUser(one.id,one);	
		console.log('Client disconnected');
	}


	async startGame(server: Server, user_id:number) {
		const room = server.sockets.adapter.rooms.get('queue');
		if (room.size < 2)
		{
			// const one = await this.userService.findById(user_id);
			// one.haveInvitatio = true
			// this.userService.updateUser(one.id,one);		
			return;
		}

		let room_iter = room.values();
		let players: UserSocket[] = [undefined, undefined]

		for (let i = 0; i < 2; i++) {
			const target = server.sockets.sockets.get(room_iter.next().value) as UserSocket;
			target.data.state = PlayerState.PLAYING;
			target.data.game = this.activeGames.length;
			target.leave('queue');
			players[i] = target;
			const player = await this.userService.findById(players[i].data.user);
			// player.inGame = true
			player.haveInvitatio = false
			player.matchs +=1 
			this.userService.updateUser(player.id,player);
		}

		const room_name = 'game_' + players[0].id + '_' + players[1].id;
		// create game entity
		let game_entry = new Game();
		console.log("test")
		game_entry.playerOne = await this.userService.findById(players[0].data.user);
		game_entry.playerTwo = await this.userService.findById( players[1].data.user);
		game_entry.scorePlayerOne = 0;
		game_entry.scorePlayerTwo = 0;
		game_entry.playedOn = new Date(Date.now());
		const game_one =await this.gameRepository.save(game_entry);

		const game: GameState = {
			paddle1: 0, paddle2: 0,
			ballX: 0, ballY: 0,
			ballVelX: 2, ballVelY: 0,
			score1: 0, score2: 0,

			player1: players[0].data.user,
			player1_socket: players[0].id,
			player1_pressUp: false,
			player1_pressDown: false,

			player2_socket: players[1].id,
			player2_pressUp: false,
			player2_pressDown: false,
			player2: players[1].data.user,
			game_entity:game_one.id
		};

		this.activeGames.push(game);
		const sanitizedGame = this.sanitizeGameState(game);

		for (let i = 0; i < 2; i++) {
			players[i].data.game = this.activeGames.indexOf(game);
			players[i].join(room_name);

			players[i].emit('gameStart', sanitizedGame);
		}
	}

	async endGame(server: Server, game: GameState) {
		const room_name = 'game_' + game.player1_socket + '_' + game.player2_socket;
		const winner = game.score1 > game.score2 ? game.player1_socket : game.player2_socket;
		const sockets = server.sockets.sockets;

		try {
			sockets.get(game.player1_socket).data.state = PlayerState.NONE;
			sockets.get(game.player1_socket).data.game = undefined;
		} catch {
			console.log('End of game: Player 1 has disconnected');
		}
		try {
			sockets.get(game.player2_socket).data.state = PlayerState.NONE;
			sockets.get(game.player2_socket).data.game = undefined;
		} catch {
			console.log('End of game: Player 2 has disconnected');
		}

		//Update des stats de chaque user ************

			let game_entry = await this.findOneGameById(game.game_entity)

			game_entry.scorePlayerOne = game.score1;
			game_entry.scorePlayerTwo = game.score2;
			this.gameRepository.update(game_entry.id,game_entry);

		if (game.player1 !== game.player2) {
			const winner = this.userService.quickFix(Math.max(game.score1, game.score2) === game.score1 ? game_entry.playerOne : game_entry.playerTwo);
			const loser = this.userService.quickFix(Math.min(game.score1, game.score2) === game.score1 ? game_entry.playerOne : game_entry.playerTwo);
			const scoreDiff = Math.max(game.score1, game.score2) - Math.min(game.score1, game.score2);

			winner.wins += 1;
			loser.lose += 1;
			winner.streak = winner.lose === 0 ? winner.wins : (winner.wins / winner.lose);
			loser.streak = loser.lose === 0 ? loser.wins : (loser.wins / loser.lose);
			winner.xp += 50 + scoreDiff * 2;
			loser.xp += 21 - scoreDiff;
			if (winner.xp >= winner.rank * 100 && winner.rank < 98)
			{
				winner.rank += 1;
				winner.xp = 0;
			}
			if (loser.xp >= loser.rank * 100  && loser.rank < 98)
			{
				loser.rank += 1;
				loser.xp = 0;
			}

			winner.elo +=  100;
			loser.elo -= (loser.elo < 0 ? 0: 25);

			// winner.inGame = false
			// loser.inGame = false

			this.userService.updateUser(winner.id, winner);
			this.userService.updateUser(loser.id, loser);

		}

		server.to(room_name).emit('gameEnd', {
			winner: sockets.get(winner)?.data.user,
			game: this.sanitizeGameState(game)
		});

		this.activeGames.splice(this.activeGames.indexOf(game), 1);
	}

	joinQueue(client: UserSocket, server: Server): boolean {
		if (client.data.state != PlayerState.NONE)
			return false;
		client.data.state = PlayerState.WAITING;
		client.join('queue');
		this.startGame(server,client.data.user);
		return true;
	}


	async privateStartGame(server: Server,p_room_name:string){
		const room = server.sockets.adapter.rooms.get(p_room_name);
		if (room.size < 2)
			return;

		let room_iter = room.values();
		let players: UserSocket[] = [undefined, undefined]

		for (let i = 0; i < 2; i++) {
			const target = server.sockets.sockets.get(room_iter.next().value) as UserSocket;
			target.data.state = PlayerState.PLAYING;
			target.data.game = this.activeGames.length;
			target.leave(p_room_name);
			players[i] = target;
			const player = await this.userService.findById(players[i].data.user);
			// player.inGame = true
			player.haveInvitatio = false
			player.matchs +=1 
			this.userService.updateUser(player.id,player);
		}
		const room_name = 'game_' + players[0].id + '_' + players[1].id;
		// create game entity
		let game_entry = new Game();
		game_entry.playerOne = await this.userService.findById(players[0].data.user);
		game_entry.playerTwo = await this.userService.findById( players[1].data.user);
		game_entry.scorePlayerOne = 0;
		game_entry.scorePlayerTwo = 0;
		game_entry.playedOn = new Date(Date.now());
		const game_one =await this.gameRepository.save(game_entry);

		const game: GameState = {
			paddle1: 0, paddle2: 0,
			ballX: 0, ballY: 0,
			ballVelX: 2, ballVelY: 0,
			score1: 0, score2: 0,

			player1: players[0].data.user,
			player1_socket: players[0].id,
			player1_pressUp: false,
			player1_pressDown: false,

			player2_socket: players[1].id,
			player2_pressUp: false,
			player2_pressDown: false,
			player2: players[1].data.user,
			game_entity:game_one.id
		};
			
		this.activeGames.push(game);
		const sanitizedGame = this.sanitizeGameState(game);
		for (let i = 0; i < 2; i++) {
			players[i].data.game = this.activeGames.indexOf(game);
			players[i].join(room_name);

			players[i].emit('gameStart', sanitizedGame);
		}	

	}

	async joinPrivateQueue(client: UserSocket, server: Server,body:any): Promise<boolean> {
		if (client.data.state != PlayerState.NONE)
			return false;

		client.data.state = PlayerState.WAITING;
		let  room_name:any
		if(body.owner){
			room_name = 'private_'+client.data.user+"_"+body.second
		}
		else{
			room_name = 'private_'+body.second+"_"+client.data.user;
		}
		
		client.join(room_name);
		this.privateStartGame(server,room_name);
		return true;
	}

	leaveQueue(client: UserSocket): boolean {
		if (client.data.state != PlayerState.WAITING)
			return false;

		client.data.state = PlayerState.NONE;
		client.leave('queue');
		return true;
	}

	abondonGame(server: Server, client: UserSocket) {
		for (let game of this.activeGames) {
			if (game.player1_socket == client.id) {
				game.score1 = -1;
				game.score2 = 11;
				this.endGame(server, game);
				break;
			}

			else if (game.player2_socket == client.id) {
				game.score1 = 11;
				game.score2 = -1;
				this.endGame(server, game);
				break;
			}
		}
	}

	shiftDirection(client: UserSocket, isUp: boolean, press: boolean) {
		if (client.data.state != PlayerState.PLAYING)
			return;
		const game = this.activeGames[client.data.game];

		if (game.player1_socket == client.id) {
			if (isUp)
				game.player1_pressUp = press;
			else
				game.player1_pressDown = press;
		}

		else if (game.player2_socket == client.id) {
			if (isUp)
				game.player2_pressUp = press;
			else
				game.player2_pressDown = press;
		}
	}

	async getAllHistories(user_id:number){
		const user1:Game[] = await this.gameRepository.find({
			where:{
				playerOne:{id:user_id}
			},
			relations:["playerOne", "playerTwo"],
			order:{
				playedOn:"DESC"
			}
		})
		const user2:Game[] = await this.gameRepository.find({
			where:{
				playerTwo:{id:user_id}
			},
			relations:["playerOne", "playerTwo"],
			order:{
				playedOn:"DESC"
			}
		})
		return [...user1, ...user2]
	}

	async findOneGameById(game_id:number){
		return this.gameRepository.findOne({
			where:{
				id:game_id
			},
			relations:["playerOne", "playerTwo"]
		})
	}

}
