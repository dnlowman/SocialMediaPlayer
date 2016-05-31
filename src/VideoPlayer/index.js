import React, { Component } from 'react';
import { MediaPlayer, Debug } from 'dashjs';
import './style.scss';

export default class VideoPlayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            player: MediaPlayer().create()
        };

        this.state.player.getDebug().setLogToBrowserConsole(false);
    }

    componentDidMount() {
        this.refs.video.oncontextmenu = () => { return false; };
        this.state.player.initialize(this.refs.video, 'http://dash.edgesuite.net/envivio/Envivio-dash2/manifest.mpd', true);
    }

    render() {
        const style = {};
        style.left = this.state.needleLeft;

        return (
            <div className="sky-video-container">
                <video ref="video"></video>
                <div className="content-container">
                    <div className="title">
                        Game of Thrones - The Door
                    </div>
                    <div className="twitter-feed-container">
                        <i className="fa fa-twitter fa-lg" aria-hidden="true"></i>
                        <br />OMG
                        <br />WOAH!
                    </div>
                </div>
                <div className="controls-container">
                    <div className="controls">
                        <i className="fa fa-play fa-lg" aria-hidden="true"></i>
                        <div className="seek-container">
                            <div className="seek-progress">
                            </div>
                            <div className="needle">
                            </div>
                        </div>
                        <div className="volume-container">
                            <i className="fa fa-volume-up fa-lg" aria-hidden="true"></i>
                            <div className="volume-level-container">
                                <div className="needle">
                                </div>
                            </div>
                        </div>
                        <i className="fa fa-expand fa-lg" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
        );
    }
}
