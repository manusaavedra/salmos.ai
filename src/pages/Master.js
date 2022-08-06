import AppHeader from "../components/Header"
import { ListPads } from "../components/Pads"
import MasterVolume from "../components/MasterVolume"
import { Link } from "wouter";
import Footer from "../components/Footer";

export default function Master() {

    return (
        <div className="app">
            <AppHeader>
                <Link to="/client">remote-control</Link>
            </AppHeader>
            <div className="inline-container">
                <div className={`padsbutton`}>
                    <ListPads />
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
    );
}