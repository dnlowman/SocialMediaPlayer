import React, { Component } from 'react';
import { MediaPlayer } from 'dashjs';
import Controls from './Controls';
import './style.scss';

export default class VideoPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = { needleLeft: 0, isMouseDown: false, player: MediaPlayer().create() };
    }

    componentDidMount() {
        this.state.player.initialize(this.refs.video, 'http://dash.edgesuite.net/envivio/Envivio-dash2/manifest.mpd', true);
        //player.pause();

        this.refs.seek.addEventListener('mouseenter', this.onMouseEnterSeek);
        this.refs.seek.addEventListener('mouseout', this.onMouseLeaveSeek);
        this.refs.seek.addEventListener('mousemove', this.onMouseMoveSeek);

        window.addEventListener('mouseup', this.onMouseUpNeedle);
        window.addEventListener('mousemove', this.onMouseMoveSeek);

        //this.refs.seek.addEventListener('mousedown', () => { console.log('Down down down...') });

        //this.refs.seek.addEventListener('mousedown', this.onMouseDownNeedle);

        this.refs.needle.addEventListener('mousedown', this.onMouseDownNeedle);
        this.refs.needle.addEventListener('mouseup', this.onMouseUpNeedle);
    }

    componentWillUnmount() {
        this.refs.seek.removeEventListener('mouseenter', this.onMouseEnterSeek);
        this.refs.seek.removeEventListener('mouseout', this.onMouseLeaveSeek);
        this.refs.seek.removeEventListener('mousemove', this.onMouseMoveSeek);

        this.refs.needle.removeEventListener('mousedown', this.onMouseDownNeedle);
        this.refs.needle.removeEventListener('mouseup', this.onMouseUpNeedle);
    }

    onMouseEnterSeek = (e) => {
        //e.preventDefault();
        //console.log('Mouse enter...');
    };

    onMouseLeaveSeek = (e) => {
        //e.preventDefault();
        //console.log('Mouse leave...');
    };

    onMouseMoveSeek = (mouseEvent) => {
        //mouseEvent.preventDefault();
        //mouseEvent.stopPropagation();
        //console.log('Mouse move...' + ' X ' + mouseEvent.offsetX);

        var rect = this.refs.seek.getBoundingClientRect();
        if(this.state.isMouseDown && mouseEvent.pageX - rect.left <= this.refs.seek.offsetWidth && mouseEvent.pageX - rect.left >= 0)
            this.setState({ needleLeft: mouseEvent.pageX - rect.left, isMouseDown: this.state.isMouseDown, player: this.state.player});
    };

    onMouseDownNeedle = (mouseEvent) => {
        this.setState({ needleLeft: this.state.needleLeft, isMouseDown: true, player: this.state.player });
    };

    onMouseUpNeedle = (mouseEvent) => {
        if(this.state.isMouseDown)
            this.state.player.seek(10);
        this.setState({ needleLeft: this.state.needleLeft, isMouseDown: false, player: this.state.player });
    };

    onPlayPauseClick = () => {
        if(this.state.player.isPaused())
            this.state.player.play();
        else
            this.state.player.pause();
    };

    render() {
        const style = {};
        style.left = this.state.needleLeft;

        return (
            <div className="sky-video-container">
                <video ref="video"></video>
                <Controls />
            </div>
        );
    }
}
