import React, { Component } from 'react';
import { MediaPlayer, Debug } from 'dashjs';
import './style.scss';

export default class VideoPlayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            player: MediaPlayer().create(),
            isPlaying: true,
            seekPercentage: 0,
            volumePercentage: 100,
            isSeekBarMouseDown: false,
            isVolumeBarMouseDown: false,
            tweets: [{
                User: 'Loading',
                Text: ''
            }],
            proxy: null,
        };

        this.state.player.getDebug().setLogToBrowserConsole(false);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);
    }

    componentDidMount() {
        this.refs.video.oncontextmenu = () => { return false; };
        this.state.player.initialize(this.refs.video, 'http://rdmedia.bbc.co.uk/dash/ondemand/elephants_dream/1/client_manifest-all.mpd', true);

        setInterval(() => {
            if(!this.state.isSeekBarMouseDown && this.state.player.duration() > 0) {
                this.setState(Object.assign({
                    seekPercentage: this.refs.video.currentTime / this.state.player.duration() * 100
                    
                }));
            }
        }, 1000);
        
        setInterval(() => {
            $.get("http://bssinterstellar.azurewebsites.net/api/twitter?q=gameofthrones", ( data ) => {
                let obj = JSON.parse(data);     
                    
                let tweets = obj.map((item) => {
                                    return {
                                        User: item.User.ScreenName,
                                        Text: item.Text
                                    }
                                });
                                    
                this.setState(Object.assign({
                    tweets
                }));
            });
        }, 5000);
                
        let connection = $.hubConnection('http://localhost:8081');
        let proxy = connection.createHubProxy('PlaybackHub');

        proxy.on('play', () => {
            console.log('play');
            this.onPlayServer();
        });

        proxy.on('pause', () => {
            console.log('pause');
            this.onPauseServer();
        });

        proxy.on('seek', (percentage) => {
            console.log('seek to ' + percentage);
            this.seekToServer(percentage);
        });

        connection.start({ jsonp: true })
        .done(() => {
          console.log('Now connected, connection ID=' + connection.id);
          this.setState(Object.assign({
              proxy
          }));
        })
        .fail(() => { console.log('Could not connect'); });
    }

    onPlayPause = () => {
        this.state.isPlaying ? this.onPause() : this.onPlay();
    }

    onPlay = () => {
      if (this.state.proxy !== null) {
        this.state.proxy.invoke('play').done(function () {
            console.log ('Invocation of play succeeded');
        }).fail(function (error) {
            console.log('Invocation of play failed. Error: ' + error);
        });
      }
      else {
        console.log ('Invocation of play ignored.');
      }

      this.onPlayServer();
    }

    onPlayServer = () => {
      this.setState(Object.assign({
          isPlaying: true
      }));

      this.refs.video.play();
    }

    onPause = () => {
      if (this.state.proxy !== null) {
        this.state.proxy.invoke('pause').done(function () {
            console.log ('Invocation of pause succeeded');
        }).fail(function (error) {
            console.log('Invocation of pause failed. Error: ' + error);
        });
      }
      else {
        console.log ('Invocation of pause ignored.');
      }

      this.onPauseServer();
    }

    onPauseServer = () => {
      this.setState(Object.assign({
          isPlaying: false
      }));

      this.refs.video.pause();
    }

    onMouseUp = () => {
        if(this.state.isSeekBarMouseDown) {
            this.setState(Object.assign({
                isSeekBarMouseDown: false
            }));
        }

        if(this.state.isVolumeBarMouseDown) {
            this.setState(Object.assign({
                isVolumeBarMouseDown: false
            }));
        }
    }

    onNeedleMouseDown = () => {
        this.setState(Object.assign({
            isSeekBarMouseDown: true
        }));
    }

    onVolumeMouseDown = () => {
        this.setState(Object.assign({
            isVolumeBarMouseDown: true
        }));
    }

    onMouseMove = (mouseEvent) => {
        if(this.state.isSeekBarMouseDown && mouseEvent.pageX >= this.refs.seekContainer.offsetLeft && mouseEvent.pageX <= this.refs.seekContainer.offsetWidth + this.refs.seekContainer.offsetLeft) {
            this.onSeekContainerClick(mouseEvent);
        }

        if(this.state.isVolumeBarMouseDown)
        {
            let videoTotalSize = this.refs.video.offsetHeight;
            let startPositionVolumeContainer = videoTotalSize - (this.refs.volumeContainer.offsetTop * -1) -10;
            let endPositionVolumeContainer = startPositionVolumeContainer + this.refs.volumeContainer.offsetHeight -10;

            if(this.state.isVolumeBarMouseDown && mouseEvent.pageY >= startPositionVolumeContainer - 25 && mouseEvent.pageY <= endPositionVolumeContainer - 25) {
                this.onVolumeContainerClick(mouseEvent);
            }
        }
    }

    onSeekContainerClick = (mouseEvent) => {
        let percentage = ((mouseEvent.pageX - this.refs.seekContainer.offsetLeft) / this.refs.seekContainer.offsetWidth) * 100;

        this.seekTo(percentage);
    }

    seekTo = (percentage) => {
      if (this.state.proxy !== null) {
        this.state.proxy.invoke('seek', percentage).done(function () {
            console.log ('Invocation of seek succeeded');
        }).fail(function (error) {
            console.log('Invocation of seek failed. Error: ' + error);
        });
      }
      else {
        console.log ('Invocation of seek ignored.');
      }

      this.seekToServer(percentage);
    }

    seekToServer = (percentage) => {
            console.log(percentage);
        localStorage.setItem("seek", percentage);

        this.setState(Object.assign({
            seekPercentage: percentage
        }));

        this.state.player.seek(percentage * this.state.player.duration() / 100);
    }

    onVolumeContainerClick = (mouseEvent) => {
        let videoTotalSize = this.refs.video.offsetHeight;
        let startPositionVolumeContainer = videoTotalSize - (this.refs.volumeContainer.offsetTop * -1) -10;
        let endPositionVolumeContainer = startPositionVolumeContainer + this.refs.volumeContainer.offsetHeight - 10;

        let percentage = (mouseEvent.pageY - startPositionVolumeContainer) / (endPositionVolumeContainer - startPositionVolumeContainer) * 100;

        let adjustedPercentage = (percentage - 100 + 30) * -1;

        this.setState(Object.assign({
            volumePercentage: adjustedPercentage
        }));

        let lolzor = (percentage - 100 + 30) * -1;

        if(lolzor <= 0)
            this.setVolume(0);
        else if(lolzor >= 100)
            this.setVolume(1);
        else
            this.setVolume((percentage - 100 + 30) * -1);

    }

    setVolume = (percentage) => {

        localStorage.setItem("volume", percentage);
        
        this.state.player.setVolume(percentage / 100);
    }


    render() {
        const style = {};
        style.left = this.state.needleLeft;
        style.top = this.state.needleTop;

        let playPauseClassName = (this.state.isPlaying) ? 'fa-pause' : 'fa-play';

        let seekStyle = {
            left: (this.state.seekPercentage - 1) + '%'
        };

        let volumeStyle = {
            bottom: (this.state.volumePercentage - 1) + '%'
        }

        return (
            <div className="sky-video-container">
                <video ref="video"></video>
                <div className="content-container">
                    <div className="title">
                        Game of Thrones - The Door
                    </div>
                    <div className="twitter-feed-container">
                        <i className="fa fa-twitter fa-lg" aria-hidden="true"></i>
                        {
                            this.state.tweets.map((tweet, idx) => <div className="item" key={idx}>{tweet.User} - {tweet.Text}</div> )
                        }
                    </div>
                </div>
                <div className="controls-container">
                    <div className="controls">
                        <i className={`fa fa-lg ${playPauseClassName}`} aria-hidden="true" onClick={this.onPlayPause}></i>
                        <div ref="seekContainer" className="seek-container" onClick={this.onSeekContainerClick}>
                            <div className="seek-progress">
                            </div>
                            <div className="needle" style={seekStyle} onMouseDown={this.onNeedleMouseDown}>
                            </div>
                        </div>
                        <div className="volume-container" >
                            <i className="fa fa-volume-up fa-lg" aria-hidden="true"></i>
                            <div ref="volumeContainer" className="volume-level-container" onClick={this.onVolumeContainerClick} >
                                <div className="needle" style={volumeStyle} onMouseDown={this.onVolumeMouseDown}>
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
