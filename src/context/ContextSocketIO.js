import { createContext } from "react";
import socketio from "socket.io-client";

export const socket = socketio.connect("/");
export const SocketContext = createContext();