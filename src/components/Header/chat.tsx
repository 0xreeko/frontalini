import React, { useContext, useEffect, useRef, useState } from 'react'

import { ChatContext } from '../../context/chat'
import { socket } from '../../api/hooks/socket'
import ChatItem from './chatItem'

type Props = { username: string }
const Chat: React.FC<Props> = ({ username = '' }) => {
  const [text, setText] = useState('')
  const { messageArray } = useContext(ChatContext)
  const messageRef = useRef(null)

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messageArray])

  const handleSend = () => {
    if (text !== '') {
      const token = localStorage.getItem('signature')
      try {
        socket.emit('chatmsg_send', {
          message: text,
          user: username,
          token: JSON.parse(token),
        })
        setText('')
      } catch (e) {
        throw e
      }
    }
  }

  return (
    <div className="absolute w-full px-3 bg-transparent top-10 py-7" style={{ height: 'calc(100% - 80px)' }}>
      <div className="relative flex w-full h-full gap-2">
        <div className="flex-1 mb-12 overflow-y-scroll">
          {messageArray.map((item, index) => {
            if (item.user === username)
              return (
                <ChatItem
                  key={index}
                  username={item.user}
                  message={item.message}
                  isMine={true}
                  timestamp={new Date(item.time)}
                />
              )
            return (
              <ChatItem
                key={index}
                username={item.user}
                message={item.message}
                isMine={false}
                timestamp={new Date(item.time)}
              />
            )
          })}
          <div ref={messageRef}></div>
        </div>
        <div className="absolute bottom-0 flex items-center w-full h-10">
          <input
            type="text"
            className="flex-1 h-10 p-4 font-sans rounded-l-lg text-12px text-c202C3A"
            placeholder="Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSend()
            }}
          />
          <button
            className="w-24 h-10 p-1 text-center duration-300 ease-in-out rounded-r-lg cursor-pointer hover:bg-c039300 bg-c026100 text-cF0EFEE font-sansBold text-12px"
            onClick={() => handleSend()}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
