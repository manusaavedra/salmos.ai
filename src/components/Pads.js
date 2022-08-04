import { forwardRef, useImperativeHandle, useRef, useContext, useState, useEffect } from "react";
import { Howl, Howler } from 'howler'
import { SocketContext } from "../context/ContextSocketIO";
import { clearButtons } from "../helpers";
import { FaFolderOpen, FaPlus } from "react-icons/fa";

export function ListPads() {
    const [pads, setPads] = useState([]);
    const socket = useContext(SocketContext);
    const padRef = useRef([]);

    const handleAddPad = () => {

        const newPad = {
            id: pads.length,
            name: `Pad ${pads.length + 1}`
        }

        setPads([...pads, newPad])
    }

    const createPads = () => {
        return pads.map((pad, index) => (
            <PadItem key={pad.id} padId={pad.id} onChange={handleChange} ref={(ref) => padRef.current[index] = ref} />
        ))
    }

    const getFiles = () => padRef.current.map(pad => {
        return { filename: pad.getFile(), id: pad.getId }
    })

    const handleChange = () => {

        console.log(getFiles())

        socket.on('handshake', (data) => {
            const remoteLink = document.getElementById('remote-link')
            remoteLink.href = data.url
            remoteLink.innerText = data.url
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
            <button className="padbutton" onClick={handleAddPad}>
                <FaPlus size={24} />
            </button>
        </>
    )
}

const PadItem = forwardRef(({ onChange, padId }, ref) => {

    const [file, setFile] = useState('')
    const soundRef = useRef([]);
    const checkInputRef = useRef([]);
    const progressRef = useRef([]);
    const socket = useContext(SocketContext);
    const intervalRef = useRef([]);

    useImperativeHandle(ref, () => {
        return {
            getId: padId,
            getFile: () => {
                return file
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
        return () => {
            clearInterval(intervalRef.current)
        }
    }, [])

    const playSound = () => {

        if (file === '') return checkInputRef.current.checked = false;

        clearButtons(checkInputRef.current)
        clearInterval(intervalRef.current)

        if (!checkInputRef.current.checked) {
            return soundRef.current.stop()
        }

        Howler.stop()

        soundRef.current.volume(1)
        soundRef.current.play()
    }

    const handleOnChange = async (e) => {

        if (e.target.files.length > 0) {
            const file = e.target.files[0]
            const reader = new FileReader()
            let filename = file.name.substring(0, file.name.length - 4)
            setFile(filename)
            reader.onload = (e) => {
                soundRef.current = new Howl({
                    src: [e.target.result],
                    format: [file.name.split('.').pop().toLowerCase()],
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
                        checkInputRef.current.checked = false
                        clearInterval(intervalRef.current)
                    }
                })
                onChange()
            }

            reader.readAsDataURL(file)
            
        }

        socket.on('progress', (data) => {
            if (data.id === padId) {
                soundRef.current.seek(data.body)
                progressRef.current.value = data.body
            }
        })

        socket.on('seeking', (data) => {
            if (data.id === padId) {
                soundRef.current.seek(data.body)
                progressRef.current.value = data.body
            }
        })
    }

    const progressTimer = () => {
        if (soundRef.current.playing()) {
            return setInterval(() => {
                updateProgress()
            }, 500);
        }

        console.log(soundRef.current.duration())
    }

    const updateProgress = () => {
        if (soundRef.current) {
            let progress = `${soundRef.current.seek() / soundRef.current.duration() * 100}`
            progressRef.current.value = progress
            socket.emit('progress', { 
                id: padId,
                body: progress,
                duration: soundRef.current.duration()
            })
        }
    }

    const handleSeeking = (e) => {
        soundRef.current.stop()
        
        let rect = e.target.getBoundingClientRect()
        let x = e.clientX - rect.left;
        let percent = x / e.target.offsetWidth;
        
        soundRef.current.seek(soundRef.current.duration() * percent)
        progressRef.current.value = percent * 100
        socket.emit('seeking', { 
            id: padId,
            body: percent * 100, 
            duration: soundRef.current.duration() 
        })

        soundRef.current.play()
    }

    const sleep = (ms) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }

    const stopSound = async () => {
        for (let i = 0; i < 20; i++) {
            await sleep(20)
            if (soundRef.current.volume() > 0) {
                soundRef.current.volume(soundRef.current.volume() - 0.05)
                console.log(soundRef.current.volume())
            }
        }
        Howler.stop()
    }

    return (
        <button id={padId} className="padbutton">
            <div className="controls">
                <progress ref={progressRef} onClick={handleSeeking} onChange={handleSeeking} className="progress" value={0} min={0} max={100} />
            </div>
            <input ref={checkInputRef} type="checkbox" name='note' onChange={playSound} />
            <div className='text-content'>
                <span>{file}</span>
                <div className='fileInput'>
                    <input type="file" name='file' onChange={handleOnChange} />
                    <FaFolderOpen className="icon" size={24} />
                </div>
            </div>
        </button>
    )
})

export default PadItem