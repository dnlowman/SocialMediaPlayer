import React from 'react';
import ReactDOM from 'react-dom';
import VideoPlayer from './VideoPlayer';
import Chat from './Chat';

let videoWithChat = <div><VideoPlayer /><Chat /></div>;

ReactDOM.render(
    videoWithChat,
    document.getElementById('react-container')
);
