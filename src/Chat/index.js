import React, { Component } from 'react'
import 'ms-signalr-client';

import './styles.scss';

export default class Chat extends Component {
  constructor() {
    super();
    this.state = {
        connectedUsers: [],
        messages: [],
        proxy: {},
        userName: ''
    }
  }
  
  userJoined = (connectedUsers) => {
    console.log('successfulJoin');
    this.setState(Object.assign(this.state, {
      connectedUsers: connectedUsers
    }));
  }
  
  userDisconencted = (users, userWhoLeft) => {
    this.setState(Object.assign(this.state, { 
      connectedUsers: users 
    }));
  }
  
  messageRecieved = (userName, message) => {
    this.state.messages.push(message);
    this.setState(Object.assign(this.state, { messages: this.state.messages }));
  }
  
  sendMessage = () => {
    console.log('send message called');
    if(this.refs.messageBox.value !== undefined && this.refs.messageBox.value.length > 0)
    {
      this.state.proxy.invoke('sendMessage',this.state.userName, this.refs.messageBox.value);
      this.refs.messageBox.value = '';
    }
  } 
  
  componentDidMount()
  {
    let connection = $.hubConnection('http://bss-interstella-api.azurewebsites.net:80');
    let proxy = connection.createHubProxy('ChatHub');
    
    proxy.on('successfulJoin', this.userJoined);
    proxy.on('userDisconnected', this.userDisconnected);
    proxy.on('broadcastMessage', this.messageRecieved);
    
    let username = prompt("Enter your name:");
    //is session id query param present

    // atempt connection, and handle errors
    connection.start({ jsonp: true }).done(function() {
      console.log('Now connected, connection ID=' + connection.id);
      if (username !== null && username.length > 0) {
            proxy.invoke('join', username).fail(function (error) {
            console.log('Invocation of join failed. Error: ' + error);
        });
      }
    })
    .fail(function(){ console.log('Could not connect'); });
    
    this.setState(Object.assign(this.state, { proxy: proxy, userName: username }));
  }

  render() {
    let users = this.state.connectedUsers.map(user => {return (<li>{user.Name}</li>)});
    let messages = this.state.messages.map(message => {return (<li>{message}</li>)});
    
    return (
      <div className="chat-container">
        <ul className="users">
          {users}
        </ul>
        <div className="messages">
          <ul>
            {messages}
          </ul>
        </div>
        <input ref="messageBox" type="text" />
        <input type="button" onClick={() => this.sendMessage()} value="send" />
      </div>
    );
  }
}
