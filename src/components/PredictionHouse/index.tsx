import React from 'react'

import PredictionUpComing from './PredictionUpComming'
import PredictionClosed from './PredictionClosed'
import PredictionLive from './PredictionLive'
import PredictionPlay from './PredictionPlay'
import PredictionUpComingStatic from './PredictionUpCommingStatic'
import PredictionClosedStatic from './PredictionClosedStatic'
import PredictionLiveStatic from './PredictionLiveStatic'
import PredictionPlayStatic from './PredictionPlayStatic'
import { PredictionType } from '../../hooks/types'

interface PredictionProps {
  item: PredictionType
  swiperIndex: number
}

const Prediction: React.FC<PredictionProps> = ({ item, swiperIndex }) => {
  const timeClose = item.closeTimestamp - Math.floor(new Date().getTime() / 1000)
  const timeLock = item.lockTimestamp - Math.floor(new Date().getTime() / 1000)
  return (
    <>
      {item.status === 0 && (
        <PredictionClosed
          oracleCalled={item.oracleCalled}
          roundId={item.epoch}
          winner={item.winner ? 'HEAD' : 'TAIL'}
          winAmount={item.totalAmount}
          winSymbol="BOLD"
          swiperIndex={swiperIndex}
        />
      )}
      {item.status === 1 && (
        <>
          {item.lockPrice > 0 ? (
            <PredictionPlay
              timeRemain={timeClose}
              roundId={item.epoch}
              winAmount={item.totalAmount}
              winSymbol="BOLD"
              headsPayout={item.Headpayout}
              tailsPayout={item.Tailpayout}
              lockPrice={item.lockPrice}
            />
          ) : (
            <PredictionLive
              timeRemain={timeLock}
              roundId={item.epoch}
              winAmount={item.totalAmount}
              winSymbol="BOLD"
              headsPayout={item.Headpayout}
              tailsPayout={item.Tailpayout}
              winnerList={item.winnerList}
            />
          )}
        </>
      )}
      {item.status === 2 && <PredictionUpComing roundId={item.epoch} timeRemain={timeClose} />}

      {item.status === 3 && (
        <PredictionClosedStatic
          oracleCalled={item.oracleCalled}
          roundId={item.epoch}
          winner={item.winner ? 'HEAD' : 'TAIL'}
          winAmount={item.totalAmount}
          winSymbol="MATIC"
          swiperIndex={swiperIndex}
        />
      )}
      {item.status === 4 && (
        <>
          {item.lockPrice > 0 ? (
            <PredictionPlayStatic
              timeRemain={timeLock}
              roundId={item.epoch}
              winAmount={item.totalAmount}
              winSymbol="MATIC"
              headsPayout={item.Headpayout}
              tailsPayout={item.Tailpayout}
              winnerList={item.winnerList}
            />
          ) : (
            <PredictionLiveStatic
              timeRemain={timeLock}
              roundId={item.epoch}
              winAmount={item.totalAmount}
              winSymbol="MATIC"
              headsPayout={item.Headpayout}
              tailsPayout={item.Tailpayout}
              winnerList={item.winnerList}
            />
          )}
        </>
      )}
      {item.status === 5 && <PredictionUpComingStatic roundId={item.epoch} timeRemain={timeClose} />}
    </>
  )
}

export default Prediction
