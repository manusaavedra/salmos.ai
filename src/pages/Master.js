import { useContext, useEffect, useRef } from "react"
import { SocketContext } from "../context/ContextSocketIO"
import { clearButtons } from "../helpers"
import useToggle from "../hooks/useToggle"
import { Howler } from 'howler'
import AppHeader from "../components/Header"
import { ListPads } from "../components/Pads"
import { Link } from "wouter"

export default function Master() {

    const { isToggle, toggle } = useToggle()
    const socket = useContext(SocketContext)
    const volumeRef = useRef(1)

    useEffect(() => {

        socket.on('volume', (data) => {
            console.log(data.body)
            volumeRef.current.value = data.body
            Howler.volume(data.body)
        })

    }, [])

    const handleChangeVolume = (value) => {
        Howler.volume(value)
    }

    return (
        <div className="app">
            <AppHeader />
            <div className="inline-container">
                <div className={`padsbutton ${isToggle ? 'disabled' : ''}`}>
                    <ListPads />
                </div>
                <div className='config-panel'>
                    <div className="input-group">
                        <label htmlFor="volume">Volume</label>
                        <input
                            ref={volumeRef}
                            type="range"
                            name='volume'
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={(e) => handleChangeVolume(e.target.value)} />
                    </div>
                    <footer>
                        <span>Powered by <a href="https://github.com/manusaavedra">Manuel Saavedra</a> | this project uses react js and howler js</span>
                    </footer>
                </div>
            </div>
        </div>
    );
}