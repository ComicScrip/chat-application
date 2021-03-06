import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from 'socket.io-client';

import TextContainer from './TextContainer';
import Messages from './Messages';
import InfoBar from './InfoBar';
import Input from './Input';

import './Chat.css';

let socket;

const Chat = ({ location }) => {
  
  
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'localhost:5000'

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);
    console.log(socket)
    setRoom(room);
    setName(name)

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages([ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();
    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  console.log(messages, message)

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <form>
          <input
            className="input"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
          />
         <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
          </form>
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;
