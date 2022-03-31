import { Popover } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import Menu from './menu'
import Side from './side'
import Web3Status from '../Web3Status'
import useTokenBalance from '../../hooks/useTokenBalance'
import BOLD_TOKEN_ABI from '../../constants/abis/BoldToken.json'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { BOLDTOKEN_ADDRESS } from '../../constants'
import { useETHBalances } from '../../state/wallet/hooks'

function AppBar(): JSX.Element {
  const { account, chainId, library } = useActiveWeb3React()
  const [isOpen, setOpen] = useState(false)
  const [showTokenBalance, setShowTokenBalance] = useState(true)

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const userBoldTokenBalance = useTokenBalance(BOLDTOKEN_ADDRESS, BOLD_TOKEN_ABI)
  const [showMenu, setShowMenu] = useState(false)
  const [showSide, setShowSide] = useState(false)
  const [sideIndex, setSideIndex] = useState(0)
  const [notifyCount, setNotifyCount] = useState(0)

  useEffect(() => {
    let data = localStorage.getItem('notifications')
    if (data) setNotifyCount(JSON.parse(data).length)
  }, [localStorage.getItem('notifications')])

  const handleAddBoldToken = () => {
    // setShowTokenBalance(true)
    if (library && library.provider.isMetaMask && library.provider.request) {
      library.provider
        .request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: BOLDTOKEN_ADDRESS,
              symbol: 'BOLD',
              decimals: 18,
            },
          } as any,
        })
        .then((success) => {
          // setShowTokenBalance(success)
        })
        .catch((e) => {
          console.log(e)
          // setShowTokenBalance(false)
        })
    } else {
      // setShowTokenBalance(false)
    }
  }

  const handleSideMenu = (index: number) => {
    setSideIndex(index)
    setShowSide(true)
  }
  const closeMenu = () => setShowMenu(false)
  const closeSide = () => setShowSide(false)

  return (
    <>
      {showMenu && <Menu onClose={closeMenu} />}
      {showSide && <Side onClose={closeSide} selectedIndex={sideIndex} />}

      <header className="flex-shrink-0 w-full">
        <Popover as="nav" className="w-full bg-transparent border-b border-c3E536B">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex">
                <div
                  className="cursor-pointer flex items-center px-2.5 py-2.5 border-r border-c3E536B"
                  onClick={() => setShowMenu(true)}
                >
                  <svg width="26" height="20" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1.66699 18.5H24.3337M1.66699 1.5H24.3337H1.66699ZM1.66699 10H24.3337H1.66699Z"
                      stroke="#F0EFEE"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <Link href="/">
                  <div className="flex items-center pl-3 pr-3 py-2.5 border-r border-c3E536B cursor-pointer min-w-[65px] md:min-w-[80px]">
                    <Image src="/logo.png" alt="One Fortune" width="55px" height="55px" />
                  </div>
                </Link>
                <div
                  className="flex items-center px-8 border-r md:px-16 border-c3E536B"
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}
                  onClick={() => (!isOpen ? setOpen(true) : setOpen(false))}
                >
                  <p className="self-center mr-3 text-lg font-bold md:text-2xl text-cF0EFEE">GAMES</p>
                  {/* prettier-ignore */}
                  <svg width="21" height="12" viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.375 2.125L10.5 10L2.625 2.125" stroke="#F0EFEE" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                  <div
                    className={
                      'shadow-mega-nav flex flex-col bg-c202C3A md:flex-row -ml-16 md:flex-wrap w-full left-[4rem] md:w-2/3 md:left-auto max-w-[920px] absolute top-[77px] z-50 border transition-all duration-300  ' +
                      (isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')
                    }
                  >
                    <div
                      className={
                        'bg-cE3122D text-cF0EFEE w-full md:w-1/2 font-sansBold border-r border-b px-4 py-2 uppercase text-24px'
                      }
                    >
                      CHALLENGE <span className={'font-FixtureSB'}>{'// NO-LOSE GAMES'}</span>
                    </div>

                    <a
                      href={'/coin-flip'}
                      className={
                        'text-cF0EFEE hover:bg-c111822 w-full md:w-1/2 font-sans border-r border-b  px-2 py-6  md:order-[3]'
                      }
                    >
                      <div className={'flex'}>
                        <div className={'w-3/12 flex justify-center'}>
                          {/* prettier-ignore */}
                          <svg width="62" height="61" viewBox="0 0 62 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.684 46.3342C25.2989 54.1118 38.0921 54.5369 46.2584 47.2838C54.4247 40.0306 54.8717 27.8459 47.2568 20.0683C39.642 12.2908 26.8488 11.8657 18.6825 19.1188C10.5161 26.3719 10.0691 38.5567 17.684 46.3342Z" fill="#131E2B"/>
                          <path d="M18.4469 45.6375C25.669 53.0085 37.8019 53.4118 45.5466 46.5381C53.2913 39.6645 53.715 28.1169 46.493 20.7459C39.2709 13.3748 27.138 12.9716 19.3933 19.8452C11.6485 26.7188 11.2249 38.2664 18.4469 45.6375Z" stroke="#EAEAEA" strokeWidth="2"/>
                          <path d="M14.5847 40.4063C11.0917 36.8413 9.26648 32.195 9.44523 27.3234C9.62396 22.4518 11.7853 17.938 15.531 14.6135C19.2768 11.2891 24.1586 9.5519 29.2772 9.72202C34.3958 9.89215 39.1384 11.9492 42.6313 15.5143C46.1243 19.0793 47.9496 23.7256 47.7708 28.5972C47.5921 33.4688 45.4308 37.9826 41.685 41.3071C37.9392 44.6315 33.0574 46.3687 27.9389 46.1986C22.8203 46.0285 18.0777 43.9714 14.5847 40.4063Z" fill="#131E2B"/>
                          <path d="M41.8587 16.2012C38.5584 12.8304 34.0773 10.8855 29.241 10.7248C24.4046 10.5641 19.792 12.2068 16.2527 15.3503C12.7134 18.4938 10.6711 22.7619 10.5021 27.3682C10.3331 31.9745 12.0577 36.3678 15.358 39.7386C18.6583 43.1094 23.1394 45.0543 27.9757 45.215C32.8121 45.3758 37.4247 43.7331 40.964 40.5895C44.5033 37.446 46.5456 33.178 46.7145 28.5716C46.8835 23.9653 45.159 19.5721 41.8587 16.2012ZM43.395 14.8367C51.0101 22.6144 50.5631 34.7994 42.3966 42.0527C34.2302 49.306 21.4367 48.8808 13.8217 41.1031C6.2066 33.3254 6.6536 21.1404 14.8201 13.8871C22.9865 6.63385 35.78 7.059 43.395 14.8367Z" fill="#EAEAEA"/>
                          <path d="M46.1131 8.37109C49.5218 10.4098 52.2237 13.3588 53.8824 16.8501" stroke="#EAEAEA" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M8.85765 48.9888C5.4495 46.9502 2.74752 44.0015 1.08884 40.5108" stroke="#EAEAEA" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M34.995 22.4679C34.8206 22.1034 34.5723 21.7754 34.2644 21.5025C33.9564 21.2297 33.5948 21.0174 33.2004 20.8779C32.5577 20.6235 31.8783 20.4631 31.1852 20.4019V18.6509L29.6817 18.6699V20.3129C29.481 20.3129 29.2751 20.3129 29.0628 20.3129C28.8506 20.3129 28.6425 20.3209 28.444 20.3299V18.6789L26.9404 18.7049V20.4629C26.2793 20.5457 25.6342 20.7188 25.025 20.9769C24.2245 21.285 23.5693 21.8602 23.1821 22.5949C22.8529 23.3747 22.6966 24.2109 22.723 25.0509V30.1149C22.6952 30.9583 22.8515 31.798 23.1821 32.5809C23.5692 33.3161 24.2243 33.8919 25.025 34.2009C25.6341 34.4597 26.2792 34.6334 26.9404 34.7169V36.0669L28.444 36.0929V34.8509C28.6443 34.8595 28.8506 34.8652 29.0628 34.8679C29.273 34.8679 29.4831 34.8679 29.6817 34.8679V36.1009L31.1852 36.1189V34.7789C31.8783 34.7181 32.5577 34.5579 33.2004 34.3039C33.5947 34.1645 33.9562 33.9524 34.2642 33.6797C34.5722 33.407 34.8205 33.0791 34.995 32.7149C35.2937 31.9002 35.4322 31.0403 35.4037 30.1779V25.0049C35.4323 24.1425 35.2937 23.2825 34.995 22.4679V22.4679ZM29.6817 30.9329C29.6817 31.3769 29.4754 31.5979 29.0628 31.5959C28.6503 31.5939 28.444 31.3709 28.444 30.9269V24.4379C28.444 23.8712 28.6503 23.5869 29.0628 23.5849C29.4747 23.5849 29.6827 23.8669 29.6817 24.4339V30.9329Z" fill="#EAEAEA"/>
                        </svg>
                        </div>
                        <div className={'flex flex-col justify-center ml-3 w-9/12 font-sansBold uppercase text-18px'}>
                          COIN FLIP{' '}
                          <span className={'block font-sans normal-case text-14px'}>
                            Provably fair games using Chainlink VRF
                          </span>
                        </div>
                      </div>
                    </a>

                    <a
                      href={'/predict-the-market'}
                      className={
                        'text-cF0EFEE hover:bg-c111822 w-full md:w-1/2 font-sans border-r  px-2 py-6  md:order-[5]'
                      }
                    >
                      <div className={'flex'}>
                        <div className={'w-3/12 flex justify-center'}>
                          {/* prettier-ignore */}
                          <svg width="41" height="66" viewBox="0 0 41 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.78728 53.4003H15.4872C15.922 53.4003 16.2745 53.0658 16.2745 52.6533L16.2745 27.5673C16.2745 27.1547 15.922 26.8203 15.4872 26.8203H2.78728C2.35248 26.8203 2 27.1547 2 27.5673L2 52.6533C2 53.0658 2.35248 53.4003 2.78728 53.4003Z" stroke="#EAEAEA" strokeWidth="3"/>
                          <path d="M9.58652 54.7421V63.0878" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M9.58652 18.475V26.8207" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M25.9736 53.7124H38.6735C39.1083 53.7124 39.4608 53.378 39.4608 52.9654L39.4608 11.0924C39.4608 10.6798 39.1083 10.3454 38.6735 10.3454H25.9736C25.5388 10.3454 25.1863 10.6798 25.1863 11.0924L25.1863 52.9654C25.1863 53.378 25.5388 53.7124 25.9736 53.7124Z" fill="#EAEAEA" stroke="#EAEAEA" strokeWidth="3"/>
                          <path d="M32.7729 55.7422V64.0879" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M32.7729 2V10.3457" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M2.78728 53.4003H15.4872C15.922 53.4003 16.2745 53.0658 16.2745 52.6533L16.2745 27.5673C16.2745 27.1547 15.922 26.8203 15.4872 26.8203H2.78728C2.35248 26.8203 2 27.1547 2 27.5673L2 52.6533C2 53.0658 2.35248 53.4003 2.78728 53.4003Z" fill="#131E2B" stroke="#EAEAEA" strokeWidth="3"/>
                          <path d="M9.58652 54.7421V63.0878" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M9.58652 18.475V26.8207" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M25.9736 53.7124H38.6735C39.1083 53.7124 39.4608 53.378 39.4608 52.9654L39.4608 11.0924C39.4608 10.6798 39.1083 10.3454 38.6735 10.3454H25.9736C25.5388 10.3454 25.1863 10.6798 25.1863 11.0924L25.1863 52.9654C25.1863 53.378 25.5388 53.7124 25.9736 53.7124Z" fill="#EAEAEA" stroke="#EAEAEA" strokeWidth="3"/>
                          <path d="M32.7729 55.7422V64.0879" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M32.7729 2V10.3457" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                        </div>
                        <div className={'flex flex-col justify-center ml-3 w-9/12 font-sansBold uppercase text-18px'}>
                          PREDICT THE MARKET
                          <span className={'block font-sans normal-case text-14px'}>
                            Predict the price of BTC to win big
                          </span>
                        </div>
                      </div>
                    </a>

                    <div
                      className={
                        'bg-cE3122D text-cF0EFEE w-full md:w-1/2 font-sansBold  border-b  px-4 py-2 md:order-[2] uppercase text-24px'
                      }
                    >
                      House <span className={'font-FixtureSB'}>{'// PLAY WITH BOLD'}</span>
                    </div>
                    <a
                      href={'/coin-flip-house'}
                      className={
                        'text-cF0EFEE hover:bg-c111822 w-full md:w-1/2 font-sans border-b  px-2 py-6 md:order-[4]'
                      }
                    >
                      <div className={'flex'}>
                        <div className={'w-3/12 flex justify-center'}>
                          {/* prettier-ignore */}
                          <svg width="62" height="61" viewBox="0 0 62 61" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.684 46.3342C25.2989 54.1118 38.0921 54.5369 46.2584 47.2838C54.4247 40.0306 54.8717 27.8459 47.2568 20.0683C39.642 12.2908 26.8488 11.8657 18.6825 19.1188C10.5161 26.3719 10.0691 38.5567 17.684 46.3342Z" fill="#131E2B"/>
                          <path d="M18.4469 45.6375C25.669 53.0085 37.8019 53.4118 45.5466 46.5381C53.2913 39.6645 53.715 28.1169 46.493 20.7459C39.2709 13.3748 27.138 12.9716 19.3933 19.8452C11.6485 26.7188 11.2249 38.2664 18.4469 45.6375Z" stroke="#EAEAEA" strokeWidth="2"/>
                          <path d="M14.5847 40.4063C11.0917 36.8413 9.26648 32.195 9.44523 27.3234C9.62396 22.4518 11.7853 17.938 15.531 14.6135C19.2768 11.2891 24.1586 9.5519 29.2772 9.72202C34.3958 9.89215 39.1384 11.9492 42.6313 15.5143C46.1243 19.0793 47.9496 23.7256 47.7708 28.5972C47.5921 33.4688 45.4308 37.9826 41.685 41.3071C37.9392 44.6315 33.0574 46.3687 27.9389 46.1986C22.8203 46.0285 18.0777 43.9714 14.5847 40.4063Z" fill="#131E2B"/>
                          <path d="M41.8587 16.2012C38.5584 12.8304 34.0773 10.8855 29.241 10.7248C24.4046 10.5641 19.792 12.2068 16.2527 15.3503C12.7134 18.4938 10.6711 22.7619 10.5021 27.3682C10.3331 31.9745 12.0577 36.3678 15.358 39.7386C18.6583 43.1094 23.1394 45.0543 27.9757 45.215C32.8121 45.3758 37.4247 43.7331 40.964 40.5895C44.5033 37.446 46.5456 33.178 46.7145 28.5716C46.8835 23.9653 45.159 19.5721 41.8587 16.2012ZM43.395 14.8367C51.0101 22.6144 50.5631 34.7994 42.3966 42.0527C34.2302 49.306 21.4367 48.8808 13.8217 41.1031C6.2066 33.3254 6.6536 21.1404 14.8201 13.8871C22.9865 6.63385 35.78 7.059 43.395 14.8367Z" fill="#EAEAEA"/>
                          <path d="M46.1131 8.37109C49.5218 10.4098 52.2237 13.3588 53.8824 16.8501" stroke="#EAEAEA" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M8.85765 48.9888C5.4495 46.9502 2.74752 44.0015 1.08884 40.5108" stroke="#EAEAEA" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M34.995 22.4679C34.8206 22.1034 34.5723 21.7754 34.2644 21.5025C33.9564 21.2297 33.5948 21.0174 33.2004 20.8779C32.5577 20.6235 31.8783 20.4631 31.1852 20.4019V18.6509L29.6817 18.6699V20.3129C29.481 20.3129 29.2751 20.3129 29.0628 20.3129C28.8506 20.3129 28.6425 20.3209 28.444 20.3299V18.6789L26.9404 18.7049V20.4629C26.2793 20.5457 25.6342 20.7188 25.025 20.9769C24.2245 21.285 23.5693 21.8602 23.1821 22.5949C22.8529 23.3747 22.6966 24.2109 22.723 25.0509V30.1149C22.6952 30.9583 22.8515 31.798 23.1821 32.5809C23.5692 33.3161 24.2243 33.8919 25.025 34.2009C25.6341 34.4597 26.2792 34.6334 26.9404 34.7169V36.0669L28.444 36.0929V34.8509C28.6443 34.8595 28.8506 34.8652 29.0628 34.8679C29.273 34.8679 29.4831 34.8679 29.6817 34.8679V36.1009L31.1852 36.1189V34.7789C31.8783 34.7181 32.5577 34.5579 33.2004 34.3039C33.5947 34.1645 33.9562 33.9524 34.2642 33.6797C34.5722 33.407 34.8205 33.0791 34.995 32.7149C35.2937 31.9002 35.4322 31.0403 35.4037 30.1779V25.0049C35.4323 24.1425 35.2937 23.2825 34.995 22.4679V22.4679ZM29.6817 30.9329C29.6817 31.3769 29.4754 31.5979 29.0628 31.5959C28.6503 31.5939 28.444 31.3709 28.444 30.9269V24.4379C28.444 23.8712 28.6503 23.5869 29.0628 23.5849C29.4747 23.5849 29.6827 23.8669 29.6817 24.4339V30.9329Z" fill="#EAEAEA"/>
                        </svg>
                        </div>
                        <div className={'flex flex-col justify-center ml-3 w-9/12 font-sansBold uppercase text-18px'}>
                          COIN FLIP HOUSE
                          <span className={'block font-sans normal-case text-14px'}>
                            Rapid coin flip games against the house
                          </span>
                        </div>
                      </div>
                    </a>
                    <a
                      href={'/predict-the-market-house'}
                      className={'text-cF0EFEE hover:bg-c111822 w-full md:w-1/2 font-sans  px-2 py-6  md:order-[6]'}
                    >
                      <div className={'flex'}>
                        <div className={'w-3/12 flex justify-center'}>
                          {/* prettier-ignore */}
                          <svg width="41" height="66" viewBox="0 0 41 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.78728 53.4003H15.4872C15.922 53.4003 16.2745 53.0658 16.2745 52.6533L16.2745 27.5673C16.2745 27.1547 15.922 26.8203 15.4872 26.8203H2.78728C2.35248 26.8203 2 27.1547 2 27.5673L2 52.6533C2 53.0658 2.35248 53.4003 2.78728 53.4003Z" stroke="#EAEAEA" strokeWidth="3"/>
                          <path d="M9.58652 54.7421V63.0878" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M9.58652 18.475V26.8207" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M25.9736 53.7124H38.6735C39.1083 53.7124 39.4608 53.378 39.4608 52.9654L39.4608 11.0924C39.4608 10.6798 39.1083 10.3454 38.6735 10.3454H25.9736C25.5388 10.3454 25.1863 10.6798 25.1863 11.0924L25.1863 52.9654C25.1863 53.378 25.5388 53.7124 25.9736 53.7124Z" fill="#EAEAEA" stroke="#EAEAEA" strokeWidth="3"/>
                          <path d="M32.7729 55.7422V64.0879" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M32.7729 2V10.3457" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M2.78728 53.4003H15.4872C15.922 53.4003 16.2745 53.0658 16.2745 52.6533L16.2745 27.5673C16.2745 27.1547 15.922 26.8203 15.4872 26.8203H2.78728C2.35248 26.8203 2 27.1547 2 27.5673L2 52.6533C2 53.0658 2.35248 53.4003 2.78728 53.4003Z" fill="#131E2B" stroke="#EAEAEA" strokeWidth="3"/>
                          <path d="M9.58652 54.7421V63.0878" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M9.58652 18.475V26.8207" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M25.9736 53.7124H38.6735C39.1083 53.7124 39.4608 53.378 39.4608 52.9654L39.4608 11.0924C39.4608 10.6798 39.1083 10.3454 38.6735 10.3454H25.9736C25.5388 10.3454 25.1863 10.6798 25.1863 11.0924L25.1863 52.9654C25.1863 53.378 25.5388 53.7124 25.9736 53.7124Z" fill="#EAEAEA" stroke="#EAEAEA" strokeWidth="3"/>
                          <path d="M32.7729 55.7422V64.0879" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                          <path d="M32.7729 2V10.3457" stroke="#EAEAEA" strokeWidth="3" strokeLinecap="round"/>
                        </svg>
                        </div>
                        <div className={'flex flex-col justify-center ml-3 w-9/12 font-sansBold uppercase text-18px'}>
                          PREDICT THE MARKET HOUSE
                          <span className={'block font-sans normal-case text-14px'}>
                            Put your crypto prediction skills to the test
                          </span>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {account && chainId && userEthBalance ? (
                <div className="flex">
                  <div className="flex items-center justify-center px-4 border-r sm:border-l h-19 border-c3E536B">
                    {!showTokenBalance && (
                      <div className="cursor-pointer md:mr-3" onClick={() => handleAddBoldToken()}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g clipPath="url(#clip0_1035_44078)">
                            <path
                              d="M31.1894 39.9998H5.81498C2.64317 39.9998 0 37.3332 0 34.1332V8.53317C0 5.33317 2.64317 2.6665 5.81498 2.6665H31.1894C34.3612 2.6665 37.0044 5.33317 37.0044 8.53317V34.1332C37.0044 37.3332 34.3612 39.9998 31.1894 39.9998Z"
                              fill="url(#paint0_linear_1035_44078)"
                            />
                            <g clipPath="url(#clip1_1035_44078)">
                              <path
                                d="M25.0242 16.0295C24.7232 15.2548 24.0612 14.6319 23.0395 14.1671C22.4598 13.9036 21.7154 13.7167 20.8109 13.6097V11.5557C20.2566 11.5621 19.7022 11.5684 19.1478 11.578V13.5043C18.9261 13.5011 18.698 13.4995 18.4636 13.5027C18.2291 13.5059 18.0011 13.5123 17.7793 13.5218V11.5892C17.2249 11.5988 16.6706 11.6084 16.1162 11.6196V13.68C15.2688 13.8109 14.5608 14.0122 13.9985 14.2821C12.9769 14.7725 12.2974 15.405 11.96 16.178C11.621 16.9511 11.4531 17.911 11.4531 19.061V24.9963C11.4531 26.1463 11.6226 27.1062 11.96 27.8809C12.2974 28.6555 12.9769 29.288 13.9985 29.7784C14.5624 30.0499 15.2688 30.2512 16.1162 30.3837V31.965C16.6706 31.9762 17.2249 31.9857 17.7793 31.9953V30.5418C18.0011 30.5514 18.2291 30.5594 18.4636 30.5626C18.6996 30.5658 18.9261 30.5658 19.1478 30.561V32.0065C19.7022 32.0145 20.2566 32.0225 20.8109 32.0289V30.4588C21.7169 30.3518 22.4598 30.1665 23.0395 29.9014C24.0612 29.4366 24.7216 28.8152 25.0242 28.039C25.3251 27.2643 25.4772 26.2725 25.4772 25.0666V19.0019C25.4772 17.7944 25.3267 16.8041 25.0242 16.0295ZM19.1478 25.9482C19.1478 26.4689 18.9197 26.7277 18.4636 26.7261C18.0074 26.7229 17.7793 26.4625 17.7793 25.9418C17.7793 22.4902 17.7793 21.7891 17.7793 18.3375C17.7793 17.673 18.0074 17.3392 18.4636 17.3376C18.9197 17.3344 19.1494 17.6682 19.1478 18.3327V25.9482Z"
                                fill="#F0EFEE"
                              />
                            </g>
                            <path
                              d="M32.5105 15.074C36.6465 15.074 39.9995 11.6913 39.9995 7.51845C39.9995 3.34563 36.6465 -0.0371094 32.5105 -0.0371094C28.3744 -0.0371094 25.0215 3.34563 25.0215 7.51845C25.0215 11.6913 28.3744 15.074 32.5105 15.074Z"
                              fill="white"
                            />
                            <path d="M32.5098 4.97705V10.1326" stroke="#E3122D" strokeLinecap="round" />
                            <path d="M35.0652 7.55469H29.9551" stroke="#E3122D" strokeLinecap="round" />
                          </g>
                          <defs>
                            <linearGradient
                              id="paint0_linear_1035_44078"
                              x1="18.5022"
                              y1="2.6665"
                              x2="18.5022"
                              y2="39.9998"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#E3122D" />
                              <stop offset="1" stopColor="#870B1B" />
                            </linearGradient>
                            <clipPath id="clip0_1035_44078">
                              <rect width="40" height="40" fill="white" />
                            </clipPath>
                            <clipPath id="clip1_1035_44078">
                              <rect
                                width="14.0969"
                                height="20.4444"
                                fill="white"
                                transform="translate(11.4531 11.5557)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    )}
                    <p className="hidden text-cF0EFEE font-sansBold md:flex">BALANCES: </p>
                    <div className="flex-col hidden ml-1 sm:flex md:ml-5">
                      <div className="flex items-center">
                        <svg
                          className="hidden md:block"
                          width="18"
                          height="18"
                          viewBox="0 0 18 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.5 0.5C13.1947 0.5 17 4.30534 17 9C17 13.6947 13.1947 17.5 8.5 17.5C3.80534 17.5 0 13.6947 0 9C0 4.30534 3.80534 0.5 8.5 0.5ZM10.2807 3.45375C10.1511 3.39 10.0215 3.45375 9.98963 3.58284C9.95722 3.61525 9.95722 3.64766 9.95722 3.71194V4.1635L9.96253 4.21875C9.99027 4.32804 10.0574 4.42322 10.1511 4.48597C12.6767 5.38909 13.9719 8.19409 13.0326 10.6766C12.5471 12.0313 11.4787 13.0625 10.1511 13.5464C10.0215 13.6107 9.95722 13.7074 9.95722 13.8689V14.3205L9.95987 14.3672C9.96493 14.4182 9.98624 14.4663 10.0207 14.5042C10.0551 14.5422 10.1008 14.5681 10.1511 14.5781C10.1835 14.5781 10.2483 14.5781 10.2807 14.5463C11.0094 14.3187 11.6858 13.9493 12.2711 13.4592C12.8564 12.9692 13.339 12.3682 13.691 11.6909C14.0431 11.0136 14.2577 10.2733 14.3225 9.5127C14.3873 8.7521 14.301 7.9862 14.0686 7.25909C13.4863 5.42097 12.0615 4.03441 10.2807 3.45428V3.45375ZM6.84888 3.42188C6.81647 3.42188 6.75166 3.42187 6.71925 3.45375C5.9906 3.6813 5.31416 4.05073 4.72888 4.54078C4.1436 5.03083 3.66103 5.63181 3.30897 6.30913C2.9569 6.98644 2.7423 7.72671 2.6775 8.4873C2.61271 9.2479 2.69901 10.0138 2.93144 10.7409C3.51369 12.5472 4.90609 13.9337 6.71925 14.5138C6.84887 14.5781 6.9785 14.5138 7.01038 14.3847C7.04278 14.3529 7.04278 14.3199 7.04278 14.2557V13.8041L7.03747 13.7616C7.01516 13.6718 6.93175 13.5693 6.84888 13.514C4.32331 12.6109 3.02813 9.80591 3.96738 7.32337C4.45294 5.96869 5.52128 4.93753 6.84888 4.45356C6.9785 4.38928 7.04278 4.29259 7.04278 4.13109V3.67953L7.04012 3.63278C7.03507 3.58177 7.01376 3.53373 6.97932 3.49575C6.94488 3.45778 6.89915 3.43188 6.84888 3.42188V3.42188ZM8.72684 5.0985H8.24075L8.194 5.10275C8.08775 5.124 8.01019 5.21538 7.9815 5.35669V6.09831L7.87153 6.11531C6.96416 6.27681 6.39572 6.90316 6.39572 7.67825C6.39572 8.74181 7.04278 9.16097 8.40278 9.32247C9.30963 9.48344 9.60075 9.67734 9.60075 10.1932C9.60075 10.7085 9.14759 11.0634 8.53241 11.0634C7.69038 11.0634 7.39925 10.709 7.30203 10.2251C7.27016 10.0965 7.17241 10.0317 7.07519 10.0317H6.52481L6.48284 10.0354C6.43046 10.0439 6.38292 10.071 6.34902 10.1119C6.31513 10.1527 6.29718 10.2044 6.2985 10.2575V10.2893L6.31603 10.385C6.47009 11.1415 6.98859 11.6828 8.01444 11.8374V12.6114L8.01869 12.6582C8.03994 12.7634 8.13184 12.8409 8.27369 12.8691H8.75925L8.806 12.8648C8.91225 12.8436 8.98981 12.7522 9.0185 12.6114V11.8369L9.12847 11.8156C10.0385 11.6233 10.6372 10.9651 10.6372 10.1278C10.6372 8.99947 9.95722 8.61272 8.59722 8.45122C7.62556 8.32212 7.43166 8.06447 7.43166 7.61291C7.43166 7.16134 7.75572 6.87128 8.40278 6.87128C8.98556 6.87128 9.30962 7.06466 9.47112 7.54862C9.48795 7.59542 9.51872 7.63594 9.55928 7.66472C9.59983 7.6935 9.64824 7.70916 9.69797 7.70959H10.2159L10.2579 7.70641C10.3105 7.69805 10.3582 7.67086 10.3922 7.6299C10.4263 7.58895 10.4442 7.53703 10.4428 7.48381V7.45194L10.4231 7.36003C10.3434 7.02981 10.1615 6.73316 9.9034 6.51226C9.64531 6.29137 9.32414 6.15748 8.98556 6.12966V5.35669L8.98131 5.30994C8.96006 5.20422 8.86816 5.12666 8.72631 5.0985H8.72684Z"
                            fill="#E3122D"
                          />
                        </svg>

                        <p className="ml-2 text-xs md:text-base text-cF0EFEE font-sansBold">
                          {userEthBalance?.toSignificant(4)} MATIC
                        </p>
                      </div>
                      {showTokenBalance && (
                        <div className="flex items-center">
                          <svg
                            className="hidden md:block"
                            width="18"
                            height="18"
                            viewBox="0 0 11 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.67698 3.74984C9.46239 3.11128 8.99028 2.5978 8.2618 2.21467C7.84843 1.99743 7.31759 1.84339 6.67269 1.75517V0.0620117C6.27739 0.0672782 5.88209 0.0725446 5.48678 0.0804443V1.66828C5.32866 1.66564 5.16603 1.66433 4.99887 1.66696C4.83172 1.66959 4.66908 1.67486 4.51096 1.68276V0.0896605C4.11565 0.0975602 3.72035 0.10546 3.32505 0.114676V1.8131C2.7208 1.92107 2.21595 2.08696 1.815 2.30947C1.08652 2.71366 0.601989 3.23504 0.36142 3.87228C0.119721 4.50952 0 5.3008 0 6.24876V11.1413C0 12.0892 0.120851 12.8805 0.36142 13.5191C0.601989 14.1576 1.08652 14.679 1.815 15.0832C2.21708 15.307 2.7208 15.4729 3.32505 15.5822V16.8857C3.72035 16.8949 4.11565 16.9028 4.51096 16.9107V15.7126C4.66908 15.7205 4.83172 15.727 4.99887 15.7297C5.16716 15.7323 5.32866 15.7323 5.48678 15.7284V16.9199C5.88209 16.9265 6.27739 16.9331 6.67269 16.9383V15.6441C7.31872 15.5559 7.84843 15.4032 8.2618 15.1846C8.99028 14.8015 9.46126 14.2893 9.67698 13.6494C9.89157 13.0109 10 12.1933 10 11.1992V6.20005C10 5.20469 9.8927 4.38839 9.67698 3.74984ZM5.48678 11.926C5.48678 12.3552 5.32415 12.5685 4.99887 12.5672C4.67359 12.5645 4.51096 12.3499 4.51096 11.9207C4.51096 9.07553 4.51096 8.49753 4.51096 5.65234C4.51096 5.10463 4.67359 4.82946 4.99887 4.82814C5.32415 4.82551 5.48791 5.10068 5.48678 5.64839V11.926Z"
                              fill="#E3122D"
                            />
                          </svg>

                          <p className="ml-2 text-xs md:text-base text-cF0EFEE font-sansBold">
                            {(parseFloat(userBoldTokenBalance?.value.toString()) / 10 ** 18).toFixed(3)} BOLD
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-center mx-4">
                    <div
                      className="items-center justify-center hidden w-10 h-10 mr-3 border rounded-full cursor-pointer lg:flex bg-c111822 border-cF0EFEE"
                      onClick={() => handleSideMenu(0)}
                    >
                      <Image src="/images/menu/chat.png" alt="chat" width={24} height={24} objectFit="contain" />
                    </div>

                    <div
                      className="relative items-center justify-center hidden w-10 h-10 mr-3 border rounded-full cursor-pointer lg:flex bg-c111822 border-cF0EFEE"
                      onClick={() => handleSideMenu(1)}
                    >
                      <Image
                        src="/images/menu/notification.png"
                        alt="notification"
                        width={24}
                        height={24}
                        objectFit="contain"
                      />
                      {notifyCount > 0 && (
                        <div className="absolute items-center justify-center w-6 h-4 text-center rounded-full bg-cE3122D font-sansBold text-12px text-cF0EFEE -bottom-1 -right-1">
                          {notifyCount}
                        </div>
                      )}
                    </div>

                    <div
                      className="flex items-center justify-center w-10 h-10 border rounded-full cursor-pointer lg:mr-3 bg-c111822 border-cF0EFEE"
                      onClick={() => handleSideMenu(2)}
                    >
                      <Image src="/images/menu/account.png" alt="account" width={40} height={40} objectFit="contain" />
                    </div>

                    <div
                      className="items-center justify-center hidden w-10 h-10 mr-3 border rounded-full cursor-pointer lg:flex bg-c111822 border-cF0EFEE"
                      onClick={() => handleSideMenu(3)}
                    >
                      <Image src="/images/menu/help.png" alt="help" width={15} height={24} objectFit="contain" />
                    </div>
                  </div>
                </div>
              ) : (
                <Web3Status />
              )}
            </div>
          </div>
        </Popover>
      </header>
    </>
  )
}

export default AppBar
