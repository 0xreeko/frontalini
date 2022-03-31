import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import cx from 'classnames'

import { BigNumber, utils } from 'ethers'
import Border from './border'
import { addressFormat } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import useTokenBalance from '../../hooks/useTokenBalance'
import { useUpdateUser, useLogin } from '../../api/hooks/info'
import BOLD_TOKEN_ABI from '../../constants/abis/BoldToken.json'
import { BOLDTOKEN_ADDRESS } from '../../constants'
import { useGetTossClaimAmount, useGetPredictionClaimAmount } from '../../hooks/useWethClaimable'
import { useGetPredictionHouseClaimAmount, useGetTossHouseClaimAmount } from '../../hooks/useBoldClaimable'
import { usePredictionClaim, useTossClaim } from '../../hooks/useWethClaim'
import { useETHBalances } from '../../state/wallet/hooks'
import {
  usePredictionBonusClaim,
  usePredictionHouseClaim,
  useTossBonusClaim,
  useTossHouseClaim,
} from '../../hooks/useBoldClaim'
import Modal from '../ClaimModal'

type Props = {
  username?: string
}

const Account: React.FC<Props> = ({ username = '' }) => {
  const { account, deactivate, library } = useActiveWeb3React()
  const [claimWeth, setClaimWeth] = useState(0)
  const [claimBold, setClaimBold] = useState(0)
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const userBoldTokenBalance = useTokenBalance(BOLDTOKEN_ADDRESS, BOLD_TOKEN_ABI)

  const [getTossClaimAmount] = useGetTossClaimAmount()
  const [getPredictionClaimAmount] = useGetPredictionClaimAmount()
  const [getTossHouseClaimAmount] = useGetTossHouseClaimAmount()
  const [getPredictionHouseClaimAmount] = useGetPredictionHouseClaimAmount()

  const [tossClaim] = useTossClaim()
  const [tossBonusClaim] = useTossBonusClaim()
  const [tossHouseClaim] = useTossHouseClaim()
  const [predictionClaim] = usePredictionClaim()
  const [predictionBonusClaim] = usePredictionBonusClaim()
  const [predictionHouseClaim] = usePredictionHouseClaim()

  const [modalShow, setModalShow] = useState(false)
  const [checked, setChecked] = useState(false)
  const [claimMode, setClaimMode] = useState('')

  const [isEdit, setIsEdit] = useState(false)
  const [name, setName] = useState(username)
  const { updateUser, message, success, loading } = useUpdateUser()
  const { login } = useLogin()

  const getTotalWethAmount = async () => {
    const tossClaim = await getTossClaimAmount(account)
    const predictionClaim = await getPredictionClaimAmount(account)
    setClaimWeth(tossClaim + predictionClaim)
  }

  const getTotalBoldAmount = async () => {
    const tossClaim = await getTossHouseClaimAmount(account)
    const predictionClaim = await getPredictionHouseClaimAmount(account)
    setClaimBold(tossClaim + predictionClaim)
  }

  useEffect(() => {
    if (account) {
      getTotalWethAmount()
      getTotalBoldAmount()
    }
  }, [])

  const handleClaim = async (type: string) => {
    let isShow = ''
    if (claimMode === 'Bold') isShow = localStorage.getItem('ClaimBoldModalShow')
    else if (claimMode === 'Weth') isShow = localStorage.getItem('ClaimWethModalShow')

    if (isShow !== '1') setModalShow(true)
    else {
      if (type === 'Bold') {
        if (claimBold < 0.001) return
        await tossHouseClaim(account)
        await tossBonusClaim(account)
        await predictionHouseClaim(account)
        await predictionBonusClaim(account)
      }
      if (type === 'Weth') {
        if (claimWeth < 0.001) return
        await tossClaim(account)
        await predictionClaim(account)
      }
    }
  }

  const disconnect = async () => {
    try {
      deactivate()
    } catch (e) {
      console.log(e)
    }
  }

  const handleClaimModal = () => {
    if (checked) {
      if (claimMode === 'Bold') localStorage.setItem('ClaimBoldModalShow', '1')
      else if (claimMode === 'Weth') localStorage.setItem('ClaimWethModalShow', '1')
      setModalShow(false)
      handleClaim(claimMode)
    }
  }

  const handleUpdateUsername = () => {
    let signature = localStorage.getItem('signature')
    updateUser({
      user: name,
      token: JSON.parse(signature),
    })
  }

  const handleLogin = async () => {
    let tokenPayload = {
      address: account,
      timestamp: new Date(),
    }
    let signature = await library.getSigner().signMessage(JSON.stringify(tokenPayload))
    localStorage.setItem(
      'signature',
      JSON.stringify({
        payload: tokenPayload,
        signature,
      })
    )
    login({
      payload: tokenPayload,
      signature,
    })
  }

  useEffect(() => {
    if (success === true && loading === false) {
      localStorage.setItem('username', name)
      setIsEdit(false)
    } else if (success === false && loading === false && message === 'LOGIN TIMEOUT') {
      handleLogin()
    }
  }, [success, loading, message])

  return (
    <>
      <div className="px-10 py-5">
        <p className="mb-3 font-sansBold text-cF0EFEE">Profile</p>
        <div className="flex mb-3">
          <p className="font-sans text-cF0EFEE text-12px">Username:</p>
          {isEdit ? (
            <>
              <input
                className="ml-3 bg-transparent border rounded font-sansBold text-cF0EFEE text-12px border-cF0EFEE"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleUpdateUsername()
                }}
              />
            </>
          ) : (
            <>
              <p className="ml-1 mr-1 underline font-sansBold text-cF0EFEE text-12px">{name}</p>
              <Image
                onClick={() => setIsEdit(true)}
                src="/images/menu/pencil.png"
                className="cursor-pointer"
                alt="edit"
                width={16}
                height={16}
                objectFit="contain"
              />
            </>
          )}
        </div>
        <div className="flex mb-3">
          <p className="font-sans text-cF0EFEE text-12px">Wallet Connected:</p>
          <p className="ml-3 font-sans text-cF0EFEE text-12px">{addressFormat(account)}</p>
        </div>
      </div>
      <Border />

      <div className="flex px-10 py-5">
        <p className="mr-5 font-sansBold text-cF0EFEE text-12px">Balances:</p>
        <div>
          <div className="flex justify-end mb-3">
            <p className="self-end font-sans text-cF0EFEE text-12px">MATIC:</p>
            <p className="self-end ml-1 text-cF0EFEE text-12px">{userEthBalance?.toSignificant(4)}</p>
          </div>
          <div className="flex justify-end">
            <p className="self-end font-sans text-cF0EFEE text-12px">BOLD:</p>
            <p className="self-end ml-1 text-cF0EFEE text-12px">
              {(parseFloat(userBoldTokenBalance?.value.toString()) / 10 ** 18).toFixed(3)}
            </p>
          </div>
        </div>
      </div>
      <Border />

      <div className="flex px-10 py-5">
        <p className="mr-5 font-sansBold text-cF0EFEE text-12px" style={{ paddingTop: '3px' }}>
          Return:
        </p>
        <div>
          <div className="flex justify-end mb-3">
            <p className="self-end font-sans text-cF0EFEE text-12px">MATIC:</p>
            <p className="self-end ml-1 text-cF0EFEE text-12px">{claimWeth.toFixed(2)}</p>
            <button
              className={cx(
                claimWeth < 0.001 ? 'cursor-not-allowed bg-gray-500' : 'cursor-pointer bg-c039300 ',
                'ml-4 h-6 text-cF0EFEE  font-sansBold text-10px p-1 text-center rounded w-12'
              )}
              onClick={() => {
                if (claimWeth < 0.001) return
                setClaimMode('Weth')
                handleClaim('Weth')
              }}
            >
              CLAIM
            </button>
          </div>

          <div className="flex justify-end pl-3.5 mt-[-0.15rem]">
            <p className="self-end font-sans text-cF0EFEE text-12px">BOLD:</p>
            <p className="self-end ml-1 text-cF0EFEE text-12px">{claimBold.toFixed(3)}</p>
            <button
              className={cx(
                claimBold < 0.001 ? 'cursor-not-allowed bg-gray-500' : 'cursor-pointer bg-c039300 ',
                'ml-4 h-6 text-cF0EFEE  font-sansBold text-10px p-1 text-center rounded w-12'
              )}
              onClick={() => {
                if (claimBold < 0.001) return
                setClaimMode('Bold')
                handleClaim('Bold')
              }}
            >
              CLAIM
            </button>
          </div>
        </div>
      </div>
      <Border />

      <div className="px-10 py-5">
        <div className="hidden mb-4 underline cursor-pointer font-sansBold text-cF0EFEE text-12px">
          View Bet History
        </div>
        <div className="flex">
          <div className="mr-2 underline cursor-pointer font-sansBold text-cF0EFEE text-12px" onClick={disconnect}>
            Disconnect Wallet
          </div>
          <Image src="/images/menu/logout.png" alt="close" width={16} height={16} objectFit="contain" />
        </div>
      </div>
      <Border />

      {modalShow && (
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
                  <p className="self-center ml-1.5 text-cF0EFEE font-sansBold text-14px">
                    {claimMode === 'Bold' ? 'HOUSE GAMES' : 'CLAIM'}
                  </p>
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
                <p className="mb-6 text-center text-cF0EFEE font-sansBold text-24px">
                  {claimMode === 'Bold' ? 'HOUSE GAMES' : 'Claim Process'}
                </p>
                <p className="mb-3 font-sans text-center text-cF0EFEE text-12px">
                  Please note that during beta you will receive Metamask popups for each game which has claimable funds (up to 6 popups).
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
      )}
    </>
  )
}

export default Account
