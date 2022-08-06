import { useContext, useEffect, useRef } from "react"
import { SocketContext } from "../context/ContextSocketIO"
import { Howler } from 'howler'

export default function MasterVolume() {

    const socket = useContext(SocketContext)
    const volumeRef = useRef()
    const { volume } = Howler

    useEffect(() => {
        volumeRef.current.value = 1
        socket.on('volume', (data) => {
            volumeRef.current.value = data.body
            volume(data.body)
        })
    }, [])

    const handleChangeVolume = (e) => {
        volume(e.target.value)
        socket.emit('volume', { body: e.target.value })
    }

    return (
        <input
            ref={volumeRef}
            type="range"
            name='volume'
            title="Volume"
            min={0}
            max={1}
            step={0.01}
            onChange={handleChangeVolume} />
    )
} 