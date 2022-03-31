import React, { useState } from 'react'

import { useTopWin24, useTopLoss24, useGlobalStatistics } from '../../api/hooks/info'

const Footer = () => {
  const [isOpen, setOpen] = useState(true)

  const { list: winList, success: winSuccess, loading: winLoading } = useTopWin24()
  const { list: lossList, success: lossSuccess, loading: lossLoading } = useTopLoss24()
  const { list: globalList, success: globalSuccess, loading: globalLoading } = useGlobalStatistics()

  return (
    <footer className="flex-shrink-0 w-full">
      <div className="flex justify-between px-5 py-2 bg-cE3122D rounded-t-2xl ">
        <div className="flex items-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 12V15C3 16.657 6.134 18 10 18C13.866 18 17 16.657 17 15V12C17 13.657 13.866 15 10 15C6.134 15 3 13.657 3 12Z"
              fill="#F1F5F9"
            />
            <path
              d="M3 7V10C3 11.657 6.134 13 10 13C13.866 13 17 11.657 17 10V7C17 8.657 13.866 10 10 10C6.134 10 3 8.657 3 7Z"
              fill="#F1F5F9"
            />
            <path
              d="M17 5C17 6.657 13.866 8 10 8C6.134 8 3 6.657 3 5C3 3.343 6.134 2 10 2C13.866 2 17 3.343 17 5Z"
              fill="#F1F5F9"
            />
          </svg>
          <span className="ml-2 font-sans font-bold text-white text-10px">STATS</span>
        </div>
        <div className="flex items-center">
          <svg
            className="hidden mr-2 cursor-pointer group"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="group-hover:hidden"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.4001 8.0001C14.4001 9.69748 13.7258 11.3253 12.5256 12.5256C11.3253 13.7258 9.69748 14.4001 8.0001 14.4001C6.30271 14.4001 4.67485 13.7258 3.47461 12.5256C2.27438 11.3253 1.6001 9.69748 1.6001 8.0001C1.6001 6.30271 2.27438 4.67485 3.47461 3.47461C4.67485 2.27438 6.30271 1.6001 8.0001 1.6001C9.69748 1.6001 11.3253 2.27438 12.5256 3.47461C13.7258 4.67485 14.4001 6.30271 14.4001 8.0001ZM8.0001 5.6001C7.85954 5.59996 7.72142 5.63686 7.59966 5.70708C7.47789 5.7773 7.37678 5.87837 7.3065 6.0001C7.25575 6.0944 7.18659 6.17755 7.10311 6.24463C7.01963 6.3117 6.92353 6.36133 6.82051 6.39058C6.71749 6.41982 6.60965 6.42809 6.50338 6.41489C6.39711 6.40168 6.29457 6.36727 6.20184 6.31371C6.10912 6.26014 6.02809 6.1885 5.96356 6.10303C5.89904 6.01757 5.85233 5.92002 5.8262 5.81616C5.80007 5.71231 5.79506 5.60427 5.81147 5.49845C5.82787 5.39262 5.86536 5.29117 5.9217 5.2001C6.18587 4.74259 6.59362 4.38503 7.08172 4.18287C7.56981 3.98071 8.11097 3.94525 8.62127 4.08198C9.13157 4.21872 9.5825 4.52001 9.90412 4.93914C10.2257 5.35826 10.4001 5.87179 10.4001 6.4001C10.4002 6.89659 10.2465 7.38092 9.95991 7.78638C9.67336 8.19184 9.26816 8.49849 8.8001 8.6641V8.8001C8.8001 9.01227 8.71581 9.21575 8.56578 9.36578C8.41575 9.51581 8.21227 9.6001 8.0001 9.6001C7.78792 9.6001 7.58444 9.51581 7.43441 9.36578C7.28438 9.21575 7.2001 9.01227 7.2001 8.8001V8.0001C7.2001 7.78792 7.28438 7.58444 7.43441 7.43441C7.58444 7.28438 7.78792 7.2001 8.0001 7.2001C8.21227 7.2001 8.41575 7.11581 8.56578 6.96578C8.71581 6.81575 8.8001 6.61227 8.8001 6.4001C8.8001 6.18792 8.71581 5.98444 8.56578 5.83441C8.41575 5.68438 8.21227 5.6001 8.0001 5.6001ZM8.0001 12.0001C8.21227 12.0001 8.41575 11.9158 8.56578 11.7658C8.71581 11.6158 8.8001 11.4123 8.8001 11.2001C8.8001 10.9879 8.71581 10.7844 8.56578 10.6344C8.41575 10.4844 8.21227 10.4001 8.0001 10.4001C7.78792 10.4001 7.58444 10.4844 7.43441 10.6344C7.28438 10.7844 7.2001 10.9879 7.2001 11.2001C7.2001 11.4123 7.28438 11.6158 7.43441 11.7658C7.58444 11.9158 7.78792 12.0001 8.0001 12.0001Z"
              fill="#F1F5F9"
            />
            <path
              className="hidden group-hover:block"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.4001 8.0001C14.4001 9.69748 13.7258 11.3253 12.5256 12.5256C11.3253 13.7258 9.69748 14.4001 8.0001 14.4001C6.30271 14.4001 4.67485 13.7258 3.47461 12.5256C2.27438 11.3253 1.6001 9.69748 1.6001 8.0001C1.6001 6.30271 2.27438 4.67485 3.47461 3.47461C4.67485 2.27438 6.30271 1.6001 8.0001 1.6001C9.69748 1.6001 11.3253 2.27438 12.5256 3.47461C13.7258 4.67485 14.4001 6.30271 14.4001 8.0001ZM8.0001 5.6001C7.85954 5.59996 7.72142 5.63686 7.59966 5.70708C7.47789 5.7773 7.37678 5.87837 7.3065 6.0001C7.25575 6.0944 7.18659 6.17755 7.10311 6.24463C7.01963 6.3117 6.92353 6.36133 6.82051 6.39058C6.71749 6.41982 6.60965 6.42809 6.50338 6.41489C6.39711 6.40168 6.29457 6.36727 6.20184 6.31371C6.10912 6.26014 6.02809 6.1885 5.96356 6.10303C5.89904 6.01757 5.85233 5.92002 5.8262 5.81616C5.80007 5.71231 5.79506 5.60427 5.81147 5.49845C5.82787 5.39262 5.86536 5.29117 5.9217 5.2001C6.18587 4.74259 6.59362 4.38503 7.08172 4.18287C7.56981 3.98071 8.11097 3.94525 8.62127 4.08198C9.13157 4.21872 9.5825 4.52001 9.90412 4.93914C10.2257 5.35826 10.4001 5.87179 10.4001 6.4001C10.4002 6.89659 10.2465 7.38092 9.95991 7.78638C9.67336 8.19184 9.26816 8.49849 8.8001 8.6641V8.8001C8.8001 9.01227 8.71581 9.21575 8.56578 9.36578C8.41575 9.51581 8.21227 9.6001 8.0001 9.6001C7.78792 9.6001 7.58444 9.51581 7.43441 9.36578C7.28438 9.21575 7.2001 9.01227 7.2001 8.8001V8.0001C7.2001 7.78792 7.28438 7.58444 7.43441 7.43441C7.58444 7.28438 7.78792 7.2001 8.0001 7.2001C8.21227 7.2001 8.41575 7.11581 8.56578 6.96578C8.71581 6.81575 8.8001 6.61227 8.8001 6.4001C8.8001 6.18792 8.71581 5.98444 8.56578 5.83441C8.41575 5.68438 8.21227 5.6001 8.0001 5.6001ZM8.0001 12.0001C8.21227 12.0001 8.41575 11.9158 8.56578 11.7658C8.71581 11.6158 8.8001 11.4123 8.8001 11.2001C8.8001 10.9879 8.71581 10.7844 8.56578 10.6344C8.41575 10.4844 8.21227 10.4001 8.0001 10.4001C7.78792 10.4001 7.58444 10.4844 7.43441 10.6344C7.28438 10.7844 7.2001 10.9879 7.2001 11.2001C7.2001 11.4123 7.28438 11.6158 7.43441 11.7658C7.58444 11.9158 7.78792 12.0001 8.0001 12.0001Z"
              fill="#3B82F6"
            />
          </svg>
          {isOpen ? (
            <svg
              className="cursor-pointer group"
              onClick={() => setOpen(false)}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="group-hover:hidden"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.1968 4.7435C12.4564 4.48392 12.4564 4.06307 12.1968 3.8035C11.9373 3.54392 11.5164 3.54392 11.2568 3.8035L8.00016 7.06016L4.7435 3.8035C4.48392 3.54392 4.06307 3.54392 3.8035 3.8035C3.54392 4.06307 3.54392 4.48392 3.8035 4.7435L7.06016 8.00016L3.8035 11.2568C3.54392 11.5164 3.54392 11.9373 3.8035 12.1968C4.06307 12.4564 4.48392 12.4564 4.7435 12.1968L8.00016 8.94016L11.2568 12.1968C11.5164 12.4564 11.9373 12.4564 12.1968 12.1968C12.4564 11.9373 12.4564 11.5164 12.1968 11.2568L8.94016 8.00016L12.1968 4.7435Z"
                fill="#F1F5F9"
              />
              <path
                className="hidden group-hover:block"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.1968 4.7435C12.4564 4.48392 12.4564 4.06307 12.1968 3.8035C11.9373 3.54392 11.5164 3.54392 11.2568 3.8035L8.00016 7.06016L4.7435 3.8035C4.48392 3.54392 4.06307 3.54392 3.8035 3.8035C3.54392 4.06307 3.54392 4.48392 3.8035 4.7435L7.06016 8.00016L3.8035 11.2568C3.54392 11.5164 3.54392 11.9373 3.8035 12.1968C4.06307 12.4564 4.48392 12.4564 4.7435 12.1968L8.00016 8.94016L11.2568 12.1968C11.5164 12.4564 11.9373 12.4564 12.1968 12.1968C12.4564 11.9373 12.4564 11.5164 12.1968 11.2568L8.94016 8.00016L12.1968 4.7435Z"
                fill="#3B82F6"
              />
            </svg>
          ) : (
            <svg
              className="cursor-pointer group"
              onClick={() => setOpen(true)}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="group-hover:hidden"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.333 9.05971C11.5927 9.31943 11.5927 9.74051 11.333 10.0002C11.0735 10.2597 10.6528 10.26 10.393 10.0007L7.80322 7.41664L5.21348 10.0007C4.95368 10.26 4.53299 10.2597 4.27348 10.0002C4.01376 9.74051 4.01376 9.31943 4.27348 9.05971L7.80322 5.52997L11.333 9.05971Z"
                fill="#F1F5F9"
              />
              <path
                className="hidden group-hover:block"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.333 9.05971C11.5927 9.31943 11.5927 9.74051 11.333 10.0002C11.0735 10.2597 10.6528 10.26 10.393 10.0007L7.80322 7.41664L5.21348 10.0007C4.95368 10.26 4.53299 10.2597 4.27348 10.0002C4.01376 9.74051 4.01376 9.31943 4.27348 9.05971L7.80322 5.52997L11.333 9.05971Z"
                fill="#3B82F6"
              />
            </svg>
          )}
        </div>
      </div>
      <div className={`overflow-x-scroll lg:overflow-hidden ${isOpen ? 'h-64' : 'h-0'}`}>
        <div className="px-1.5 py-2 flex h-full">
          {/* <div className="flex flex-col flex-1 h-full px-5 py-3 mx-1 bg-white rounded-md">
            <div className="font-sans text-xs font-bold md:text-sm text-cF0EFEE">CHAT</div>
            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col justify-end h-full">
                <div className="flex items-center justify-end mt-3">
                  <div className="p-1 text-xs text-white rounded-md rounded-br-none bg-blue ml-14">Messages...</div>
                  <div className="w-6 ml-2 rounded-full bg-red">U1</div>
                </div>
                <div className="flex items-center justify-start mt-3">
                  <div className="w-6 mr-2 rounded-full bg-red">U2</div>
                  <div className="p-1 font-sans text-xs rounded-md rounded-bl-none text-cF0EFEE bg-blue-gray-200 mr-14">
                    Messages...
                  </div>
                </div>
                <div className="flex items-center justify-start mt-3">
                  <div className="w-6 mr-2 rounded-full bg-red">U2</div>
                  <div className="p-1 font-sans text-xs rounded-md rounded-bl-none text-cF0EFEE bg-blue-gray-200 mr-14">
                    A longer message that wraps to a new line
                  </div>
                </div>
              </div>
              <div className="flex flex-shrink-0 w-full mt-2 h-9">
                <input className="w-full h-full px-1 border rounded-md border-blue-gray-200" placeholder="Message" />
                <button className="h-full px-2 ml-1 text-xs font-semibold text-white bg-green-500 rounded-md">
                  SEND
                </button>
              </div>
            </div>
          </div> */}
          <div className="flex-none flex-1 overflow-x-scroll min-w-[75%] sm:min-w-[45%] lg:min-w-[32.8%] h-full px-5 py-3 mx-1 border rounded-md bg-c202C3A border-cF0EFEE">
            <div className="font-sans text-xs font-bold md:text-sm text-cF0EFEE">TOP WINNERS 24h</div>
            <div className="mt-4">
              <table className="w-full font-sans text-xs leading-5 text-center text-cF0EFEE">
                <thead>
                  <tr>
                    <th>USER</th>
                    <th>BET</th>
                    <th>PROFIT</th>
                  </tr>
                  <tr>
                    <th className="h-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {winList.map((item, index) => (
                    <tr key={index}>
                      <td className="font-medium underline cursor-pointer">{item.user}</td>
                      <td>{item.total_bet.toFixed(2)} MATIC</td>
                      <td className={item.total_profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {item.total_profit.toFixed(2)} MATIC
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex-none flex-1 overflow-x-scroll min-w-[75%] sm:min-w-[45%] lg:min-w-[32.8%] h-full px-5 py-3 mx-1 border rounded-md bg-c202C3A border-cF0EFEE">
            <div className="font-sans text-xs font-bold md:text-sm text-cF0EFEE">LARGEST LOSSES 24h</div>
            <div className="mt-4">
              <table className="w-full font-sans text-xs leading-5 text-center text-cF0EFEE">
                <thead>
                  <tr>
                    <th>USER</th>
                    <th>BET</th>
                    <th>LOSS</th>
                  </tr>
                  <tr>
                    <th className="h-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {lossList.map((item, index) => (
                    <tr key={index}>
                      <td className="font-medium underline cursor-pointer">{item.user}</td>
                      <td>{item.total_bet.toFixed(2)} MATIC</td>
                      <td className={item.total_profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {item.total_profit.toFixed(2)} MATIC
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex-none flex-1 overflow-x-scroll min-w-[75%] sm:min-w-[45%] lg:min-w-[32.8%] h-full px-5 py-3 mx-1 border rounded-md bg-c202C3A border-cF0EFEE">
            <div className="font-sans text-xs font-bold md:text-sm text-cF0EFEE">GLOBAL STATISTICS</div>
            <div className="mt-4">
              <table className="w-full font-sans text-xs leading-5 text-center text-cF0EFEE">
                <thead>
                  <tr>
                    <th></th>
                    <th>HEADS</th>
                    <th>TAILS</th>
                  </tr>
                  <tr>
                    <th className="h-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {globalList.map((item, index) => {
                    const type = Object.keys(item)[0]
                    const data = item[type][0]
                    const totalBets = parseFloat(data.totalheads) + parseFloat(data.totaltails)
                    const headPercent = totalBets === 0 ? 0 : (parseFloat(data.totalheads) * 100) / totalBets
                    const tailPercent = totalBets === 0 ? 0 : 100 - headPercent
                    return (
                      <tr key={index}>
                        <td className="font-medium">{type}</td>
                        <td>{headPercent.toFixed(2)}%</td>
                        <td>{tailPercent.toFixed(2)}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
