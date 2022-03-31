import React from 'react'
import cx from 'classnames'

type Props = {
  tabIndex: number
  tabLabels?: any[]
  setTabIndex: Function
}

const TabLabel: React.FC<Props> = ({ tabIndex = 0, tabLabels = [], setTabIndex }) => {
  return (
    <div className="flex gap-6">
      {tabLabels.map((item) => (
        <p
          key={item.id}
          className={cx(
            'text-xl sm:text-2xl font-sansBold hover:text-white duration-200',
            tabIndex === item.id ? 'underline text-cF0EFEE' : 'text-cFFF05 cursor-pointer'
          )}
          onClick={() => setTabIndex(item.id)}
        >
          {item.label}
        </p>
      ))}
    </div>
  )
}

export default TabLabel
