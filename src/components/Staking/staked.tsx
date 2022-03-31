import React from 'react'
import Image from 'next/image'

import { numberWithCommas } from '../../utils'

type Props = {
  amount?: number
  decimals?: number
  symbol?: string
}

const Staked: React.FC<Props> = ({ amount = 0, symbol = 'BOLD', decimals = 4 }) => {
  return (
    <div className="flex flex-col w-1/2 py-6 pl-4 pr-6 border rounded bg-c202C3A border-cF0EFEE">
      <div className="flex justify-between w-full">
        <p className="text-base font-sansBold text-cF0EFEE">Staked Balance</p>
      </div>
      <p className="flex items-center justify-center flex-1 w-full py-6 text-lg text-center sm:text-2xl font-sansBold text-cF0EFEE">
        {parseFloat(amount.toFixed(decimals))} {symbol}
      </p>
    </div>
  )
}

export default Staked
