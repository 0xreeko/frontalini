import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useGetUserBetHistory } from '../../hooks/useCoinTossHouse'
import { useClaim } from '../../hooks/useCoinTossHouse'

type Props = {
  roundId: number
  winner: string
  winAmount: number
  winSymbol: string
  swiperIndex: number
  oracleCalled: boolean
}

const TossHouseClosed: React.FC<Props> = ({ roundId, winner, winAmount, winSymbol, swiperIndex, oracleCalled }) => {
  const { account } = useActiveWeb3React()
  const [claim] = useClaim()
  const [getUserBetHistory] = useGetUserBetHistory()
  const [userRoundHistory, setUserRoundHistory] = useState(2)
  const [amount, setAmount] = useState(0)
  const [claimable, setClaimable] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 5000)
  }, [])

  useEffect(() => {
    const getResult = async (roundId: number) => {
      const result = await getUserBetHistory(roundId, account)
      setUserRoundHistory(result.status)
      setAmount(result.amount)
      setClaimable(result.claimed)
    }
    if (roundId > 1) getResult(roundId)
  })

  const handleClaim = () => claim(roundId, account)

  return (
    <div className="self-center flex-shrink-0 rounded-lg w-72 h-80 bg-c131E2B">
      <div className="flex items-center justify-between h-10 px-2.5 rounded-t-lg bg-c202C3A">
        <div className="flex items-center font-bold">
          <Image src="/images/toss/ban.png" alt="head" width="14.56px" height="14.56px" />
          <span className="ml-1 text-xs text-cF0EFEE">CLOSED</span>
        </div>
        <div className="text-10px text-cF0EFEE">#{roundId}</div>
      </div>
      <div className="flex flex-col justify-center h-70">
        {!oracleCalled ? (
          <Image src="/images/gif/Coin_3.gif" alt="place" width="170px" height="250px" />
        ) : (
          <>
            {swiperIndex !== 5 || (swiperIndex === 5 && isLoaded) ? (
              <>
                <div className="text-2xl font-bold text-center text-cF0EFEE">
                  {userRoundHistory === 2 ? 'Result' : userRoundHistory === 1 ? 'WINNER!' : 'YOU LOST'}
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="my-4">
                    {winner === 'HEAD' && (
                      <Image src="/images/toss/head.png" alt="head" width="55.01px" height="55.01px" />
                    )}
                    {winner === 'TAIL' && (
                      <Image src="/images/toss/tail.png" alt="head" width="55.01px" height="55.01px" />
                    )}
                  </div>
                  <div className="flex w-60">
                    <p className="flex-1 font-sans font-bold text-right text-md text-cF0EFEE">Your Bet: </p>
                    <p className="flex-1 ml-2 font-sans font-bold text-left text-md text-cF0EFEE">
                      {amount.toFixed(3)} {winSymbol}
                    </p>
                  </div>
                  <div className="flex w-60">
                    {userRoundHistory !== 2 && (
                      <>
                        <p className="flex-1 font-sans font-bold text-right text-md text-cF0EFEE">
                          {userRoundHistory === 1 ? 'You Won: ' : 'You Lost: '}{' '}
                        </p>
                        <p className="flex-1 ml-2 font-sans font-bold text-left text-md text-cF0EFEE">
                          {userRoundHistory === 1 ? (amount * 1.98).toFixed(3) : amount.toFixed(3)} {winSymbol}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {userRoundHistory === 1 && !claimable && (
                  <div className="pt-5 text-center">
                    <button
                      className="w-40 py-2 font-sans text-xs font-bold rounded text-cF0EFEE hover:bg-blue-700 bg-c039300"
                      onClick={handleClaim}
                    >
                      CLAIM
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Image src="/images/gif/Coin_3.gif" alt="place" width="170px" height="250px" />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TossHouseClosed
