import React from 'react'

export default function GamePanel({
  title,
  summary,
  type,
  graphic,
  sectionLeft,
  sectionRight,
}: {
  title?: String
  summary?: String
  type?: JSX.Element
  graphic?: JSX.Element
  sectionLeft?: JSX.Element
  sectionRight?: JSX.Element
}): JSX.Element {
  return (
    <div className="bg-c111822 mx-4 mb-8 rounded-2xl border border-blue-gray-700 h-full">
      <div className={'flex flex-col lg:flex-row'}>
        <div className={'flex-col w-full lg:w-1/2'}>
          <div
            className={
              ' px-4 font-sansBold text-panelTitle uppercase text-white f-full border-b border-blue-gray-700 flex justify-start items-end mt-4 truncate'
            }
          >
            {title}
          </div>
          <div className={'flex flex-row w-full'}>
            <div className={'p-2 w-full lg:w-1/2 border-b border-blue-gray-700 flex justify-center items-center'}>
              {graphic}
            </div>
            <div
              className={
                'py-2 pl-4 w-full lg:w-1/2 text-base rounded-left-InBox font-sansBold text-of-red uppercase border-blue-gray-700'
              }
            >
              {type}
            </div>
          </div>
        </div>
        <div className={'w-full lg:w-1/2 rounded-left-InBox border-blue-gray-700 flex justify-center items-center'}>
          <div className={'p-4 text-white'}>{summary}</div>
        </div>
      </div>

      <div className={'sm:flex-row flex-col flex justify-around'}>
        {sectionLeft}
        {sectionRight}
      </div>
    </div>
  )
}
