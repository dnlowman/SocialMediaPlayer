import React, { Component } from 'react'
import 'ms-signalr-client';

export default class Chat extends Component {
  componentDidMount()
  {
    let connection = $.hubConnection('http://localhost:1080');
    let proxy = connection.createHubProxy('ChatHub');

    // receives broadcast messages from a hub function, called "broadcastMessage"
    proxy.on('hello', function(message) {
        console.log(message);
    });

    // atempt connection, and handle errors
    connection.start({ jsonp: true })
    .done(function(){ console.log('Now connected, connection ID=' + connection.id); })
    .fail(function(){ console.log('Could not connect'); });

  }

  render() {
    return (
      <div> hello </div>
    );
  }
}
