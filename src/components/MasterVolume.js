import { useContext, useEffect, useRef } from "react"
import { SocketContext } from "../context/ContextSocketIO"
import { Howler } from 'howler'

export default function MasterVolume() {

    const socket = useContext(SocketContext)
    const volumeRef = useRef(1)
    const { volume } = Howler

    useEffect(() => {
        socket.on('volume', (data) => {
            volumeRef.current.value = data.body
            volume(data.body)
        })
    }, [])

    const handleChangeVolume = (e) => {
        const { value } = e.target
        volume(value)
        socket.emit('volume', { body: value })
    }

    return (
        <input
            ref={volumeRef}
            type="range"
            name='volume'
            min={0}
            max={1}
            step={0.01}
            onChange={handleChangeVolume} />
    )
} 