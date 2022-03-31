import React from 'react'
import Image from 'next/image'

type Props = {}

const QuestionImage: React.FC<Props> = () => {
  return (
    <div className="absolute top-5 right-6">
      <Image src="/images/staking/question.png" alt="One Fortune" width="17px" height="17px" objectFit="contain" />
    </div>
  )
}

export default QuestionImage
