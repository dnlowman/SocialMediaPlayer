import React from 'react';
import ReactDOM from 'react-dom';
import VideoPlayer from './VideoPlayer';
import Chat from './Chat';

let videoWithChat = <div><VideoPlayer /><Chat /></div>;

ReactDOM.render(
    <Chat />,
    document.getElementById('react-container')
);
