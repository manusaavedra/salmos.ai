import { forwardRef, useImperativeHandle, useRef, useContext, useState, useEffect } from "react";
import { Howl, Howler } from 'howler'
import { SocketContext } from "../context/ContextSocketIO";
import { clearButtons, stringFormatted } from "../helpers";
import { FaFolderOpen, FaPlus } from "react-icons/fa";

export function ListPads() {
    const [pads, setPads] = useState([]);
    const socket = useContext(SocketContext);
    const padRef = useRef([]);

    useEffect(() => {
        socket.emit('join', { body: [] })

        return () => {
            padRef.current = []           
        }

    }, [])

    const handleAddPad = () => {

        const newPad = {
            id: pads.length,
            name: `Pad ${pads.length + 1}`
        }

        setPads([...pads, newPad])
    }

    const createPads = () => {
        return pads.map((pad, index) => (
            <PadItem key={pad.id} padId={pad.id} onLoaded={initializeSocket} ref={(ref) => padRef.current[index] = ref} />
        ))
    }

    const getFiles = () => padRef.current.map(pad => {
        return { filename: pad.getFile(), id: pad.getId }
    })

    const initializeSocket = () => {
        socket.on('handshake', (data) => {
            socket.emit('join', { body: getFiles() })
        })

        socket.emit('join', { body: getFiles() })

        socket.on('play', (data) => {
            console.log(data.body)
            padRef.current[data.body].play()
        })

        socket.on('stop', (data) => {
            console.log(data.body)
            padRef.current[data.body].stop()
        })

        socket.on('pause', (data) => {
            console.log(data.body)
            padRef.current[data.body].pause()
        })
    }

    return (
        <>
            {
                createPads()
            }
            <button onClick={handleAddPad}>
                <FaPlus size={24} />
            </button>
        </>
    )
}

const PadItem = forwardRef(({ onLoaded, padId }, ref) => {

    const [file, setFile] = useState({ name: '', data: null });
    const [progress, setProgress] = useState(0)
    const soundRef = useRef(null);
    const progressTextRef = useRef();
    const remainderTextRef = useRef();
    const checkInputRef = useRef();
    const progressRef = useRef();
    const socket = useContext(SocketContext);
    const intervalRef = useRef();

    useImperativeHandle(ref, () => {
        return {
            getId: padId,
            getFile: () => {
                return file.name
            },
            play: () => {
                checkInputRef.current.checked = true;
                playSound()
            },
            stop: () => {
                checkInputRef.current.checked = false;
                playSound()
            },
            pause: () => {
                playSound()
            }
        }
    })

    useEffect(() => {

        if (file.data !== null) {
            soundRef.current = new Howl({
                src: [file.data],
                format: ["mp3"],
                volume: 1,
                onplay: () => {
                    socket.emit('play', { body: padId })
                    intervalRef.current = progressTimer()
                },
                onpause: () => {
                    socket.emit('pause', { body: padId })
                    clearInterval(intervalRef.current)
                },
                onstop: () => {
                    socket.emit('stop', { body: padId })
                    clearInterval(intervalRef.current)
                },
                onend: () => {
                    socket.emit('stop', { body: padId })
                    socket.emit('progress', { body: 0, duration: soundRef.current.duration() })
                    checkInputRef.current.checked = false
                    clearInterval(intervalRef.current)
                }
            })

            soundRef.current.on('load', () => {
                
                progressRef.current.max = soundRef.current.duration()
                remainderTextRef.current.innerText = stringFormatted(soundRef.current.duration())

                socket.emit('progress', {body: 0, duration: soundRef.current.duration()})

                socket.on('progress', (data) => {
                    if (data.id === padId) {
                        soundRef.current.seek(data.body)
                        setProgress(data.body)
                    }
                })

                socket.on('seeking', (data) => {
                    if (data.id === padId) {
                        soundRef.current.seek(data.body)
                        setProgress(data.body)
                    }
                })
            })

            onLoaded()
        }

        return () => {
            clearInterval(intervalRef.current)
        }

    }, [file])

    const playSound = () => {

        clearButtons(checkInputRef.current)
        clearInterval(intervalRef.current)

        if (file === '') return checkInputRef.current.checked = false;

        if (!checkInputRef.current.checked)
            return soundRef.current.stop()

        Howler.stop()
        soundRef.current.volume(1)
        soundRef.current.play()
    }

    const handleOnChange = (e) => {

        if (e.target.files.length > 0) {
            const file = e.target.files[0]
            const reader = new FileReader()
            const filename = file.name.substring(0, file.name.length - 4)
            reader.onload = (e) => {
                setFile({
                    name: filename,
                    data: e.target.result
                })
            }
            reader.readAsDataURL(file)
        }
    }

    const progressTimer = () => {
        if (soundRef.current.playing()) {
            return setInterval(() => {
                updateProgress()
            }, 500);
        }
    }

    const updateProgress = () => {
        if (soundRef.current.playing()) {
            let data = {
                id: padId,
                body: soundRef.current.seek(),
                duration: soundRef.current.duration()
            }

            progressTextRef.current.innerText = stringFormatted(soundRef.current.seek())
            remainderTextRef.current.innerText = stringFormatted(soundRef.current.duration())

            socket.emit('progress', data)
            setProgress(soundRef.current.seek())
        }
    }

    const handleInput = (e) => {
        soundRef.current.stop()
        setProgress(e.target.value)
    }

    const handleMouseUp = () => {
        soundRef.current.seek(progress)
        socket.emit('seeking', {
            id: padId,
            body: progress,
            duration: soundRef.current.duration()
        })
        soundRef.current.play()
    }

    return (
        <div className="pad-item">
            <button id={padId}>
                <div className="metadata">
                    <span ref={progressTextRef}>00:00</span>
                    <span ref={remainderTextRef}>00:00</span>
                </div>
                <input ref={checkInputRef} type="checkbox" name='note' onChange={playSound} />
                <div className='text-content'>
                    {
                        file.data !== null ? (
                            <span>{file.name}</span>
                        ) : null
                    }
                    <div className='fileInput'>
                        <input type="file" name='file' onChange={handleOnChange} />
                        <FaFolderOpen className="icon" size={24} />
                    </div>
                </div>
            </button>
            <div className="controls">
                <input 
                    type="range" 
                    ref={progressRef} 
                    onChange={handleInput} 
                    onMouseUp={handleMouseUp} 
                    onTouchEnd={handleMouseUp}
                    value={progress} />
            </div>
        </div>
    )
})

export default PadItem