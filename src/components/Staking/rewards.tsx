import React from 'react'
import cx from 'classnames'
import Image from 'next/image'

import { numberWithCommas } from '../../utils'

type Props = {
  rewardAmount?: number
  claimAction: Function
  isPending: boolean
}

const Rewards: React.FC<Props> = ({ rewardAmount = 0, claimAction, isPending = false }) => {
  console.log(rewardAmount)
  return (
    <div className="flex flex-col w-1/2 py-6 pl-4 pr-6 border rounded bg-c202C3A border-cF0EFEE">
      <div className="flex justify-between w-full">
        <p className="text-base font-sansBold text-cF0EFEE">Rewards Earned</p>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 flex-auto w-full py-6 mt-2 lg:flex-row">
        <p className="text-lg text-center sm:w-full md:text-2xl font-sansBold text-cF0EFEE">
          {parseFloat(rewardAmount.toFixed(4))} BOLD
        </p>

        <button
          className={cx(
            'sm:ml-5 px-2 py-2 text-center rounded cursor-pointer bg-c039300 text-cF0EFEE font-sansBold text-sm sm:w-full',
            (rewardAmount === 0 || !rewardAmount || isPending) && 'bg-disabled cursor-not-allowed'
          )}
          onClick={() => {
            if (rewardAmount > 0 && !isPending) claimAction()
          }}
        >
          Claim Rewards
        </button>
      </div>
    </div>
  )
}

export default Rewards
