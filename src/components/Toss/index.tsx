import React from 'react'

import TossUpComing from './TossUpComming'
import TossClosed from './TossClosed'
import TossLive from './TossLive'
import TossLiveStatic from './TossLiveStatic'
import TossUpComingStatic from './TossUpCommingStatic'
import TossClosedStatic from './TossClosedStatic'
import { TossType } from '../../hooks/types'

interface TossProps {
  item: TossType
  swiperIndex: number
}

const Toss: React.FC<TossProps> = ({ item, swiperIndex }) => {
  const timeRemain = item.closeTimestamp - Math.floor(new Date().getTime() / 1000)
  return (
    <>
      {item.status === 0 && (
        <TossClosed
          oracleCalled={item.oracleCalled}
          roundId={item.epoch}
          winner={item.winner ? 'HEAD' : 'TAIL'}
          winAmount={item.totalAmount}
          winSymbol="MATIC"
          swiperIndex={swiperIndex}
        />
      )}
      {item.status === 1 && (
        <TossLive
          timeRemain={timeRemain}
          roundId={item.epoch}
          winAmount={item.totalAmount}
          winSymbol="MATIC"
          headsPayout={item.Headpayout}
          tailsPayout={item.Tailpayout}
          winnerList={item.winnerList}
        />
      )}
      {item.status === 2 && <TossUpComing roundId={item.epoch} timeRemain={timeRemain} />}
      {item.status === 3 && (
        <TossClosedStatic
          oracleCalled={item.oracleCalled}
          roundId={item.epoch}
          winner={item.winner ? 'HEAD' : 'TAIL'}
          winAmount={item.totalAmount}
          winSymbol="MATIC"
          swiperIndex={swiperIndex}
        />
      )}
      {item.status === 4 && (
        <TossLiveStatic
          timeRemain={timeRemain}
          roundId={item.epoch}
          winAmount={item.totalAmount}
          winSymbol="MATIC"
          headsPayout={item.Headpayout}
          tailsPayout={item.Tailpayout}
          winnerList={item.winnerList}
        />
      )}
      {item.status === 5 && <TossUpComingStatic roundId={item.epoch} timeRemain={timeRemain} />}
    </>
  )
}

export default Toss
