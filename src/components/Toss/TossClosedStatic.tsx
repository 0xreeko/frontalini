import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useGetUserBetHistory } from '../../hooks/useCoinToss'
import { useClaim } from '../../hooks/useCoinToss'

type Props = {
  oracleCalled: boolean
  roundId: number
  winner: string
  winAmount: number
  winSymbol: string
  swiperIndex: number
}

const TossClosedStatic: React.FC<Props> = ({ oracleCalled, roundId, winner, winAmount, winSymbol, swiperIndex }) => {
  const { account } = useActiveWeb3React()
  const [claim] = useClaim()
  const [getUserBetHistory] = useGetUserBetHistory()
  const [userRoundHistory, setUserRoundHistory] = useState(2)
  const [amount, setAmount] = useState(0)
  const [winningAmount, setWinningAmount] = useState(0)
  const [claimable, setClaimable] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="self-center flex-shrink-0 rounded-lg w-72 h-80 bg-c131E2B">
      <div className="flex items-center justify-between h-10 px-2.5 rounded-t-lg bg-c202C3A">
        <div className="flex items-center font-bold">
          <Image src="/images/toss/ban.png" alt="head" width="14.56px" height="14.56px" />
          <span className="ml-1 text-xs text-cF0EFEE">CLOSED</span>
        </div>
      </div>
      <div className="flex flex-col justify-center h-70">
        <div className="text-2xl font-bold text-center text-cF0EFEE">
          {userRoundHistory === 2 ? 'Result' : userRoundHistory === 1 ? 'WINNER!' : 'YOU LOST'}
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex w-40">
            <p className="flex-1 py-10 font-sans font-bold text-center text-md text-cF0EFEE">
              You must connect your wallet to play
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TossClosedStatic
