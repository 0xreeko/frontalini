import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'

import { NotificationContext } from '../../context/notification'
import Border from './border'
import { NotificationList } from '../../hooks/types'

type Props = {}

const Notification: React.FC<Props> = () => {
  // const { notification } = useContext(NotificationContext)

  const [notification, setNotification] = useState<NotificationList[]>([])

  useEffect(() => {
    let data = localStorage.getItem('notifications')
    if (data) {
      setNotification(JSON.parse(data))
    }
  }, [])

  const handleDelete = (index: number) => {}

  const clearAll = () => {
    setNotification([])
    localStorage.removeItem('notifications')
  }

  return (
    <>
      {notification.length > 0 ? (
        <>
          {notification.reverse().map((item, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between px-10 py-5">
                <p className="font-sans text-12px text-cF0EFEE">
                  You {item.winType}{' '}
                  <span className="font-sansBold">
                    {item.amount.toFixed(2)}
                    {item.coinType}
                  </span>{' '}
                  on <span className="font-sansBold">{item.panel}</span>
                </p>
                {/* <Image
                  src="/images/menu/close.png"
                  className="cursor-pointer"
                  alt="close"
                  width={16}
                  height={16}
                  onClick={() => handleDelete(index)}
                  objectFit="contain"
                />
                */}
              </div>
              <Border />
            </React.Fragment>
          ))}
          <p
            className="pb-12 mt-5 mr-5 text-right underline duration-300 opacity-50 cursor-pointer font-sansBold hover:opacity-100 text-cF0EFEE"
            onClick={clearAll}
          >
            CLEAR ALL
          </p>
        </>
      ) : (
        <p className="mt-5 text-center font-sansBold text-cF0EFEE">NO NOTIFICATIONS</p>
      )}
    </>
  )
}

export default Notification
