import React, { useContext } from "react"
import { Link } from "wouter"

export default function AppHeader() {
    return (
        <header>
            <h1>Salmos.ai - Master</h1>
            <a id="remote-link"></a>
            <Link to='/client'>Client</Link>
        </header>
    )
}