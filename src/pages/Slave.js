import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Link } from "wouter"
import { SocketContext } from "../context/ContextSocketIO"
import { clearButtons, stringFormatted } from "../helpers"

export default function Slave() {

    const [pads, setPads] = useState([])
    const socket = useContext(SocketContext)
    const volumeRef = useRef(0.7)

    useEffect(() => {
        socket.on('join', (data) => {
            console.log(data.body)
            setPads(data.body)
        })

        socket.on('volume', (data) => {
            volumeRef.current.value = data.body
        })
    }, [])

    const handleChangeVolume = (e) => {
        socket.emit('volume', { body: e.target.value })
    }

    return (
        <div className='app'>
            <header>
                <h1>Salmos.ai - Remote</h1>
                <Link to='/'>Server</Link>
            </header>
            <div className="inline-container">
                <div className={`padsbutton`}>
                    {
                        pads.map((pad, index) => (
                            <PadItem key={pad.id} sourceData={pad} />
                        ))
                    }
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
                            onChange={handleChangeVolume} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const PadItem = forwardRef(({ sourceData }, ref) => {

    const socket = useContext(SocketContext)
    const [progress, setProgress] = useState(0)
    const progressRef = useRef({})
    const checkInputRef = useRef()
    const refProgressText = useRef()
    const refRemainderText = useRef()

    useImperativeHandle(ref, () => {
        return sourceData
    })

    useEffect(() => {

        socket.on('play', (data) => {
            if (data.body === sourceData.id) {
                checkInputRef.current.checked = true
                clearButtons(checkInputRef.current)
            }
        })

        socket.on('pause', (data) => {
            if (data.body === sourceData.id) {
                checkInputRef.current.checked = false
                clearButtons(checkInputRef.current)
            }
        })

        socket.on('stop', (data) => {
            if (data.body === sourceData.id) {
                checkInputRef.current.checked = false
                clearButtons(checkInputRef.current)
            }
        })

        socket.on('progress', (data) => {
            if (data.id === sourceData.id) {
                checkInputRef.current.checked = true
                clearButtons(checkInputRef.current)
                setProgress(data.body)
                progressRef.current.max = data.duration
                refProgressText.current.innerHTML = stringFormatted(data.body)
                refRemainderText.current.innerHTML = stringFormatted(data.duration)
            }
        })

        socket.on('seeking', (data) => {
            if (data.id === sourceData.id) {
                setProgress(data.body)
            }
        })

    }, [sourceData.id])


    const play = (e, id) => {

        const checked = e.target.checked

        if (checked)
            socket.emit('play', { body: id })
        else
            socket.emit('stop', { body: id })

        clearButtons(e.target)
    }

    const handleChange = (e) => {
        setProgress(e.target.value)
    }

    const handleMouseUp = (e) => {
        e.preventDefault()
        socket.emit('seeking', { id: sourceData.id, body: progress })
    }

    return (
        <div className='pad-item'>
            <button key={sourceData.id}>
                <div className="metadata">
                    <span ref={refProgressText}>00:00</span>
                    <span ref={refRemainderText}>00:00</span>
                </div>
                <input ref={checkInputRef} type="checkbox" name='note' onChange={(e) => play(e, sourceData.id)} />
                <div className='text-content'>
                    <span>{sourceData.filename}</span>
                </div>
            </button>
            <div className="controls">
                <input
                    type="range"
                    ref={progressRef}
                    onChange={handleChange} 
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    className="progress"
                    value={progress}
                     />
            </div>
        </div>
    )
})