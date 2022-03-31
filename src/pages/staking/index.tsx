import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import Head from 'next/head'

import Container from '../../components/Container'
import Staking from '../../components/Staking'
import { toast } from 'react-toastify'
import {
  useGetBoldStakingBalance,
  useGetLPStakingBalance,
  useStakeBold,
  useUnstakeBold,
  useClaimBold,
  useStakeLP,
  useUnstakeLP,
  useClaimLP,
} from '../../hooks/useStaking'
import { STAKING_BOLD_ADDRESS, STAKING_LP_ADDRESS, BOLDTOKEN_ADDRESS, LPTOKEN_ADDRESS } from '../../constants'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { CurrencyAmount, Token, Currency } from '@sushiswap/sdk'
import { tryParseAmount } from '../../functions/parse'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { LPSTAKING_MIN } from '../../constants/api-constants'

export default function StakingPage() {
  const { account, chainId } = useActiveWeb3React()
  const [getBoldStakingBalance] = useGetBoldStakingBalance()
  const [getLPStakingBalance] = useGetLPStakingBalance()

  const [boldStakeBalance, setBoldStakeBalance] = useState(0)
  const [boldReward, setBoldReward] = useState(0)

  const [lpStakeBalance, setLPStakeBalance] = useState(0)
  const [lpReward, setLPReward] = useState(0)

  const [stakeBold] = useStakeBold()
  const [unstakeBold] = useUnstakeBold()
  const [claimBold] = useClaimBold()
  const [isStakeBoldPending, setIsStakeBoldPending] = useState(false)

  const [stakeLP] = useStakeLP()
  const [unstakeLP] = useUnstakeLP()
  const [claimLP] = useClaimLP()
  const [isStakeLPPending, setIsStakeLPPending] = useState(false)

  const [boldApproveAmount, setBoldApproveAmount] = useState(10)
  const [lpApproveAmount, setLPApproveAmount] = useState(10)
  const boldToken = new Token(chainId, BOLDTOKEN_ADDRESS, 18)
  const lpToken = new Token(chainId, LPTOKEN_ADDRESS, 18)

  const [typedBoldAmount, setTypedBoldAmount] = useState<CurrencyAmount<Currency>>(
    tryParseAmount(boldApproveAmount.toString(), boldToken)
  )

  const [typedLPAmount, setTypedLPAmount] = useState<CurrencyAmount<Currency>>(
    tryParseAmount(lpApproveAmount.toString(), lpToken)
  )

  const [approvalStateBold, approveBold] = useApproveCallback(typedBoldAmount, STAKING_BOLD_ADDRESS)
  const disabledBold = approvalStateBold !== ApprovalState.APPROVED

  const [approvalStateLP, approveLP] = useApproveCallback(typedLPAmount, STAKING_LP_ADDRESS)
  const disabledLP = approvalStateLP !== ApprovalState.APPROVED

  const getBoldStakeBalance = async () => {
    const result = await getBoldStakingBalance(account)
    setBoldStakeBalance(result?.[0] / 10 ** 18)
    setBoldReward(result?.[1] / 10 ** 18)
  }

  const getLPStakeBalance = async () => {
    const result = await getLPStakingBalance(account)
    setLPStakeBalance(result?.[0] / 10 ** 18)
    setLPReward(result?.[1] / 10 ** 18)
  }

  useEffect(() => {
    setTypedBoldAmount(tryParseAmount(boldApproveAmount.toString(), boldToken))
  }, [boldApproveAmount])

  useEffect(() => {
    setTypedLPAmount(tryParseAmount(lpApproveAmount.toString(), lpToken))
  }, [lpApproveAmount])

  useEffect(() => {
    getBoldStakeBalance()
    getLPStakeBalance()
  }, [account])

  const handleBoldApprove = async (amount: number) => {
    setIsStakeBoldPending(true)
    try {
      await approveBold()
      setIsStakeBoldPending(false)
    } catch (e) {
      setIsStakeBoldPending(false)
      console.log('Approve failed', e)
      if (e.message.includes('Internal JSON-RPC error'))
        toast(e.data.details || e.data.message, { bodyClassName: 'font-sans text-cF0EFEE' })
      else toast(e.message, { bodyClassName: 'font-sans text-cF0EFEE' })
    }
  }
  const handleBoldStake = async (amount: number) => {
    setIsStakeBoldPending(true)
    try {
      const result: any = await stakeBold(amount)
      if (result?.blockNumber > 0) {
        getBoldStakeBalance()
        setIsStakeBoldPending(false)
      }
    } catch (e) {
      setIsStakeBoldPending(false)
      if (e.message.includes('Internal JSON-RPC error'))
        toast(e.data.details || e.data.message, { bodyClassName: 'font-sans text-cF0EFEE' })
      else toast(e.message, { bodyClassName: 'font-sans text-cF0EFEE' })
    }
  }
  const handleBoldUnstake = async (amount: number) => {
    setIsStakeBoldPending(true)
    try {
      const result: any = await unstakeBold(amount)
      if (result?.blockNumber > 0) {
        getBoldStakeBalance()
        setIsStakeBoldPending(false)
      }
    } catch (e) {
      setIsStakeBoldPending(false)
      if (e.message.includes('Internal JSON-RPC error'))
        toast(e.data.details || e.data.message, { bodyClassName: 'font-sans text-cF0EFEE' })
      else toast(e.message, { bodyClassName: 'font-sans text-cF0EFEE' })
    }
  }
  const handleBoldClaim = async () => {
    setIsStakeBoldPending(true)
    try {
      const result: any = await claimBold()
      if (result?.blockNumber > 0) {
        getBoldStakeBalance()
        setIsStakeBoldPending(false)
      }
    } catch (e) {
      setIsStakeBoldPending(false)
      if (e.message.includes('Internal JSON-RPC error'))
        toast(e.data.details || e.data.message, { bodyClassName: 'font-sans text-cF0EFEE' })
      else toast(e.message, { bodyClassName: 'font-sans text-cF0EFEE' })
    }
  }

  const handleLPApprove = async (amount: number) => {
    try {
      await approveLP()
    } catch (e) {
      console.log('Approve failed', e)
      if (e.message.includes('Internal JSON-RPC error'))
        toast(e.data.details || e.data.message, { bodyClassName: 'font-sans text-cF0EFEE' })
      else toast(e.message, { bodyClassName: 'font-sans text-cF0EFEE' })
    }
  }
  const handleLPStake = async (amount: number) => {
    const stakingMin = parseFloat(LPSTAKING_MIN)
    if (amount < stakingMin) {
      toast(`Amount should be greater than ${stakingMin}`, { bodyClassName: 'font-sans text-cF0EFEE' })
      return
    }
    setIsStakeLPPending(true)
    try {
      const result: any = await stakeLP(amount)
      if (result?.blockNumber > 0) {
        getLPStakeBalance()
        setIsStakeLPPending(false)
      }
    } catch (e) {
      setIsStakeLPPending(false)
      if (e.message.includes('Internal JSON-RPC error'))
        toast(e.data.details || e.data.message, { bodyClassName: 'font-sans text-cF0EFEE' })
      else toast(e.message, { bodyClassName: 'font-sans text-cF0EFEE' })
    }
  }
  const handleLPUnstake = async (amount: number) => {
    setIsStakeLPPending(true)
    try {
      const result: any = await unstakeLP(amount)
      if (result?.blockNumber > 0) {
        getLPStakeBalance()
        setIsStakeLPPending(false)
      }
    } catch (e) {
      setIsStakeLPPending(false)
      if (e.message.includes('Internal JSON-RPC error'))
        toast(e.data.details || e.data.message, { bodyClassName: 'font-sans text-cF0EFEE' })
      else toast(e.message, { bodyClassName: 'font-sans text-cF0EFEE' })
    }
  }
  const handleLPClaim = async () => {
    setIsStakeLPPending(true)
    try {
      const result: any = await claimLP()
      if (result?.blockNumber > 0) {
        getLPStakeBalance()
        setIsStakeLPPending(false)
      }
    } catch (e) {
      setIsStakeLPPending(false)
      if (e.message.includes('Internal JSON-RPC error'))
        toast(e.data.details || e.data.message, { bodyClassName: 'font-sans text-cF0EFEE' })
      else toast(e.message, { bodyClassName: 'font-sans text-cF0EFEE' })
    }
  }

  const handleTypeAmountAction = (symbol: string, amount: number) => {
    if (symbol === 'BOLD') {
      setBoldApproveAmount(10)
    } else {
      setLPApproveAmount(10)
    }
  }
  return (
    <>
      <Container id="staking-page" className="flex-1" maxWidth="full">
        <ToastContainer />

        <Head>
          <title>OneFortune - STAKING</title>
          <meta key="description" name="description" content="Staking" />
        </Head>
        <div className="flex flex-col h-full stakingBack pb-1">
          <div className="flex mb-1 ml-10 mt-5">
            <Link href={'/staking'} passHref>
              <p className="text-lg cursor-pointer md:text-2xl text-cF0EFEE font-sansBold">STAKING</p>
            </Link>
          </div>

          <div className="flex flex-col flex-1 mx-10 mt-1 gap-2">
            <Staking
              title="BOLD"
              description={`Stake BOLD to earn BOLD.${'\n'}It’s as simple as that.`}
              symbol="BOLD"
              apr={5}
              decimals={4}
              linkURL="https://docs.onefortune.com/staking/staking-bold"
              disabled={disabledBold}
              stakeAmount={boldStakeBalance}
              rewardAmount={boldReward}
              approveAction={handleBoldApprove}
              typeAmountAction={handleTypeAmountAction}
              stakeAction={handleBoldStake}
              unstakeAction={handleBoldUnstake}
              claimAction={handleBoldClaim}
              isPending={isStakeBoldPending}
            />

            <Staking
              title="BOLD-USDC LP"
              description={`Stake BOLD-USDC Liquidity Pool tokens to earn BOLD with high APR.`}
              symbol="LP Token"
              apr={50}
              decimals={6}
              linkURL="https://docs.onefortune.com/staking/staking-lp-tokens"
              disabled={disabledLP}
              stakeAmount={lpStakeBalance}
              rewardAmount={lpReward}
              typeAmountAction={handleTypeAmountAction}
              approveAction={handleLPApprove}
              stakeAction={handleLPStake}
              unstakeAction={handleLPUnstake}
              claimAction={handleLPClaim}
              isPending={isStakeLPPending}
            />
          </div>
        </div>
      </Container>
    </>
  )
}
