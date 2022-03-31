import React from 'react'
import Image from 'next/image'

type Props = {
  title?: string
  apr?: number
  linkURL?: string
  description?: string
}

const Description: React.FC<Props> = ({ title = '', apr = 5, description = '', linkURL = '' }) => {
  return (
    <div className="flex-1 px-8 py-6 border rounded bg-c202C3A border-cF0EFEE">
      <p className="text-xl font-sansBold text-cF0EFEE md:text-3xl">
        {title}
        <a href={linkURL} target="_blank" rel="noreferrer" className="ml-2">
          <Image src="/images/staking/question.png" alt="One Fortune" width="22px" height="22px" objectFit="contain" />
        </a>
      </p>
      <div className="flex mb-3">
        <p className="text-lg font-sansBold text-cF0EFEE md:text-24px">APR {apr}%</p>
      </div>
      <p className="font-sans whitespace-pre-wrap text-cF0EFEE text-base">{description}</p>
    </div>
  )
}

export default Description
