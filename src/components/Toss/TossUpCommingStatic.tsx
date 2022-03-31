import React, { useState, useEffect } from 'react'
import { useInterval } from 'react-interval-hook'
import Image from 'next/image'

type Props = {
  timeRemain: number
  roundId: number
}

const TossUpComingStatic: React.FC<Props> = ({ roundId, timeRemain }) => {
  const [time, setTime] = useState(!timeRemain || timeRemain < 1 ? 0 : timeRemain)
  const [timeRemainText, setTimeRemainText] = useState('')

  const { start, stop } = useInterval(() => (time > 0 ? setTime(time - 1) : stop()), 1000, {
    autoStart: false,
    immediate: false,
    onFinish: () => {},
  })

  useEffect(() => {
    if (time > 1) start()
  }, [])

  useEffect(() => {
    if (time < 1) setTimeRemainText('Starting Imminently')
    else
      setTimeRemainText(
        `${Math.floor(time / 60)}:${Math.round(time % 60) < 10 ? '0' + Math.round(time % 60) : Math.round(time % 60)}`
      )
  }, [time])

  useEffect(() => {
    if (timeRemain > 1) setTime(timeRemain)
    start()
  }, [timeRemain])

  return (
    <div className="self-center flex-shrink-0 rounded-lg w-72 h-80 bg-c131E2B">
      <div className="flex justify-between px-2.5 h-10 bg-c202C3A rounded-t-lg items-center">
        <div className="flex items-center font-bold">
          <Image src="/images/toss/clock.png" alt="head" width="19.46px" height="19.46px" />
          <span className="ml-1 font-sans text-xs text-cF0EFEE">UPCOMING</span>
        </div>
      </div>
      <div className="flex flex-col justify-center px-4 h-70">
        <div className="box-border border bg-c111822 h-44 rounded-xl border-cF0EFEE">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="font-sans font-medium text-cF0EFEE">Next Round</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TossUpComingStatic
