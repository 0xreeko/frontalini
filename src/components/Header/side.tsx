import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import cx from 'classnames'

import Chat from './chat'
import Help from './help'
import Account from './account'
import Notification from './notification'
import { useLogin } from '../../api/hooks/info'
import { useActiveWeb3React } from '../../hooks'
import { NotificationList } from '../../hooks/types'

type props = {
  selectedIndex?: number
  onClose: Function
}
const Side: React.FC<props> = ({ selectedIndex = 0, onClose }) => {
  const [index, setIndex] = useState(selectedIndex)
  const [username, setUsername] = useState('')
  const tabItems = [
    { id: 0, label: 'CHAT' },
    { id: 1, label: 'NOTIFICATION' },
    { id: 2, label: 'ACCOUNT' },
    { id: 3, label: 'HELP' },
  ]
  const { account, library } = useActiveWeb3React()
  const { login, user, loading, success } = useLogin()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const getSignature = async () => {
    const loggedIn = localStorage.getItem('username')
    if (loggedIn) {
      setUsername(loggedIn)
      setIsLoggedIn(true)
    } else {
      let tokenPayload = {
        address: account,
        timestamp: new Date(),
      }
      let signature = await library.getSigner().signMessage(JSON.stringify(tokenPayload))
      localStorage.setItem(
        'signature',
        JSON.stringify({
          payload: tokenPayload,
          signature,
        })
      )
      login({
        payload: tokenPayload,
        signature,
      })
    }
  }

  useEffect(() => {
    if (account) getSignature()
  }, [account])

  useEffect(() => {
    if (loading === false && success) {
      setIsLoggedIn(true)
      localStorage.setItem('username', user.user)
      setUsername(user.user)
    }
  }, [loading, success])

  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 z-40 w-full h-full bg-transparent">
      <div className="absolute top-0 bottom-0 left-0 right-0 opacity-50 bg-c1E1F1E" onClick={() => onClose()}></div>
      <div className="absolute right-0 z-50 h-full overflow-y-scroll w-90 bg-c18222E">
        <div className="flex justify-between p-5 bg-cE3122D">
          {tabItems.map((item, i) => (
            <p
              key={item.id}
              className={cx(
                'cursor-pointer font-sansBold text-cF0EFEE text-12px opacity-50 hover:opacity-100 ease-in-out duration-300',
                index === i && 'opacity-100'
              )}
              onClick={() => setIndex(i)}
            >
              {item.label}
            </p>
          ))}

          <Image
            src="/images/menu/close.png"
            className="cursor-pointer"
            alt="close"
            width={16}
            height={16}
            onClick={() => onClose()}
            objectFit="contain"
          />
        </div>
        {isLoggedIn && (
          <>
            {index === 0 && <Chat username={username} />}
            {index === 1 && <Notification />}
            {index === 2 && <Account username={username} />}
            {index === 3 && <Help />}
          </>
        )}
      </div>
    </div>
  )
}

export default Side
