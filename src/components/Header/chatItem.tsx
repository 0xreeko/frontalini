import React from 'react'
import cx from 'classnames'
import { getTimeAgo } from '../../utils'

type Props = {
  username?: string
  message?: String
  isMine?: boolean
  timestamp?: Date
}

const ChatItem: React.FC<Props> = ({ username = '', message = '', isMine = false, timestamp = new Date() }) => {
  return (
    <div className={cx('flex flex-col mb-4', isMine ? 'mr-4 items-end' : '')}>
      <div className="flex justify-between mb-1 w-44">
        <p className="font-sansBold text-10px text-cFFFFFF">{username}</p>
        <p className="font-sans text-10px text-cB0AFAE">{getTimeAgo(timestamp.getTime())}</p>
      </div>
      <div className={cx('p-1.5 w-44 rounded-t-md', isMine ? 'bg-c004700 rounded-bl-md' : 'bg-cD6D5D4 rounded-br-md')}>
        <p className={cx('text-14px font-sans', isMine ? 'text-white' : 'text-c202C3A')}>{message}</p>
      </div>
    </div>
  )
}

export default ChatItem
