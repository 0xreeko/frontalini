import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import cx from 'classnames'
import { ToastContainer } from 'react-toastify'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import 'react-toastify/dist/ReactToastify.css'

import Prediction from '../../components/PredictionHouse'
import Footer from '../../components/FooterPredictionHouse'
import Container from '../../components/Container'
import { useRounds } from '../../hooks/usePredictionHouse'
import Modal from '../../components/ClaimModal'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

export default function PredictionHouse() {
  const rounds = useRounds()
  const [modalShow, setModalShow] = useState(true)
  const [checked, setChecked] = useState(false)
  const { account } = useActiveWeb3React()

  useEffect(() => {
    const isShow = localStorage.getItem('ClaimBoldModalShow')
    setModalShow(isShow !== '1')
  }, [])

  const handleClaimModal = () => {
    if (checked) {
      localStorage.setItem('ClaimBoldModalShow', '1')
      setModalShow(false)
    }
  }
  return (
    <>
      <Container id="toss-page" className="flex-1" maxWidth="full">
        <ToastContainer />
        <Head>
          <title>OneFortune - Predict the Market House</title>
          <meta key="description" name="description" content="Coin Flip Challenge" />
        </Head>
        <div className="flex w-full h-10 bg-cE3122D">
          <p className="self-center m-auto text-sm text-center text-white md:text-2xl font-sansBold">
            <a href="https://docs.onefortune.com/bold-token/how-do-i-get-bold" target="_blank" rel="noreferrer">
              USE BOLD FOR HOUSE GAMES - GET MORE HERE
            </a>
          </p>
        </div>
        <div className="pt-4 md:pt-10 theGamesBack">
          <div className="flex w-screen">
            <div className="flex-auto mb-4 ml-4 sm:ml-10">
              <Link href={'/'} passHref>
                <span className="text-lg underline cursor-pointer md:text-2xl text-cF0EFEE font-sansBold">GAMES</span>
              </Link>
              <span className="ml-1 font-sans text-lg md:text-2xl text-cF0EFEE">{' / '}</span>
              <span className="font-sans text-lg md:text-2xl text-cF0EFEE">Predict The Market House (BTC/USD)</span>
            </div>
            <div className="flex-auto pr-4 mb-4 ml-4 text-right sm:pr-10">
              <a
                href="https://docs.onefortune.com/predict-the-market-house/house-version"
                target="_blank"
                rel="noreferrer"
              >
                <button className="px-5 py-2 text-xs duration-300 rounded-md cursor-pointer md:text-sm bg-cE3122D hover:bg-cB30F24 text-cF0EFEE font-sansBold">
                  HOW TO PLAY
                </button>
              </a>
            </div>
          </div>
          {modalShow ? (
            <Modal onClose={() => setModalShow(false)}>
              <div className="flex items-center content-center justify-center w-full h-full mx-auto">
                <div className="w-full overflow-hidden sm:w-110 rounded-2xl bg-c18222E z-[61] -mt-24 md:mt-0">
                  <div className="flex justify-between w-full px-1 pl-4 pr-4 h-9 bg-c039300">
                    <div className="flex">
                      <Image
                        src="/images/menu/wallet.png"
                        className="cursor-pointer"
                        alt="Claim"
                        width={16}
                        height={16}
                        objectFit="contain"
                      />
                      <p className="self-center ml-1.5 text-cF0EFEE font-sansBold text-14px">HOUSE GAMES</p>
                    </div>
                    <Image
                      src="/images/menu/close.png"
                      className="cursor-pointer"
                      alt="close"
                      width={16}
                      height={16}
                      onClick={() => setModalShow(false)}
                      objectFit="contain"
                    />
                  </div>
                  <div className="flex flex-col items-center content-center justify-center px-8 py-8 mb-8">
                    <p className="mb-6 text-center text-cF0EFEE font-sansBold text-24px">HOUSE GAMES</p>
                    <p className="mb-3 font-sans text-center text-cF0EFEE text-12px">
                      Please note that transaction fees for House games are paid in MATIC and are set at 0.5 MATIC per
                      bet.
                    </p>
                    <button
                      className={cx(
                        'h-6 p-1 mb-4 text-center rounded text-cF0EFEE font-sansBold text-10px w-28 ',
                        checked ? 'cursor-pointer bg-c039300 ' : 'cursor-not-allowed bg-gray-500'
                      )}
                      onClick={() => handleClaimModal()}
                    >
                      OK
                    </button>
                    <div className="flex">
                      <input
                        type="checkbox"
                        className="self-center"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                      />
                      <p className="self-center ml-2 font-sansBold text-cF0EFEE text-12px">
                        I understand, don’t show me this again
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          ) : (
            <div className="flex justify-between min-h-[80%] mb-2">
              {account ? (
                <Swiper slidesPerView={'auto'} spaceBetween={30} centeredSlides={true} initialSlide={6}>
                  {rounds.map((item, index) => (
                    <SwiperSlide key={index}>
                      <Prediction item={item} swiperIndex={index} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <Swiper slidesPerView="auto" spaceBetween={30} centeredSlides={true} initialSlide={6}>
                  {[...Array(5)].map((x, i) => (
                    <SwiperSlide key={i}>
                      <Prediction
                        item={{
                          BearAmount: 0,
                          BullAmount: 0,
                          closePrice: 0,
                          closeTimestamp: 0,
                          epoch: 0,
                          lockPrice: 0,
                          totalAmount: 0,
                          lockTimestamp: 0,
                          status: 3,
                          winner: true,
                          Headpayout: 0,
                          Tailpayout: 0,
                          winnerList: [],
                          oracleCalled: true,
                        }}
                        swiperIndex={i}
                      />
                    </SwiperSlide>
                  ))}

                  <SwiperSlide key={5}>
                    <Prediction
                      item={{
                        BearAmount: 0,
                        BullAmount: 0,
                        closePrice: 0,
                        closeTimestamp: 10,
                        epoch: 0,
                        lockPrice: 10,
                        totalAmount: 0,
                        lockTimestamp: 0,
                        status: 4,
                        winner: false,
                        Headpayout: 0,
                        Tailpayout: 0,
                        winnerList: [],
                        oracleCalled: false,
                      }}
                      swiperIndex={5}
                    />
                  </SwiperSlide>

                  <SwiperSlide key={6}>
                    <Prediction
                      item={{
                        BearAmount: 0,
                        BullAmount: 0,
                        closePrice: 0,
                        closeTimestamp: 0,
                        epoch: 0,
                        lockPrice: 0,
                        totalAmount: 0,
                        lockTimestamp: 0,
                        status: 4,
                        winner: true,
                        Headpayout: 0,
                        Tailpayout: 0,
                        winnerList: [],
                        oracleCalled: true,
                      }}
                      swiperIndex={6}
                    />
                  </SwiperSlide>

                  <SwiperSlide key={7}>
                    <Prediction
                      item={{
                        BearAmount: 0,
                        BullAmount: 0,
                        closePrice: 0,
                        closeTimestamp: 0,
                        epoch: 0,
                        lockPrice: 0,
                        totalAmount: 0,
                        lockTimestamp: 0,
                        status: 5,
                        winner: true,
                        Headpayout: 0,
                        Tailpayout: 0,
                        winnerList: [],
                        oracleCalled: true,
                      }}
                      swiperIndex={7}
                    />
                  </SwiperSlide>

                  <SwiperSlide key={8}>
                    <Prediction
                      item={{
                        BearAmount: 0,
                        BullAmount: 0,
                        closePrice: 0,
                        closeTimestamp: 0,
                        epoch: 0,
                        lockPrice: 0,
                        totalAmount: 0,
                        lockTimestamp: 0,
                        status: 5,
                        winner: true,
                        Headpayout: 0,
                        Tailpayout: 0,
                        winnerList: [],
                        oracleCalled: true,
                      }}
                      swiperIndex={8}
                    />
                  </SwiperSlide>
                </Swiper>
              )}
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </>
  )
}
