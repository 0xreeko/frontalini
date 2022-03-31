import React from 'react'
import { classNames } from '../../functions'

export default function SplitPane({
  left,
  right,
  className = '',
}: {
  left: JSX.Element
  right: JSX.Element
  className: string
}): JSX.Element {
  return (
    <div className={classNames(className, 'flex flex-1 flex-col md:flex-row justify-between pb-2 px-2 md:px-7')}>
      <div className="w-full md:w-1/2">{left}</div>
      <div className="w-full md:w-1/2">{right}</div>
    </div>
  )
}
