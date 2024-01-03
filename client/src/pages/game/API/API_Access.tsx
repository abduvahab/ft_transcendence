import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { io, Socket } from 'socket.io-client';
import { getToken } from '../../../helpers/localStore.helper';

const hostname = window.location.hostname;
// const port1 = import.meta.env.PORT1
// const port2 = import.meta.env.PORT2
const url1 = import.meta.env.VITE_LOCAL1
const url2 = import.meta.env.VITE_LOCAL2
const apiHandle: AxiosInstance = axios.create({
  baseURL: url1,
  // timeout: 1000,
});

const withAuth = (): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
};

interface SocketOptions {
  // path: string;
  upgrade: boolean;
  transports: string[];
  autoConnect: boolean;
  reconnection: boolean;
  reconnectionDelay: number;
  reconnectionDelayMax: number;
  reconnectionAttempts: number;
  auth: {
    token: string | null;
  };
}
// `/${target}`
const newSocket = (): Socket => {
  const socketOptions: SocketOptions = {
    // path:`/${target}` ,
    upgrade: false,
    transports: ['websocket'],
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    auth: {
      token:getToken(),
    },
  };
  return io(url2,socketOptions);
};

export default apiHandle;
export { apiHandle, hostname, withAuth, newSocket };