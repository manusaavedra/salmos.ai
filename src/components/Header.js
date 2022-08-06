import React from "react"
import Logo from "../logo.png"

export default function AppHeader({ title, children }) {
    return (
        <header>
            <div className="navbar-brand">
                <img src={Logo} width={160} alt="Salmos.ai" />
                <h4>{title}</h4>
            </div>
            {children}
        </header>
    )
}