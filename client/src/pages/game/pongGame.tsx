
import { useContext, useEffect, useReducer, useState } from 'react';
import { SocketContext, newSocketEvent } from './contexts/Sockets';
import GameCanvas from './GameCanvas';
import "./css/game.css"
import apiHandle, { withAuth } from './API/API_Access';
import { useLocation } from 'react-router-dom';
import ThemeSelector from './themeSelector';
import BallSelector from './themeBall';
import icon from '../../assets/icon.png'
import { IUser } from '../../types/types';


function PongGame () {
	// const {gameSocket} = props;
	
	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const { gameSocket, gameContext, setGameContext,disconnectSockets } = useContext(SocketContext);
	// const {friend} = props
	const {connectSockets} = useContext(SocketContext);
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const [frind_id,setFriendId] = useState(queryParams.get('frind_id'))
	const [owner,setOwner] = useState(queryParams.get('owner'))
	const [accecpt,setAccepte] = useState(queryParams.get('accecpt'))
	const [theme, setTheme] = useState<string>('default');
	const [ball, setBall] = useState<string>('default');



	// const [ players, setPlayers ] = useState<any[]>([null, null]);
	const [ players1, setPlayers1 ] = useState<IUser>();
	const [ players2, setPlayers2 ] = useState<IUser>();



	const handleThemeChangeBackground = (theme: any) => {
		localStorage.setItem('theme', theme);
		setTheme(theme);
	  };

	  const handleThemeChangeBall = (ball: any) => {
		localStorage.setItem('ball', ball);
		setBall(ball);
	  };


	useEffect(() => {
		connectSockets();
	}, []);

	useEffect(() => {

		return ()=>{
			disconnectSockets()
		}
	},[]);


	useEffect(() => {
		if (!gameSocket || gameSocket.connected)
		{
			return;
		}
		if(frind_id){
			gameSocket.emit('privateQueue',{owner:owner==='yes'?true:false, second:frind_id,  accept:accecpt==='yes'?true:false})
			setNullForAll()
		}

	},[gameSocket]);




	const setNullForAll=()=>{
		setFriendId(null)
		setOwner(null)
		setAccepte(null)
	}




	useEffect(() => {

		if (!gameSocket || gameSocket.connected)
		{
			
			return;
		}
	
		newSocketEvent(gameSocket, 'connect', () => {
			forceUpdate();
		})
		
		newSocketEvent(gameSocket, 'disconnect', () => {
			forceUpdate();
		})
		
		newSocketEvent(gameSocket, 'joinQueueSuccess', () => {
			setGameContext({ ...gameContext, inQueue: true });
		})
		newSocketEvent(gameSocket, 'joinPrivateQueueSuccess', () => {
			setGameContext({ ...gameContext, inQueue: true });
		})
		
		newSocketEvent(gameSocket, 'leaveQueueSuccess', () => {
			setGameContext({ ...gameContext, inQueue: false });
		})
		
		newSocketEvent(gameSocket, 'gameStart', data => {
			setGameContext({ inQueue: false, gameState: data })

		})
		
		newSocketEvent(gameSocket, 'gameUpdate', data => {
			setGameContext({ ...gameContext, gameState: data })
		})
		
		newSocketEvent(gameSocket, 'gameEnd', _ => {
			setGameContext({ inQueue: false, gameState: null })
			// setPlayers([null, null]);
			setPlayers1(undefined)
			setPlayers2(undefined)
		})
		
		gameSocket.connect();

		return ()=>{
			disconnectSockets()
		}
	//  --> Only run when socket changes and on mount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameSocket]);


	useEffect(() => {
		const keyDownHandler = (e: KeyboardEvent) => {
			if (e.key === 'ArrowUp')
				gameSocket?.emit('startUp');
			if (e.key === 'ArrowDown')
				gameSocket?.emit('startDown');
		}

		const keyUpHandler = (e: KeyboardEvent) => {
			if (e.key === 'ArrowUp')
				gameSocket?.emit('stopUp');
			if (e.key === 'ArrowDown')
				gameSocket?.emit('stopDown');
		}

		document.addEventListener('keydown', keyDownHandler);
		document.addEventListener('keyup', keyUpHandler);

		return () => {
			document.removeEventListener('keydown', keyDownHandler);
			document.removeEventListener('keyup', keyUpHandler);
		}

	//  --> Only run on mount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameContext]);

	

	useEffect(() => {
		if (gameContext.gameState){
			
			apiHandle.get(`/user/user/${gameContext.gameState.player1}`, withAuth())
				.then(res => { setPlayers([res.data, players[1]]) })
				.catch(_ => { });
			apiHandle.get(`/user/user/${gameContext.gameState.player2}`, withAuth())
				.then(res => { setPlayers([players[0], res.data]) })
				.catch(_ => { })
		}

	//  --> Only run when game updates
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gameContext.inQueue])

	// console.log("gameSocket:", gameSocket);

	return(
	<>
		
		<div className='pGame flex items-center justify-center'>
			{
			! gameSocket?.connected
				? 	<div>
						Connecting...
					</div>
				: <> {
					gameContext.gameState
					? <>
					<div className='GameCanvas_all '>
						<div className='flex align-items justify-between px-3 py-3'>
								<div className=''>
									<img className='players-icon' src={players1?.avatar ?(players1?.avatar):(icon)} alt='avatar'/>
								</div>
								<div className=''>
									<img className='players-icon' src={players2?.avatar ? (players2?.avatar):(icon)} alt='avatar'/>
								</div>

						</div>
						<div className='players-name'>
							<div className=''>{players1?.username} VS {players2?.username}</div><br/>
							{gameContext.gameState.score1} - {gameContext.gameState.score2}
						</div>
						
						<div className='force-center'>
							<GameCanvas ctx={gameContext.gameState}/><br/>
						</div>

						<div className='btn-retro'>
							<button
								onClick={() => gameSocket.emit('abondonGame')}>
									Give Up
							</button>
						</div>
					</div>
						</>

						: gameContext.inQueue
							// ? <div className='queue force-center'>
							? <div className='flex flex-col items-center justify-center'>
								<div className='mb-4'>Awaiting a challenger...</div>
								<button className="button" data-text="Awesome" onClick={() => {gameSocket.emit('leaveQueue')}}>
									<span className="actual-text">&nbsp;LEAVE&nbsp;</span>
									<span aria-hidden="true" className="hover-text">&nbsp;LEAVE&nbsp;</span>
								</button>
							</div>
							: <div className='flex flex-col items-center justify-center'>
								<div className='Title-game mb-10'>Welcome to Pong Game</div>
								<button className="button" data-text="Awesome" onClick={() => {gameSocket.emit('joinQueue')}}>
									<span className="actual-text">&nbsp;PLAY&nbsp;</span>
									<span aria-hidden="true" className="hover-text">&nbsp;PLAY&nbsp;</span>
								</button>
								<ThemeSelector onChangeThemeBackground={handleThemeChangeBackground} />
								<BallSelector onChangeThemeBall={handleThemeChangeBall} />
							</div>
				}
				</>
			}
		</div>
	</>
	)
}

export default PongGame;