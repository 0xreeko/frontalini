import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import 'react-toastify/dist/ReactToastify.css'

import Prediction from '../../components/Prediction'
import Footer from '../../components/FooterPrediction'
import Container from '../../components/Container'
import { useRounds } from '../../hooks/usePrediction'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'

export default function PredictionChallenge() {
  const rounds = useRounds()
  const { account } = useActiveWeb3React()

  return (
    <>
      <Container id="toss-page" className="flex-1" maxWidth="full">
        <ToastContainer />
        <Head>
          <title>OneFortune - Predict the Market Challenge</title>
          <meta key="description" name="description" content="Coin Flip Challenge" />
        </Head>
        <div className="flex w-full h-10 bg-cE3122D">
          <p className="self-center m-auto text-sm text-center text-white md:text-2xl font-sansBold">
            <a href="https://docs.onefortune.com/bold-token/bold-tokenomics" target="_blank" rel="noreferrer">
              EARN 30 BOLD FOR EVERY 20 MATIC YOU BET*
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
              <span className="font-sans text-lg md:text-2xl text-cF0EFEE">Predict The Market Challenge (BTC/USD)</span>
            </div>
            <div className="flex-auto pr-4 mb-4 ml-4 text-right sm:pr-10">
              <a
                href="https://docs.onefortune.com/predict-the-market-challenge/challenge-version"
                target="_blank"
                rel="noreferrer"
              >
                <button className="px-5 py-2 text-xs duration-300 rounded-md cursor-pointer md:text-sm bg-cE3122D hover:bg-cB30F24 text-cF0EFEE font-sansBold">
                  HOW TO PLAY
                </button>
              </a>
            </div>
          </div>
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
        </div>
      </Container>
      <Footer />
    </>
  )
}
