import React, { useContext } from "react"
import { Link } from "wouter"
import { SocketContext } from "../context/ContextSocketIO"

export default function AppHeader() {

    const socket = useContext(SocketContext)

    return (
        <header>
            <h1>Salmos.ai - Server</h1>
            <a id="remote-link"></a>
            <p>clientId: {socket.id} </p>
            <Link to='/client'>Client</Link>
        </header>
    )
}