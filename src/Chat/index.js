import React, { Component } from 'react'
import 'ms-signalr-client';

export default class Chat extends Component {
  componentDidMount()
  {
    let connection = $.hubConnection('http://[address]:[port]');
    let proxy = connection.createHubProxy('[hubname]');

    // receives broadcast messages from a hub function, called "broadcastMessage"
    proxy.on('broadcastMessage', function(message) {
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
