import React from 'react';
import SocketProvider from './contexts/Sockets';
import PongGame from './pongGame';
import { useParams } from 'react-router-dom';

const PongGameWrapper: React.FC = () => {

    return (
        <SocketProvider>
            <PongGame/>
        </SocketProvider>
    );
};

export default PongGameWrapper;