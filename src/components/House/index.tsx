import React from 'react'

import HouseUpComing from './HouseUpComming'
import HouseClosed from './HouseClosed'
import HouseLive from './HouseLive'
import HouseUpComingStatic from './HouseUpCommingStatic'
import HouseClosedStatic from './HouseClosedStatic'
import HouseLiveStatic from './HouseLiveStatic'
import { HouseType } from '../../hooks/types'

interface HouseProps {
  item: HouseType
  swiperIndex: number
}

const House: React.FC<HouseProps> = ({ item, swiperIndex }) => {
  const timeRemain = item.closeTimestamp - Math.floor(new Date().getTime() / 1000)
  return (
    <>
      {item.status === 0 && (
        <HouseClosed
          oracleCalled={item.oracleCalled}
          roundId={item.epoch}
          winner={item.winner ? 'HEAD' : 'TAIL'}
          winAmount={item.totalAmount}
          winSymbol="BOLD"
          swiperIndex={swiperIndex}
        />
      )}
      {item.status === 1 && (
        <HouseLive
          timeRemain={timeRemain}
          roundId={item.epoch}
          winAmount={item.totalAmount}
          winSymbol="BOLD"
          headsPayout={item.Headpayout}
          tailsPayout={item.Tailpayout}
          winnerList={item.winnerList}
        />
      )}
      {item.status === 2 && <HouseUpComing roundId={item.epoch} timeRemain={timeRemain} />}
      {item.status === 3 && (
        <HouseClosedStatic
          oracleCalled={item.oracleCalled}
          roundId={item.epoch}
          winner={item.winner ? 'HEAD' : 'TAIL'}
          winAmount={item.totalAmount}
          winSymbol="BOLD"
          swiperIndex={swiperIndex}
        />
      )}
      {item.status === 4 && (
        <HouseLiveStatic
          timeRemain={timeRemain}
          roundId={item.epoch}
          winAmount={item.totalAmount}
          winSymbol="BOLD"
          headsPayout={item.Headpayout}
          tailsPayout={item.Tailpayout}
          winnerList={item.winnerList}
        />
      )}
      {item.status === 5 && <HouseUpComingStatic roundId={item.epoch} timeRemain={timeRemain} />}
    </>
  )
}

export default House
