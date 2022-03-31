import { CurrencyAmount, Token, Currency } from '@sushiswap/sdk'
import React, { useState, useEffect } from 'react'
import { useInterval } from 'react-interval-hook'
import { toast } from 'react-toastify'
import Image from 'next/image'
import cx from 'classnames'

import { numberWithCommas } from '../../utils'
import { tryParseAmount } from '../../functions/parse'
import { useTokenBalance as useBalance } from '../../state/wallet/hooks'
import { ROUTER_ADDRESS, BOLDTOKEN_ADDRESS } from '../../constants'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useBetTails, useBetHeads, useGetUserBetStatus, useGetOraclePrice } from '../../hooks/usePredictionHouse'
import Modal from '../ClaimModal'
import { BOLD_BETTING_MIN } from '../../constants/api-constants'

type Props = {
  timeRemain: number
  roundId: number
  winAmount: number
  winSymbol: string
  headsPayout: number
  tailsPayout: number
  winnerList: boolean[]
}

const PredictionLive: React.FC<Props> = ({
  timeRemain,
  roundId,
  winAmount,
  winSymbol,
  headsPayout,
  tailsPayout,
  winnerList = [],
}) => {
  const { account, chainId } = useActiveWeb3React()
  const token = new Token(chainId, BOLDTOKEN_ADDRESS, 18)
  const userBalance = useBalance(account, token)
  const [maxBalance, setMaxBalance] = useState(0)

  const [amount, setAmount] = useState(0)
  const [time, setTime] = useState(timeRemain)
  const [showModal, setShowModal] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [mode, setMode] = useState('')
  const [betTails, tailSuccess, tailLoading] = useBetTails()
  const [betHeads, headSuccess, headLoading] = useBetHeads()

  const [progressWidth, setProgressWidth] = useState((timeRemain / 300) * 100 + '%')
  const [typedAmount, setTypedAmount] = useState<CurrencyAmount<Currency>>()
  const [approvalState, approve] = useApproveCallback(typedAmount, ROUTER_ADDRESS)
  const disabled = approvalState !== ApprovalState.APPROVED

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
  const price = useGetOraclePrice()

  const [timeRemainText, setTimeRemainText] = useState('PLACE BET')

  const [modalShow, setModalShow] = useState(false)
  const [checked, setChecked] = useState(false)

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
      if (result === 0) {
        setHeadShow(true)
        setTailShow(false)
      } else if (result === 1) {
        setHeadShow(false)
        setTailShow(true)
      }
    }
    if (roundId > 1) getResult(roundId)
  }, [])

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

  useEffect(() => {
    start()
  }, [])

  useEffect(() => {
    setAmount(parseFloat(localStorage.getItem('predection_house_amount')) || 3)
  }, [localStorage.getItem('predection_house_amount')])

  useEffect(() => {
    setTypedAmount(tryParseAmount(amount.toString(), token))
  }, [amount])

  useEffect(() => {
    if (userBalance) {
      const temp = parseFloat(userBalance.toSignificant(4))
      setMaxBalance(temp)
    }
  }, [userBalance])

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

  const handleBetModal = () => {
    if (checked) {
      localStorage.setItem('BetBoldModalShow', '1')
      
      setModalShow(false)
      handleModal()
    }
  }

  const handleModal = async () => {
    let isShow = ''
    isShow = localStorage.getItem('BetBoldModalShow')
    if(isShow !== '1'){
      setModalShow(true)
    }
    else{
      await handleBet()
    }
  }

  const handleBet = async () => {
    await localStorage.setItem('predection_house_amount', amount.toString())

    const bettingMin = parseFloat(BOLD_BETTING_MIN)
    if (amount < bettingMin) {
      toast(`Minimum bet amount is ${bettingMin}. Please increase bet size.`, { bodyClassName: 'font-sans text-cF0EFEE' })
      return
    }

    if (mode === 'DOWN') {
      try {
        const result: any = await betTails(roundId, amount)
        if (result?.blockNumber > 0) {
          setIsBetPending(false)
          setHeadShow(false)
        } else {
          toast('Bet Reverted: Round Closed', { bodyClassName: 'font-sans text-cF0EFEE' })
        }
      } catch (e) {
        console.log('Bet Down failed', e)
        if (e.message.includes('Internal JSON-RPC error'))
          toast(e.data.details || e.data.message, { bodyClassName: 'font-sans text-cF0EFEE' })
        else toast(e.message, { bodyClassName: 'font-sans text-cF0EFEE' })
      }
    } else if (mode === 'UP') {
      try {
        const result: any = await betHeads(roundId, amount)
        if (result?.blockNumber > 0) {
          setIsBetPending(false)
          setTailShow(false)
        } else {
          toast('Bet Reverted: Round Closed', { bodyClassName: 'font-sans text-cF0EFEE' })
        }
      } catch (e) {
        console.log('Bet UP failed', e)
        if (e.message.includes('Internal JSON-RPC error'))
          toast(e.data.details || e.data.message, { bodyClassName: 'font-sans text-cF0EFEE' })
        else toast(e.message, { bodyClassName: 'font-sans text-cF0EFEE' })
      }
    }
  }

  const handleApprove = async () => {
    try {
      await approve()
    } catch (e) {
      console.log('Approve failed', e)
      if (e.message.includes('Internal JSON-RPC error'))
        toast(e.data.details || e.data.message, { bodyClassName: 'font-sans text-cF0EFEE' })
      else toast(e.message, { bodyClassName: 'font-sans text-cF0EFEE' })
    }
  }

  return (
    <>
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
                setHeadClassname('border-c039300 bg-c039300')
                setHeadSubClassname('border-c039300')
              }}
              onMouseLeave={() => {
                if (!headClick) {
                  setHeadClassname('bg-c202C3A border-cF0EFEE')
                  setHeadSubClassname('border-cF0EFEE')
                }
              }}
              onClick={() => {
                setHeadClassname('border-c039300 bg-c039300')
                setHeadSubClassname('border-c039300')
                setHeadClick(true)
                setTailClick(false)
                setTailClassname('bg-c202C3A border-cF0EFEE')
                setTailSubClassname('border-cF0EFEE')
                setMode('UP')
                setShowModal(true)
              }}
            >
              <div className="text-2xl md:text-3xl font-sansBold text-cF0EFEE">UP</div>
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
              <div className="flex-col items-center justify-center w-full">
                <div className="flex w-60">
                  <p className="flex-1 font-sans font-bold text-right text-md text-cF0EFEE">Current Price: </p>
                  <p className="flex-1 ml-2 font-sans font-bold text-left text-md text-cF0EFEE">
                    ${numberWithCommas(price.toFixed(2))}
                  </p>
                </div>
                <div className="flex w-60">
                  <p className="flex-1 font-sans font-bold text-right text-md text-cF0EFEE">Total Bets: </p>
                  <p className="flex-1 ml-2 font-sans font-bold text-left text-md text-cF0EFEE">
                    {winAmount.toFixed(3)} {winSymbol}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center w-full mt-5">
                <p className="mb-2 font-sans text-center text-cF0EFEE text-10px">Last 5 rounds</p>
                <div className="flex text-center">
                  {winnerList.map((v: boolean, i: number) => {
                    if (v)
                      return (
                        <img
                          key={i}
                          src="/images/toss/up.png"
                          alt="up"
                          style={{ width: '12.29px', height: '19.8px' }}
                          className="mr-2"
                        />
                      )
                    return (
                      <img
                        key={i}
                        style={{ width: '12.29px', height: '19.8px' }}
                        src="/images/toss/down.png"
                        alt="down"
                        className="mr-2"
                      />
                    )
                  })}
                  <img
                    src="/images/toss/question1.png"
                    alt="question"
                    style={{ width: '13.32px', height: '17.82px' }}
                  />
                </div>
              </div>
            </div>
          )}
          {showModal && (
            <div className="px-16">
              <div className="w-full">
                <div className="flex items-center justify-center w-full">
                  <div className="mr-4 font-sans text-sm text-cF0EFEE">Total Bets:</div>
                  <div className="font-sans text-sm text-cF0EFEE">
                    {winAmount.toFixed(3)} {winSymbol}
                  </div>
                </div>
                <div className="w-full mt-2">
                  <input
                    type="number"
                    className="w-full px-1 font-sans text-right border rounded h-5.5 border-radius-sm text-c111822"
                    value={amount}
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
                  {disabled ? (
                    <button
                      className={'bg-cE3122D text-cF0EFEE font-sans text-10px p-1 w-full text-center rounded'}
                      onClick={handleApprove}
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      className={'bg-cE3122D text-cF0EFEE font-sans text-10px p-1 w-full text-center rounded'}
                      onClick={handleBet}
                    >
                      BET {mode}
                    </button>
                  )}
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
                    {winAmount.toFixed(3)} {winSymbol}
                  </div>
                </div>
                {/* <div className="flex items-center justify-between w-full mt-1">
                  <div className="font-sans text-sm text-cF0EFEE">Expected Return:</div>
                  <div className="font-sans text-xs text-cF0EFEE">
                    {mode === 'HEAD' && (amount * headsPayout).toFixed(3)}
                    {mode === 'TAIL' && (amount * tailsPayout).toFixed(3)} {winSymbol}
                  </div>
                </div> */}
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
                {/*<button
                  onClick={() => {
                    setCompleted(false)
                  }}
                  className="mt-3 text-cD6D5D4 text-8px"
                >
                  Cancel
                </button>*/}
              </div>
            </div>
          )}
          {completed && isBetPending && (
            <Image src="/images/gif/Candles_2.gif" alt="place" width="170px" height="170px" />
          )}
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
                setMode('DOWN')
                setShowModal(true)
              }}
            >
              <div className="text-2xl rotate-180 md:text-3xl font-sansBold text-cF0EFEE">DOWN</div>
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
    {modalShow && (
        <Modal onClose={() => setModalShow(false)}>
          <div className="flex items-center content-center justify-center w-full h-full mx-auto">
            <div className="w-full overflow-hidden sm:w-110 rounded-2xl bg-c18222E z-[61] -mt-24 md:mt-0">
              <div className="flex justify-between w-full px-1 pl-4 pr-4 h-9 bg-c039300">
                <div className="flex">
                  <Image
                    src="/images/menu/wallet.png"
                    className="cursor-pointer"
                    alt="Claim"
                    width={16}
                    height={16}
                    objectFit="contain"
                  />
                  <p className="self-center ml-1.5 text-cF0EFEE font-sansBold text-14px">
                    HOUSE GAMES
                  </p>
                </div>
                <Image
                  src="/images/menu/close.png"
                  className="cursor-pointer"
                  alt="close"
                  width={16}
                  height={16}
                  onClick={() => setModalShow(false)}
                  objectFit="contain"
                />
              </div>
              <div className="flex flex-col items-center content-center justify-center px-8 py-8 mb-8">
                <p className="mb-6 text-center text-cF0EFEE font-sansBold text-24px">
                  HOUSE GAMES
                </p>
                <p className="mb-3 font-sans text-center text-cF0EFEE text-12px">
                  Please note that transaction fees for House games are paid in MATIC and are set at 0.5 MATIC per bet.
                </p>
                <button
                  className={cx(
                    'h-6 p-1 mb-4 text-center rounded text-cF0EFEE font-sansBold text-10px w-28 ',
                    checked ? 'cursor-pointer bg-c039300 ' : 'cursor-not-allowed bg-gray-500'
                  )}
                  onClick={() => handleBetModal()}
                >
                  OK
                </button>
                <div className="flex">
                  <input
                    type="checkbox"
                    className="self-center"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                  />
                  <p className="self-center ml-2 font-sansBold text-cF0EFEE text-12px">
                    I understand, don’t show me this again
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default PredictionLive
