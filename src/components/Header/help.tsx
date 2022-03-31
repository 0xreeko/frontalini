import React, { useState } from 'react'
import Border from './border'

const content = [
  {
    id: 1,
    title: 'How to Play',
    subTitle: 'Help information about our games',
    content:
      'OneFortune is a play-to-earn GameFi platform built on Polygon. Place bets with MATIC on our No-Lose Challenge games or take on the House with your BOLD tokens. \n\nCheck out the game guides below to learn more.',
  },
  {
    id: 2,
    title: 'Provably Fair',
    subTitle: 'Learn about our provably fair games',
    content:
      'Coin Flip Challenge uses Chainlink VRF to provide a provably random result for players.\n\nCoin Flip House makes use of the quantum random number generator provided by the Australian National University.',
  },
  {
    id: 3,
    title: 'FAQs',
    subTitle: 'Everything you need to know about OneFortune',
    content: '',
  },
]

const gameHelp = [
  {
    id: 1,
    title: 'Coin Flip Challenge',
    content:
      'Provably fair P2P Coin Flip game using Chainlink VRF. Pick Heads or Tails, bet with MATIC and be rewarded with BOLD whether you win or lose.',
    linkURL: 'https://docs.onefortune.com/coin-flip-challenge/challenge-version',
    linkText: 'Read More',
  },
  {
    id: 2,
    title: 'Coin Flip House',
    content:
      'A Coin Flip game using the Australian University Quantum Random Number Generator. Pick Heads or Tails, bet with BOLD at set odds of 1.98x. If you lose the BOLD is burned.',
    linkURL: 'https://docs.onefortune.com/coin-flip-house/house-version',
    linkText: 'Read More',
  },
  {
    id: 3,
    title: 'Predict the Market Challenge',
    content:
      'Predict the price of BTC over 5-minute intervals. Pick Up or Down, bet with MATIC and be rewarded with BOLD whether you win or lose.',
    linkURL: 'https://docs.onefortune.com/predict-the-market-challenge/challenge-version',
    linkText: 'Read More',
  },
  {
    id: 4,
    title: 'Predict the Market House',
    content:
      'Predict the price of BTC over 5-minute intervals. Pick Up or Down, bet with BOLD at set odds of 1.98x. If you lose the BOLD is burned.',
    linkURL: 'https://docs.onefortune.com/predict-the-market-house/house-version',
    linkText: 'Read More',
  },
]

const faqHelp = [
  {
    id: 1,
    title: 'Why Polygon?',
    content:
      "We built OneFortune on the Polygon network for a number of reasons, but above all else, it's because we wanted to give our users the best experience possible. Polygon allows our users to enjoy lower fees, faster gameplay, and quicker payouts, resulting in more enjoyable gameplay.",
  },
  {
    id: 2,
    title: 'What are the transaction fees?',
    content:
      'The transaction fee for Challenge games on OneFortune is 3% of the total bets. The transaction fee for House games is set at 0.5 MATIC.',
  },
  {
    id: 3,
    title: 'What happens if no one takes the other side of the bet?',
    content:
      "If you're the only person to place a bet on a round, or if there are only bets on one side (e.g.. only Heads) then your bet will be returned to you*, even if you lose. \n\n *Minus gas fees and the 3% transaction fee",
  },
  {
    id: 4,
    title: 'Why is there a short delay when waiting for the result in Coin Flip Challenge?',
    content:
      'There is a short delay when waiting for the round results in Coin Flip Challenge games due to the time it takes for the Chainlink VRF oracle to communicate the result to OneFortune.',
  },
  {
    id: 5,
    title: 'Where can I learn more about OneFortune?',
    content: "Didn't find what you were looking for?",
  },
]

const Help = () => {
  const [index, setIndex] = useState(0)

  const handleShowContent = (index: number) => setIndex(index)

  return (
    <div className="w-full h-px bg-cF0EFEE">
      {index !== 0 ? (
        <>
          <div className="flex px-10 py-5">
            <p
              className="mb-2 underline duration-300 opacity-50 cursor-pointer hover:opacity-100 font-sansBold text-cF0EFEE"
              onClick={() => setIndex(0)}
            >
              Help
            </p>
            <p className="mx-2 mb-2 opacity-50 cursor-pointer font-sansBold text-cF0EFEE">/</p>
            <p className="opacity-50 font-sansBold text-cF0EFEE">{content[index - 1].title}</p>
          </div>
          <Border />
          <div className="px-10 py-5">
            <p className="mb-5 text-18px font-sansBold text-cF0EFEE">{content[index - 1].title}</p>
            <p className="mb-4 font-sans whitespace-pre-wrap text-12px text-cF0EFEE">{content[index - 1].content}</p>
            {content[index - 1].id === 1 &&
              gameHelp.map((item) => (
                <React.Fragment key={item.id}>
                  <Border />
                  <div className="mt-4 mb-4">
                    <p className="mb-2 cursor-pointer font-sansBold text-cF0EFEE text-14px">{item.title}</p>
                    <p className="font-sans text-cF0EFEE text-12px">{item.content}</p>
                    <a
                      className="block mt-4 underline duration-300 opacity-50 font-sansBold text-12px hover:opacity-100"
                      href={item.linkURL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.linkText}
                    </a>
                  </div>
                </React.Fragment>
              ))}

            {content[index - 1].id === 3 &&
              faqHelp.map((item, i, arr) => (
                <React.Fragment key={item.id}>
                  <Border />
                  <div className="mt-4 mb-4">
                    <p className="mb-2 cursor-pointer font-sansBold text-cF0EFEE text-14px">{item.title}</p>
                    <p className="font-sans text-cF0EFEE text-12px">{item.content}</p>
                    {arr.length - 1 === i && (
                      <>
                        <a
                          className="block mt-4 underline duration-300 opacity-50 font-sansBold text-12px hover:opacity-100"
                          href="https://docs.onefortune.com/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Read our full FAQs
                        </a>
                      </>
                    )}
                  </div>
                </React.Fragment>
              ))}
          </div>
        </>
      ) : (
        <>
          {content.map((item) => (
            <React.Fragment key={item.id}>
              <div className="px-10 py-5">
                <p
                  className="mb-2 cursor-pointer font-sansBold text-cF0EFEE text-18px"
                  onClick={() => handleShowContent(item.id)}
                >
                  {item.title}
                </p>
                <p className="font-sans opacity-50 text-cF0EFEE text-12px">{item.subTitle}</p>
              </div>
              <Border />
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  )
}

export default Help
