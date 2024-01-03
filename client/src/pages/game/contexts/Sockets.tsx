import React, { createContext, useState, ReactNode } from "react";
import { newSocket } from "../API/API_Access";
import { Socket } from 'socket.io-client';

interface SocketContextProps {
  gameSocket: Socket | null;
  gameContext: any; 
  setGameContext: React.Dispatch<React.SetStateAction<any>>; 
  
  connectSockets: () => void;
  disconnectSockets: () => void;
}

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketContext = createContext<SocketContextProps>({} as SocketContextProps);

export const newSocketEvent = (socket: Socket, event: string, callback: (data: any) => void) => {
  socket.off(event)
  .on(event, (data) => {
    callback(data);
  });
};

const defaultGameContext = {
  inQueue: false,
  gameState: null,
};

// export class GameState {
// 	paddle1: number
// 	paddle2: number

// 	ballX: number
// 	ballY: number
// 	ballVelX: number
// 	ballVelY: number
	
// 	player1: number
// 	player2: number
// 	score1: number
// 	score2: number

// 	player1_pressUp: boolean
// 	player1_pressDown: boolean
// 	player2_pressUp: boolean
// 	player2_pressDown: boolean

// 	player1_socket: string
// 	player2_socket: string
// }


const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [gameSocket, setGameSocket] = useState<Socket | null>(null);
  const [gameContext, setGameContext] = useState(defaultGameContext);

  // console.log("SocketProvider component is rendered! gameSocket:", gameSocket);

  // console.log("gameSocket:", gameSocket);
  // console.log("gameContext:", gameContext);
  // console.log("setGameContext:", setGameContext);

  const connectSockets = () => {
    console.log("Connecting sokets...");
    try {
      if (!gameSocket) {
        setGameSocket(newSocket());
      }
    } catch (error) {
      console.error("Error connexion socket:", error);
    }
  };

  const disconnectSockets = () => {
    if (gameSocket && gameSocket.connected) {
      gameSocket.disconnect();
    }
    setGameSocket(null);
    setGameContext(defaultGameContext);
  };
  
  const contextValue: SocketContextProps = {
    gameSocket,
    gameContext,
    setGameContext,
    connectSockets,
    disconnectSockets,
  };
  
  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;