import { createContext, useState, useEffect } from 'react'
import { socket } from '../api/hooks/socket'

type ContextProps = {
  messageArray: any[]
}

export const ChatContext = createContext<Partial<ContextProps>>({})

const ChatProvider: React.FC = ({ children }) => {
  const [message, setMessage] = useState(null)
  const [messageArray, setMessageArray] = useState([])
  const [isUpdated, setUpdate] = useState(false)

  useEffect(() => {
    if (isUpdated) {
      setMessageArray([...messageArray, message])
      setUpdate(false)
    }
  }, [message, isUpdated])

  useEffect(() => {
    try {
      socket.on('chatmsg', (msg: any) => {
        if (msg && msg.message && msg.user && !isUpdated) {
          const temp = {
            user: msg.user,
            message: msg.message,
            signature: msg.token.signature,
            time: msg.message_timestam,
          }
          setMessage(temp)
          setUpdate(true)
        }
      })
    } catch (e) {
      throw e
    }
  }, [])

  return <ChatContext.Provider value={{ messageArray }}>{children}</ChatContext.Provider>
}

export default ChatProvider
