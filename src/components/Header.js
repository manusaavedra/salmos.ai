import React, { useContext } from "react"
import { Link } from "wouter"
import { SocketContext } from "../context/ContextSocketIO"

export default function AppHeader() {

    const socket = useContext(SocketContext)

    return (
        <header>
            <h1>Salmos.ai - Master</h1>
            <a id="remote-link"></a>
            <Link to='/client'>Client</Link>
        </header>
    )
}