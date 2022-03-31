import React from 'react'
import Link from 'next/link'

export default function GameCard({
  title,
  graphic,
  theme,
  buttonText,
  buttonTo,
}: {
  title: String
  graphic?: JSX.Element
  theme?: string
  buttonText?: string
  buttonTo?: string
}): JSX.Element {
  return (
    <Link href={buttonTo}>
      <div
        className={
          'mt-8 mx-auto p-4 pt-0 mb-4 rounded w-10/12 sm:w-5/12 cursor-pointer ' +
          (theme === 'red' ? 'bg-of-red ' : 'bg-of-pale-white')
        }
      >
        <div className={'text-center'}>
          <div className={'-mt-4 mb-4 lg:min-h-[280px]'}>{graphic}</div>
          <div
            className={
              'uppercase text-white font-sansBold md:text-14px line-through-title tracking-wider leading-none ' +
              theme +
              ' ' +
              (theme === 'red' ? 'text-white' : 'text-of-red')
            }
            data-text={title}
          >
            {title}
          </div>
          <div className={'mt-4'}>
            <a
              href={buttonTo}
              className={
                'uppercase block font-FixtureSB rounded-[6px] w-full md:text-26px cursor-pointer pb-2 pt-1 tracking-wide leading-none ' +
                (theme === 'red' ? 'bg-white text-of-red ' : 'bg-of-red text-of-off-white ')
              }
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </Link>
  )
}
