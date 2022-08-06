import React from "react"
import Logo from "../logo.png"

export default function AppHeader({ title, children }) {
    return (
        <header>
            <div>
                <h4>{title}</h4>
            </div>
            <img src={Logo} width={160} alt="Salmos.ai" />
            {children}
        </header>
    )
}