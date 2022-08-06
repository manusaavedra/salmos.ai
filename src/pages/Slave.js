import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Link } from "wouter"
import Footer from "../components/Footer"
import AppHeader from "../components/Header"
import MasterVolume from '../components/MasterVolume'
import { SocketContext } from "../context/ContextSocketIO"
import { clearButtons, stringFormatted } from "../helpers"

export default function Slave() {

    const [pads, setPads] = useState([])
    const socket = useContext(SocketContext)

    useEffect(() => {
        socket.on('join', (data) => {
            console.log(data.body)
            setPads(data.body)
        })
    }, [])

    return (
        <div className='app'>
            <AppHeader title="remote-control">
                <Link to='/'>Server</Link>
            </AppHeader>
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
                        <MasterVolume />
                    </div>
                    <Footer />
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
        e.target.blur()
    }

    return (
        <div className='pad-item'>
            <button id={sourceData.id}>
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