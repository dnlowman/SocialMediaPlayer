import React, { Component } from 'react';
import PlayPause from './PlayPause';
import './style.scss';

export default class Controls extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="controls">
                <PlayPause player={this.props.player} />
                {/*<div className="seek" ref="seek">
                    <div className="needle-container">
                        <div style={style} className="needle" ref="needle">
                            <div className="time-container">
                                <div className="time">{this.state.needleLeft}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <i className="fa fa-arrows-alt" aria-hidden="false"></i>
                </div>*/}
            </div>
        );
    }
}
