import React, { useState, createContext } from 'react'

import { NotificationList } from '../hooks/types'

type ContextProps = {
  notification: NotificationList[]
  setNotification: Function
}

export const NotificationContext = createContext<Partial<ContextProps>>({})

const NotificationProvider: React.FC = ({ children }) => {
  const [notification, setNotification] = useState([])
  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>{children}</NotificationContext.Provider>
  )
}

export default NotificationProvider
