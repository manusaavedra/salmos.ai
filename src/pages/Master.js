import AppHeader from "../components/Header"
import { ListPads } from "../components/Pads"
import MasterVolume from "../components/MasterVolume"

export default function Master() {

    return (
        <div className="app">
            <AppHeader />
            <div className="inline-container">
                <div className={`padsbutton`}>
                    <ListPads />
                </div>
                <div className='config-panel'>
                    <div className="input-group">
                        <label htmlFor="volume">Volume</label>
                        <MasterVolume />
                    </div>
                    <footer>
                        <span>Powered by <a href="https://github.com/manusaavedra">Manuel Saavedra</a> | this project uses react js and howler js</span>
                    </footer>
                </div>
            </div>
        </div>
    );
}