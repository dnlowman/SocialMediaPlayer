import React, { Component } from 'react';

export default class PlayPause extends Component {
    constructor(props) {
        super(props);
        this.state = { isPaused: false };
    }

    onClick = () => {
        if(this.props.player.isPaused()) {
            this.props.player.play();
            this.setState({ isPaused: false });
        }
        else {
            this.props.player.pause();
            this.setState({ isPaused: true });
        }
    };

    render() {
        let icon = ((this.state.isPaused) ? 'fa-play' : 'fa-pause');

        return (
            <div className="play-pause" onClick={this.onClick}>
                <i className={`fa ${icon}`} aria-hidden="false"></i>
            </div>
        );
    }
}
