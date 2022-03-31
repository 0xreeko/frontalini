import React, { useState } from 'react'
import Image from 'next/image'
import cx from 'classnames'

import Staked from './staked'
import Rewards from './rewards'
import TabLabel from './tabLabel'
import Description from './description'

const tabLabels = [
  {
    id: 0,
    label: 'Stake',
  },
  {
    id: 1,
    label: 'Unstake',
  },
]

type Props = {
  title?: string
  apr?: number
  decimals?: number
  linkURL?: string
  stakeAmount?: number
  rewardAmount?: number
  description?: string
  symbol?: string
  disabled?: boolean
  typeAmountAction: Function
  approveAction: Function
  stakeAction: Function
  unstakeAction: Function
  claimAction: Function
  isPending?: boolean
}

const Staking: React.FC<Props> = ({
  title = '',
  apr = 5,
  decimals = 4,
  description = '',
  linkURL = '',
  symbol = 'BOLD',
  stakeAmount = 0,
  rewardAmount = 0,
  disabled = false,
  typeAmountAction,
  approveAction,
  stakeAction,
  unstakeAction,
  claimAction,
  isPending = false,
}) => {
  const [tabIndex, setTabIndex] = useState(0)
  const [stakeValue, setStakeValue] = useState(0)
  const [unstakeValue, setUnstakeValue] = useState(0)
  const handleFocus = (e) => {
    e.target.select()
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Description title={title} apr={apr} description={description} linkURL={linkURL} />
      <div className="flex flex-col gap-5 flex-2">
        <div className="relative flex flex-col items-center justify-center w-full px-5 py-12 border rounded bg-c202C3A border-cF0EFEE">
          {/* !isPending && (
            <div className="block w-full h-full max-w-[25em] max-h-[10em] animate-spin">
              <img src="/images/staking/splashscreen.gif" alt="place" className="w-full h-full" />
            </div>
          ) */}
          <TabLabel tabIndex={tabIndex} setTabIndex={setTabIndex} tabLabels={tabLabels} />
          <div className="flex flex-col pt-8 pb-4 sm:flex-row">
            <input
              type="number"
              className="px-1 py-1.5 font-sans border rounded border-radius-sm text-c111822"
              value={tabIndex === 0 ? parseFloat(stakeValue.toFixed(5)) : parseFloat(unstakeValue.toFixed(4))}
              onClick={handleFocus}
              onChange={(e) => {
                if (tabIndex === 0) {
                  setStakeValue(parseFloat(e.target.value))
                  typeAmountAction(symbol, parseFloat(e.target.value))
                } else if (tabIndex === 1) setUnstakeValue(parseFloat(e.target.value))
              }}
            />
            {tabIndex === 0 ? (
              disabled ? (
                <button
                  className={cx(
                    'sm:ml-1 py-2 px-4 lg:px-10 text-center rounded cursor-pointer bg-c039300 text-cF0EFEE font-sansBold text-sm mt-2 sm:mt-0 lg:text-base',
                    isPending && 'bg-disabled cursor-not-allowed'
                  )}
                  onClick={() => {
                    if (!isPending) approveAction(stakeValue)
                  }}
                >
                  Approve {title}
                </button>
              ) : (
                <button
                  className={cx(
                    'sm:ml-1 py-2 px-4 lg:px-10 text-center rounded cursor-pointer bg-c039300 text-cF0EFEE font-sansBold text-sm mt-2 sm:mt-0 lg:text-base',
                    (stakeValue === 0 || !stakeValue || isPending) && 'bg-disabled cursor-not-allowed'
                  )}
                  onClick={() => {
                    if (stakeValue > 0 && !isPending) stakeAction(stakeValue)
                  }}
                >
                  Stake {title}
                </button>
              )
            ) : (
              <button
                className={cx(
                  'sm:ml-1 py-2 px-4 lg:px-10 text-center rounded cursor-pointer bg-c039300 text-cF0EFEE font-sansBold text-sm mt-2 sm:mt-0 lg:text-base',
                  (unstakeValue === 0 || !unstakeValue || isPending) && 'bg-disabled cursor-not-allowed'
                )}
                onClick={() => {
                  if (unstakeValue > 0 && !isPending) unstakeAction(unstakeValue)
                }}
              >
                Unstake {title}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-1 w-full gap-5">
          <Staked amount={stakeAmount} symbol={symbol} decimals={decimals} />
          <Rewards rewardAmount={rewardAmount} claimAction={claimAction} isPending={isPending} />
        </div>
      </div>
    </div>
  )
}

export default Staking
