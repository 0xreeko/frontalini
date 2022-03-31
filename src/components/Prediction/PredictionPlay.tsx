import React, { useState, useEffect, useContext } from 'react'
import { useInterval } from 'react-interval-hook'
import { toast } from 'react-toastify'
import Image from 'next/image'
import cx from 'classnames'

import { useGetOraclePrice, useGetUserBetHistory } from '../../hooks/usePrediction'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { numberWithCommas } from '../../utils'
import { NotificationContext } from '../../context/notification'
import { isArray } from 'lodash'

type Props = {
  timeRemain: number
  roundId: number
  winAmount: number
  winSymbol: string
  headsPayout: number
  tailsPayout: number
  lockPrice: number
}

const PredictionPlay: React.FC<Props> = ({
  timeRemain,
  roundId,
  winAmount,
  winSymbol,
  headsPayout,
  tailsPayout,
  lockPrice = 0,
}) => {
  const { notification, setNotification } = useContext(NotificationContext)
  const { account } = useActiveWeb3React()
  const [time, setTime] = useState(timeRemain)
  const [increaseAmount, setIncreaseAmount] = useState(0)
  const price = useGetOraclePrice()

  const [progressWidth, setProgressWidth] = useState((timeRemain / 300) * 100 + '%')
  const [getUserBetHistory] = useGetUserBetHistory()

  const percent =
    (increaseAmount * 100) / lockPrice > 2
      ? 2
      : (increaseAmount * 100) / lockPrice < -2
      ? -2
      : (increaseAmount * 100) / lockPrice

  let sliderLeft = percent > 0 ? 54 + Math.abs((percent * 50) / 4) + '%' : 60 + Math.abs((percent * 50) / 4) + '%'
  if (percent === 0) sliderLeft = '44%'

  useEffect(() => {
    setIncreaseAmount(price - lockPrice)
  }, [price])

  const { start, stop } = useInterval(
    () => {
      time > 0 ? setTime(time - 1) : stop()
      setProgressWidth((time / 300) * 100 + '%')
    },
    1000,
    {
      autoStart: false,
      immediate: false,
      onFinish: async () => {},
    }
  )

  const getResult = async (roundId: number) => {
    const result = await getUserBetHistory(roundId, account)
    // let temp = [...notification]
    let data = localStorage.getItem('notifications')
    let temp = []
    if (data) temp = JSON.parse(data)
    if (result.status === 1) {
      if (isArray(temp)) {
        temp.push({
          winType: 'won',
          panel: 'Predict the Market Challenge',
          coinType: 'MATIC',
          amount: result.winAmount,
        })
        localStorage.setItem('notifications', JSON.stringify(temp))
      }
      toast(`You Won #${roundId} Round!`, { bodyClassName: 'font-sans text-cF0EFEE' })
    } else if (result.status === 0) {
      if (isArray(temp)) {
        temp.push({
          winType: 'lost',
          panel: 'Predict the Market Challenge',
          coinType: 'MATIC',
          amount: result.amount,
        })
        localStorage.setItem('notifications', JSON.stringify(temp))
      }
      toast(`You Lost #${roundId} Round!`, { bodyClassName: 'font-sans text-cF0EFEE' })
    }
    // setNotification(temp)
  }

  const timeRemainText = `${Math.floor(time / 60)}:${
    Math.round(time % 60) < 10 ? '0' + Math.round(time % 60) : Math.round(time % 60)
  }`

  useEffect(() => {
    if (roundId > 1) getResult(roundId - 1)
    start()
  }, [])

  return (
    <div className="relative self-center flex-shrink-0 border rounded-lg w-90 h-[25.5rem] bg-c202C3A border-cF0EFEE">
      <div className="flex justify-between items-center p-2.5 bg-c202C3A rounded-t-lg">
        <div className="flex items-center font-bold">
          <Image src="/images/toss/play_red.png" alt="place" width="24px" height="24px" />
          <span className="ml-1 font-sans text-cE3122D">IN PLAY</span>
          <span className="ml-1 font-sans text-cF0EFEE"> - {timeRemainText}</span>
        </div>
        <div className="font-sans text-10px text-cF0EFEE">#{roundId}</div>
      </div>

      <div className="relative h-2 max-w-xl mb-2 overflow-hidden">
        <div className="meter">
          <span style={{ width: progressWidth }}>
            <span className="progress"></span>
          </span>
        </div>
      </div>
      {increaseAmount >= 0 && (
        <div className="h-20 m-auto mt-2 overflow-hidden w-65">
          <div className="relative">
            <div className="absolute z-20 flex flex-col items-center w-64 h-64 pt-4 border-4 rounded-full aboflex bg-c039300 border-c039300">
              <div className="text-2xl md:text-3xl font-sansBold text-cF0EFEE">UP</div>
              <div className="font-sans text-xs text-cF0EFEE">{headsPayout.toFixed(2)}x Payout</div>
            </div>
            <div className="absolute top-0 z-10 w-64 h-64 border-4 rounded-full bg-c202C3A left-2 aboflex border-c039300" />
          </div>
        </div>
      )}

      <div className="relative h-64.5">
        <div className="box-border flex flex-col items-center justify-center h-full m-auto border bg-c131E2B w-80 rounded-xl border-cF0EFEE">
          <div className="flex justify-between w-full px-12 mb-10">
            {increaseAmount >= 0 ? (
              <Image src="/images/toss/up.png" alt="up" width="22.4px" height="35.88px" />
            ) : (
              <Image src="/images/toss/down.png" alt="down" width="22.4px" height="35.88px" />
            )}
            <div>
              <p className="font-sans text-cF0EFEE text-12px">Last Price</p>
              <p className="font-sansBold text-cF0EFEE"> ${numberWithCommas(price.toFixed(2))}</p>
            </div>
            <div className="flex items-end">
              <p className={cx('font-sans text-12px', increaseAmount >= 0 ? 'text-c039300' : 'text-cE3122D')}>
                {increaseAmount >= 0 ? '+' : '-'}${Math.abs(increaseAmount).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex w-60">
            <p className="flex-1 font-sans font-bold text-right text-md text-cF0EFEE">Locked Price: </p>
            <p className="flex-1 ml-2 font-sans font-bold text-left text-md text-cF0EFEE">
              ${numberWithCommas(lockPrice.toFixed(2))}
            </p>
          </div>
          <div className="flex w-60">
            <p className="flex-1 font-sans font-bold text-right text-md text-cF0EFEE">Total Bets: </p>
            <p className="flex-1 ml-2 font-sans font-bold text-left text-md text-cF0EFEE">
              {winAmount.toFixed(2)} {winSymbol}
            </p>
          </div>
          <div className="relative flex items-center justify-between w-64 h-12 mt-9">
            <div className="w-px h-4 bg-cF0EFEE"></div>
            <div className="w-px h-8.5 bg-cF0EFEE"></div>
            <div className="w-px h-4 bg-cF0EFEE"></div>

            <div className="absolute w-full h-px bg-cF0EFEE"></div>

            <div
              className="absolute z-10 flex w-12 h-12"
              style={increaseAmount < 0 ? { right: sliderLeft } : { left: sliderLeft }}
            >
              <div className="absolute w-12 h-12 ml-0 bg-transparent border rounded-full opacity-25 border-cF0EFEE"></div>
              <div className="absolute w-12 h-12 ml-1 bg-transparent border rounded-full opacity-50 border-cF0EFEE"></div>
              <div
                className={cx(
                  'ml-2 absolute h-12 w-12 bg-transparent opacity-90 border border-cF0EFEE rounded-full flex justify-center',
                  increaseAmount >= 0 ? 'bg-c039300' : 'bg-cE3122D'
                )}
              >
                <p className="self-center font-sansBold text-10px text-cF0EFEE">
                  {increaseAmount >= 0 && '+'}
                  {percent.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {increaseAmount < 0 && (
        <div className="h-20 m-auto overflow-hidden rotate-180 w-65">
          <div className="relative">
            <div className="absolute z-20 flex flex-col items-center w-64 h-64 pt-4 border-4 rounded-full aboflex border-cE3122D bg-cE3122D">
              <div className="text-2xl rotate-180 md:text-3xl font-sansBold text-cF0EFEE">DOWN</div>
              <div className="font-sans text-xs rotate-180 text-cF0EFEE">{tailsPayout.toFixed(2)}x Payout</div>
            </div>
            <div className="absolute top-0 z-10 w-64 h-64 border-4 rounded-full right-2 aboflex border-cE3122D bg-c202C3A" />
          </div>
        </div>
      )}
    </div>
  )
}

export default PredictionPlay
