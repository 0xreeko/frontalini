import { CurrencyAmount, Token, Currency } from '@sushiswap/sdk'
import React, { useState, useEffect, useContext } from 'react'
import { useInterval } from 'react-interval-hook'
import { toast } from 'react-toastify'
import Image from 'next/image'
import cx from 'classnames'

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useETHBalances } from '../../state/wallet/hooks'
import { useBetTails, useBetHeads, useGetUserBetStatus, useGetLastBetHistory } from '../../hooks/useCoinToss'
import { NotificationContext } from '../../context/notification'
import { isArray } from 'lodash'
import { MATIC_BETTING_MIN } from '../../constants/api-constants'

type Props = {
  timeRemain: number
  roundId: number
  winAmount: number
  winSymbol: string
  headsPayout: number
  tailsPayout: number
  winnerList: boolean[]
}

const TossLive: React.FC<Props> = ({
  timeRemain,
  roundId,
  winAmount,
  winSymbol,
  headsPayout,
  tailsPayout,
  winnerList = [],
}) => {
  const { notification, setNotification } = useContext(NotificationContext)
  const { account, chainId } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  const [maxBalance, setMaxBalance] = useState(0)
  const [amount, setAmount] = useState(0)
  const [time, setTime] = useState(timeRemain)
  const [showModal, setShowModal] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [mode, setMode] = useState('')
  const [betTails, tailSuccess, tailLoading] = useBetTails()
  const [betHeads, headSuccess, headLoading] = useBetHeads()

  const [progressWidth, setProgressWidth] = useState((timeRemain / 180) * 100 + '%')
  const [getLastBetHistory] = useGetLastBetHistory()

  const [headClassname, setHeadClassname] = useState('bg-c202C3A border-cF0EFEE')
  const [headSubClassname, setHeadSubClassname] = useState('border-cF0EFEE')
  const [headClick, setHeadClick] = useState(false)
  const [tailClassname, setTailClassname] = useState('bg-c202C3A border-cF0EFEE')
  const [tailSubClassname, setTailSubClassname] = useState('border-cF0EFEE')
  const [tailClick, setTailClick] = useState(false)

  const [headShow, setHeadShow] = useState(true)
  const [tailShow, setTailShow] = useState(true)

  const [isBetPending, setIsBetPending] = useState(true)
  const [getUserBetStatus] = useGetUserBetStatus()

  const [timeRemainText, setTimeRemainText] = useState('PLACE BET')

  useEffect(() => {
    if (time < 1) setTimeRemainText('Next Round Starting Imminently')
    else
      setTimeRemainText(
        'PLACE BET - ' +
          `${Math.floor(time / 60)}:${Math.round(time % 60) < 10 ? '0' + Math.round(time % 60) : Math.round(time % 60)}`
      )
  }, [time])

  useEffect(() => {
    const getResult = async (roundId: number) => {
      const result = await getUserBetStatus(roundId, account)
      if (result === 1) {
        setHeadShow(true)
        setTailShow(false)
      } else if (result === 0) {
        setHeadShow(false)
        setTailShow(true)
      }
    }
    if (roundId > 1) getResult(roundId)
  }, [])

  const { start, stop } = useInterval(
    () => {
      time > 0 ? setTime(time - 1) : stop()
      setProgressWidth((time / 180) * 100 + '%')
    },
    1000,
    {
      autoStart: false,
      immediate: false,
      onFinish: async () => {},
    }
  )

  const getResult = async (roundId: number) => {
    const result = await getLastBetHistory(roundId, account)
    // let temp = [...notification]
    let data = localStorage.getItem('notifications')
    let temp = []
    if (data) temp = JSON.parse(data)
    if (result.status === 1) {
      if (isArray(temp)) {
        temp.push({
          winType: 'won',
          panel: 'Coin Flip Challenge',
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
          panel: 'Coin Flip Challenge',
          coinType: 'MATIC',
          amount: result.amount,
        })
        localStorage.setItem('notifications', JSON.stringify(temp))
      }
      toast(`You Lost #${roundId} Round!`, { bodyClassName: 'font-sans text-cF0EFEE' })
    }
    // setNotification(temp)
  }

  useEffect(() => {
    if (roundId > 1) getResult(roundId - 1)
    start()
  }, [])

  useEffect(() => {
    setAmount(parseFloat(localStorage.getItem('toss_amount')) || 3)
  }, [localStorage.getItem('toss_amount')])

  useEffect(() => {
    if (userEthBalance) {
      const temp = parseFloat(userEthBalance?.toSignificant(4))
      setMaxBalance(temp)
    }
  }, [userEthBalance])

  useEffect(() => {
    if (tailSuccess && tailLoading === false) {
      setShowModal(false)
      setCompleted(true)
    }
  }, [tailSuccess, tailLoading])

  useEffect(() => {
    if (headSuccess && headLoading === false) {
      setShowModal(false)
      setCompleted(true)
    }
  }, [headSuccess, headLoading])

  const handleBet = async () => {
    await localStorage.setItem('toss_amount', amount.toString())

    const bettingMin = parseFloat(MATIC_BETTING_MIN)
    if (amount < bettingMin) {
      toast(`Minimum bet amount is ${bettingMin}. Please increase bet size.`, { bodyClassName: 'font-sans text-cF0EFEE' })
      return
    }

    if (mode === 'TAILS') {
      try {
        const result: any = await betTails(roundId, amount)
        if (result?.blockNumber > 0) {
          setIsBetPending(false)
          setHeadShow(false)
        } else {
          toast('Bet Reverted: Round Closed', { bodyClassName: 'font-sans text-cF0EFEE' })
        }
      } catch (e) {
        console.log('Bet tails failed', e)
        if (e.message.includes('Internal JSON-RPC error'))
          if (e.data?.message?.includes('insufficient funds for gas'))
            toast('Not enough funds to complete transaction', { bodyClassName: 'font-sans text-cF0EFEE' })
          else toast(e.data.details || e.data.message, { bodyClassName: 'font-sans text-cF0EFEE' })
        else toast(e.message, { bodyClassName: 'font-sans text-cF0EFEE' })
      }
    } else if (mode === 'HEADS') {
      try {
        const result: any = await betHeads(roundId, amount)
        if (result?.blockNumber > 0) {
          setIsBetPending(false)
          setTailShow(false)
        } else {
          toast('Bet Reverted: Round Closed', { bodyClassName: 'font-sans text-cF0EFEE' })
        }
      } catch (e) {
        console.log('Bet heads failed', e)
        if (e.message.includes('Internal JSON-RPC error'))
          if (e.data?.message?.includes('insufficient funds for gas'))
            toast('Not enough funds to complete transaction', { bodyClassName: 'font-sans text-cF0EFEE' })
          else toast(e.data.details || e.data.message, { bodyClassName: 'font-sans text-cF0EFEE' })
        else toast(e.message, { bodyClassName: 'font-sans text-cF0EFEE' })
      }
    }
  }

  return (
    <div className="relative self-center flex-shrink-0 border rounded-lg w-90 h-[25.5rem] bg-c202C3A border-cF0EFEE">
      <div className="flex justify-between items-center p-2.5 bg-c202C3A rounded-t-lg">
        <div className="flex items-center font-bold">
          <Image src="/images/toss/play.png" alt="place" width="24px" height="24px" />
          <span className="ml-1 font-sans text-cF0EFEE">{timeRemainText}</span>
        </div>
        <div className="font-sans text-10px text-cF0EFEE">#{roundId}</div>
      </div>

      <div className="relative h-2 max-w-xl overflow-hidden">
        <div className="meter">
          <span style={{ width: progressWidth }}>
            <span className="progress"></span>
          </span>
        </div>
      </div>

      <div className="h-20 m-auto mt-2 overflow-hidden w-65">
        {headShow && (
          <div className="relative">
            <div
              className={cx(
                'absolute z-20 flex flex-col items-center w-64 h-64 pt-4 border-4 rounded-full cursor-pointer aboflex',
                headClassname
              )}
              onMouseEnter={() => {
                setHeadClassname('border-cE3122D bg-cE3122D')
                setHeadSubClassname('border-cE3122D')
              }}
              onMouseLeave={() => {
                if (!headClick) {
                  setHeadClassname('bg-c202C3A border-cF0EFEE')
                  setHeadSubClassname('border-cF0EFEE')
                }
              }}
              onClick={() => {
                setHeadClassname('border-cE3122D bg-cE3122D')
                setHeadSubClassname('border-cE3122D')
                setHeadClick(true)
                setTailClick(false)
                setTailClassname('bg-c202C3A border-cF0EFEE')
                setTailSubClassname('border-cF0EFEE')
                setMode('HEADS')
                setShowModal(true)
              }}
            >
              <div className="text-2xl md:text-3xl font-sansBold text-cF0EFEE">HEADS</div>
              <div className="font-sans text-xs text-cF0EFEE">{headsPayout.toFixed(2)}x Payout</div>
            </div>
            <div
              className={cx(
                'absolute top-0 z-10 w-64 h-64 border-4 rounded-full cursor-pointer bg-c202C3A left-2 aboflex',
                headSubClassname
              )}
            />
          </div>
        )}
      </div>

      <div className="relative h-44.5">
        <div className="box-border flex flex-col items-center justify-center h-full m-auto border bg-c131E2B w-80 rounded-xl border-cF0EFEE">
          {!showModal && !completed && (
            <div className="px-16">
              <div className="w-full">
                <div className="items-center justify-center w-full text-center">
                  <div className="font-sans text-sm text-center text-cF0EFEE">
                    Total Bets: {winAmount.toFixed(2)} {winSymbol}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center w-full mt-5">
                <p className="mb-2 font-sans text-center text-cF0EFEE text-10px">Last 5 rounds</p>
                <div className="flex text-center">
                  <div className="relative flex" style={{ width: '123px' }}>
                    {winnerList.map((v: boolean, i: number) => {
                      const left = i * 22 + 'px'
                      const zIndex = (5 - i) * 10
                      if (v)
                        return (
                          <img
                            key={i}
                            className="absolute"
                            src="/images/toss/head.png"
                            alt="head"
                            style={{ width: '32.56px', height: '32.56px', left, zIndex }}
                          />
                        )
                      return (
                        <img
                          key={i}
                          className="absolute"
                          style={{ width: '32.56px', height: '32.56px', left, zIndex }}
                          src="/images/toss/tail.png"
                          alt="head"
                        />
                      )
                    })}
                  </div>
                  <img
                    src="/images/toss/dots.png"
                    alt="head"
                    style={{ width: '11.49px', height: '11.49px' }}
                    className="self-center"
                  />
                  <img src="/images/toss/question.png" alt="head" style={{ width: '32.56px', height: '32.56px' }} />
                </div>
              </div>
            </div>
          )}
          {showModal && (
            <div className="px-16">
              <div className="w-full">
                <div className="items-center justify-between w-full text-center">
                  <div className="font-sans text-sm text-center text-cF0EFEE">
                    Total Bets: {winAmount.toFixed(2)} {winSymbol}
                  </div>
                </div>
                <div className="w-full mt-2">
                  <input
                    type="number"
                    className="w-full px-1 font-sans text-right border rounded h-5.5 border-radius-sm text-c111822"
                    value={amount}
                    onTouchMove={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => setAmount(parseFloat(parseFloat(e.target.value).toFixed(5)))}
                  />
                  <div className="flex justify-end text-8px text-cF0EFEE">
                    <span className="underline cursor-pointer" onClick={() => setAmount(maxBalance)}>
                      Max
                    </span>
                    : {maxBalance}
                  </div>
                  <div className="flex justify-between w-full mt-2">
                    <button
                      className="px-1 py-1 font-sans rounded bg-cE3122D text-cF0EFEE text-6px"
                      onClick={() => setAmount(maxBalance * 0.1)}
                    >
                      10%
                    </button>
                    <button
                      className="px-1 py-1 font-sans rounded bg-cE3122D text-cF0EFEE text-6px"
                      onClick={() => setAmount(maxBalance * 0.25)}
                    >
                      25%
                    </button>
                    <button
                      className="px-1 py-1 font-sans rounded bg-cE3122D text-cF0EFEE text-6px"
                      onClick={() => setAmount(maxBalance * 0.5)}
                    >
                      50%
                    </button>
                    <button
                      className="px-1 py-1 font-sans rounded bg-cE3122D text-cF0EFEE text-6px"
                      onClick={() => setAmount(maxBalance * 0.75)}
                    >
                      75%
                    </button>
                    <button
                      className="px-1 py-1 font-sans rounded bg-cE3122D text-cF0EFEE text-6px"
                      onClick={() => setAmount(maxBalance)}
                    >
                      Max
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center w-full mt-2.5">
                <div className="flex items-center w-full">
                  <button
                    className={'bg-cE3122D text-cF0EFEE font-sans text-10px p-1 w-full text-center rounded'}
                    onClick={handleBet}
                  >
                    BET {mode}
                  </button>
                  {/* )} */}
                </div>
                <button
                  onClick={() => {
                    setTailClassname('bg-c202C3A border-cF0EFEE')
                    setTailSubClassname('border-cF0EFEE')
                    setTailClick(false)
                    setHeadClassname('bg-c202C3A border-cF0EFEE')
                    setHeadSubClassname('border-cF0EFEE')
                    setHeadClick(false)
                    setShowModal(false)
                  }}
                  className="mt-2.5 text-cD6D5D4 text-8px"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {completed && !isBetPending && (
            <div className="px-12">
              <div className="w-full text-base text-center font-sansBold text-cF0EFEE">Bet Placed Successfully!</div>
              <div className="w-full mt-1">
                <div className="flex items-center justify-between w-full">
                  <div className="font-sans text-sm text-cF0EFEE">Total Bets:</div>
                  <div className="font-sans text-sm text-cF0EFEE">
                    {winAmount.toFixed(2)} {winSymbol}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center w-full mt-4">
                <button
                  className="w-full p-1 font-sans text-center rounded bg-cE3122D text-cF0EFEE text-10px"
                  onClick={() => {
                    setShowModal(true)
                    setCompleted(false)
                  }}
                >
                  ADD TO BET
                </button>
                <button
                  onClick={() => {
                    setCompleted(false)
                  }}
                  className="mt-3 text-cD6D5D4 text-8px"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {completed && isBetPending && <Image src="/images/gif/Coin_3.gif" alt="place" width="170px" height="170px" />}
        </div>
      </div>

      <div className="h-20 m-auto overflow-hidden rotate-180 w-65">
        {tailShow && (
          <div className="relative">
            <div
              className={cx(
                'absolute z-20 flex flex-col items-center w-64 h-64 pt-4 border-4 rounded-full cursor-pointer aboflex',
                tailClassname
              )}
              onMouseEnter={() => {
                setTailClassname('border-cE3122D bg-cE3122D')
                setTailSubClassname('border-cE3122D')
              }}
              onMouseLeave={() => {
                if (!tailClick) {
                  setTailClassname('bg-c202C3A border-cF0EFEE')
                  setTailSubClassname('border-cF0EFEE')
                }
              }}
              onClick={() => {
                setTailClassname('border-cE3122D bg-cE3122D')
                setTailSubClassname('border-cE3122D')
                setTailClick(true)
                setHeadClick(false)
                setHeadClassname('bg-c202C3A border-cF0EFEE')
                setHeadSubClassname('border-cF0EFEE')
                setMode('TAILS')
                setShowModal(true)
              }}
            >
              <div className="text-2xl rotate-180 md:text-3xl font-sansBold text-cF0EFEE">TAILS</div>
              <div className="font-sans text-xs rotate-180 text-cF0EFEE">{tailsPayout.toFixed(2)}x Payout</div>
            </div>
            <div
              className={cx(
                'absolute top-0 z-10 w-64 h-64 border-4 rounded-full cursor-pointer right-2 aboflex',
                tailSubClassname
              )}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default TossLive
