import Container from '../components/Container'
import Head from 'next/head'
import React from 'react'
import SplitPane from '../components/SplitPane'
import GamePanel from '../components/GamePanel'
import GameCard from '../components/GameCard'

const GameCard1 = {
  title: 'Challenge',
  summary: 'Earn BOLD whether you win or lose in our provably fair P2P challenge games.',
  graphic: <img src={'/images/home/peer-vs-peer.svg'} />,
  type: (
    <div>
      Peer-to-peer
      <br />
      Betting
    </div>
  ),
  sectionLeft: (
    <GameCard
      title={'PEER-TO-PEER'}
      buttonText={'COIN FLIP'}
      graphic={<img alt={'Coin Flip'} className={'mx-auto max-h-[19vw]'} src="/images/home/coin-flip-red.svg" />}
      theme={'red'}
      buttonTo="/coin-flip"
    />
  ),
  sectionRight: (
    <GameCard
      title={'PEER-TO-PEER'}
      buttonText={'PREDICT THE MARKET'}
      graphic={<img alt={'PREDICT THE MARKET'} className={'mx-auto max-h-[19vw]'} src="/images/home/market-red.svg" />}
      theme={'red'}
      buttonTo="/predict-the-market"
    />
  ),
}
const GameCard2 = {
  title: 'House',
  summary: 'Double your BOLD against the house at odds of 1.98x. If you lose, your BOLD is burned.',
  graphic: <img src={'/images/home/peer-vs-house.svg'} />,
  type: (
    <div>
      Fixed odds
      <br />
      FAST games
    </div>
  ),
  sectionRight: (
    <GameCard
      title={'VS-House'}
      buttonText={'PREDICT THE MARKET'}
      graphic={
        <img alt={'PREDICT THE MARKET'} className={'mx-auto max-h-[19vw]'} src="/images/home/market-white.svg" />
      }
      theme={'white'}
      buttonTo="/predict-the-market-house"
    />
  ),
  sectionLeft: (
    <GameCard
      title={'VS-House'}
      buttonText={'COIN FLIP'}
      graphic={<img alt={'Coin Flip'} className={'mx-auto max-h-[19vw]'} src="/images/home/coin-flip-white.svg" />}
      theme={'white'}
      buttonTo="/coin-flip-house"
    />
  ),
}

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>OneFortune - Coin Flip House</title>
        <meta name="description" content="Coin Flip" />
      </Head>
      <div className="items-center theGamesBack">
        <Container id="dashboard-page" className="py-4 mx-auto" maxWidth="7xl">
          <SplitPane
            left={<GamePanel {...GameCard1} />}
            right={<GamePanel {...GameCard2} />}
            className="items-stretch"
          />
        </Container>
      </div>
    </>
  )
}
