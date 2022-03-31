import { useEffect, useState, useCallback } from 'react'
import { TransactionResponse } from '@ethersproject/providers'
// import { BigNumber } from '@ethersproject/bignumber'
import { BigNumber, utils } from 'ethers'
import { getMaticGasPrice} from '../api/common'
import { calculateGasMargin } from '../functions/trade'

import { useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import COINTOSS_HOUSE_ABI from '../constants/abis/CoinTossHouse.json'
import { COINTOSS_HOUSE_ADDRESS } from '../constants'
import { useContract } from './useContract'
import { TossType } from './types'

export function useBetTails(): [(epoch: number, value: number) => Promise<void>, boolean, boolean] {
  const contract = useContract(COINTOSS_HOUSE_ADDRESS, COINTOSS_HOUSE_ABI)
  const addTransaction = useTransactionAdder()

  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const betTails = useCallback(
    async (epoch: number, value: number) => {
      setSuccess(false)
      setLoading(true)
      const feeAmount = await contract.feeAmount()
      const gasPrice = (await getMaticGasPrice())?.fast.toString()

      const estimatedGas = await contract.estimateGas
        .betTails(BigNumber.from(epoch), utils.parseEther(value.toString()), { value: feeAmount, gasPrice: utils.parseUnits(gasPrice, 'gwei') })

      const tx = await contract
        .betTails(BigNumber.from(epoch), utils.parseEther(value.toString()), { value: feeAmount, gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'BetTails ',
          })
          setSuccess(true)
          setLoading(false)
          return response
        })
        .catch((error: Error) => {
          setSuccess(false)
          console.debug('Failed to approve token', error)
          throw error
        })
      return tx.wait()
    },
    [contract, addTransaction]
  )

  return [betTails, success, loading]
}

export function useBetHeads(): [(epoch: number, value: number) => Promise<void>, boolean, boolean] {
  const contract = useContract(COINTOSS_HOUSE_ADDRESS, COINTOSS_HOUSE_ABI)
  const addTransaction = useTransactionAdder()

  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const betHeads = useCallback(
    async (epoch: number, value: number) => {
      setSuccess(false)
      setLoading(true)
      const feeAmount = await contract.feeAmount()
      const gasPrice = (await getMaticGasPrice())?.fast.toString()

      const estimatedGas = await contract.estimateGas
        .betHeads(BigNumber.from(epoch), utils.parseEther(value.toString()), { value: feeAmount, gasPrice: utils.parseUnits(gasPrice, 'gwei') })
      const tx = await contract
        .betHeads(BigNumber.from(epoch), utils.parseEther(value.toString()), { value: feeAmount, gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'BetHeads ',
          })
          setSuccess(true)
          setLoading(false)
          return response
        })
        .catch((error: Error) => {
          console.debug('Failed to approve token', error)
          setSuccess(false)
          throw error
        })
      return tx.wait()
    },
    [contract, addTransaction]
  )

  return [betHeads, success, loading]
}

export function useGetTreasureFee(): number {
  const contract = useContract(COINTOSS_HOUSE_ADDRESS, COINTOSS_HOUSE_ABI)
  const treasuryFee: BigNumber = useSingleCallResult(contract, 'treasuryFee')?.result?.[0]
  const [treasuryFees, setTreasuryFees] = useState<number>(0)

  useEffect(() => {
    if (treasuryFee && treasuryFee.toNumber() > 0) {
      setTreasuryFees(treasuryFee.toNumber())
    }
  }, [treasuryFee])

  return treasuryFees
}

export function useGetUserRounds(account: string): BigNumber[] {
  const contract = useContract(COINTOSS_HOUSE_ADDRESS, COINTOSS_HOUSE_ABI)
  const totalRounds: BigNumber = useSingleCallResult(contract, 'currentEpoch')?.result?.[0]
  const [epochs, setEpochs] = useState<number>(0)

  const round: BigNumber[] = useSingleCallResult(contract, 'getUserRounds', [account ? account : undefined, 0, epochs])
    ?.result?.[0]

  useEffect(() => {
    if (totalRounds && totalRounds.toNumber() > 0) {
      setEpochs(totalRounds.toNumber())
    }
  }, [totalRounds])

  return round
}

export function useGetUserBetStatus() {
  const contract = useContract(COINTOSS_HOUSE_ADDRESS, COINTOSS_HOUSE_ABI)

  const getUserBetStatus = useCallback(
    async (roundId: number, account: string) => {
      const userRounds = await contract.getUserRounds(account, 0, roundId)
      const UserRound = userRounds[0].filter((v: BigNumber) => v.toNumber() === roundId)
      if (UserRound.length > 0) {
        const userRoundEpoch = parseFloat(roundId.toString())
        const RoundUserHistory = await contract.ledger(userRoundEpoch, account)
        return RoundUserHistory.position
      } else return 2
    },
    [contract]
  )
  return [getUserBetStatus]
}

export function useGetUserBetHistory() {
  const contract = useContract(COINTOSS_HOUSE_ADDRESS, COINTOSS_HOUSE_ABI)

  const getUserBetHistory = useCallback(
    async (roundId: number, account: string) => {
      const userRounds = await contract.getUserRounds(account, 0, roundId)
      const UserRound = userRounds[0].filter((v: BigNumber) => v.toNumber() === roundId)
      if (UserRound.length > 0) {
        const userRoundEpoch = parseFloat(roundId.toString())
        const RoundHistory = await contract.rounds(userRoundEpoch)
        const RoundUserHistory = await contract.ledger(userRoundEpoch, account)
        if (RoundHistory.tossResult.toString() === RoundUserHistory.position.toString())
          return {
            status: 1,
            amount: parseFloat(utils.formatEther(RoundUserHistory.amount)),
            claimed: RoundUserHistory.claimed,
          }
        else
          return {
            status: 0,
            amount: parseFloat(utils.formatEther(RoundUserHistory.amount)),
            claimed: RoundUserHistory.claimed,
          }
      } else return { status: 2, amount: 0 }
    },
    [contract]
  )
  return [getUserBetHistory]
}

export function useGetLastBetHistory() {
  const contract = useContract(COINTOSS_HOUSE_ADDRESS, COINTOSS_HOUSE_ABI)

  const getLastBetHistory = useCallback(
    async (roundId: number, account: string) => {
      const userRounds = await contract.getUserRounds(account, 0, roundId)
      const lastUserRound = userRounds[0][userRounds[0].length - 1]

      if (lastUserRound) {
        if (lastUserRound.toNumber() !== roundId) return { status: 2, amount: 0 }
        const userLastRoundEpoch = parseFloat(lastUserRound.toString())
        const lastRoundHistory = await contract.rounds(userLastRoundEpoch)
        const lastRoundUserHistory = await contract.ledger(userLastRoundEpoch, account)
        if (lastRoundHistory.tossResult.toString() === lastRoundUserHistory.position.toString())
          return { status: 1, amount: parseFloat(utils.formatEther(lastRoundUserHistory.amount)) }
        else return { status: 0, amount: parseFloat(utils.formatEther(lastRoundUserHistory.amount)) }
      } else return { status: 3, amount: 0 }
    },
    [contract]
  )
  return [getLastBetHistory]
}

export function useClaim() {
  const contract = useContract(COINTOSS_HOUSE_ADDRESS, COINTOSS_HOUSE_ABI)
  const addTransaction = useTransactionAdder()
  const claim = useCallback(
    async (round: number, account): Promise<void> => {
      const claimableRounds = []
      if (await contract.claimable(round, account)) {
        claimableRounds.push(round)
      }
      if (claimableRounds.length === 0) return

      const gasPrice = (await getMaticGasPrice())?.fast.toString()

      const estimatedGas = await contract.estimateGas
        .claim(claimableRounds, {gasPrice: utils.parseUnits(gasPrice, 'gwei')})
      return contract
        .claim(claimableRounds, {gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Claim ',
          })
        })
        .catch((error: Error) => {
          console.debug('Failed to approve token', error)
          throw error
        })
    },
    [contract, addTransaction]
  )

  return [claim]
}

export function useExecuteRound() {
  const contract = useContract(COINTOSS_HOUSE_ADDRESS, COINTOSS_HOUSE_ABI)
  const addTransaction = useTransactionAdder()

  const executeRound = useCallback(async (): Promise<void> => {
    return contract
      .executeRound({
        gasLimit: 300000,
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'ExcuteRound',
        })
      })
      .catch((error: Error) => {
        console.log('Failed to approve token', error)
        throw error
      })
  }, [contract, addTransaction])

  return [executeRound]
}

export function useClaimable(epoch: number, account: string) {
  const contract = useContract(COINTOSS_HOUSE_ADDRESS, COINTOSS_HOUSE_ABI)
  const [result, setResult] = useState<boolean>(false)
  const claimable = useCallback(
    async (epoch: number, account: string) => {
      const res = await contract.claimable(epoch, account)
      setResult(res)
    },
    [contract]
  )

  useEffect(() => {
    claimable(epoch, account)
  }, [])

  return result
}

export function useRounds(): TossType[] {
  const contract = useContract(COINTOSS_HOUSE_ADDRESS, COINTOSS_HOUSE_ABI)
  const totalRounds: BigNumber = useSingleCallResult(contract, 'currentEpoch')?.result?.[0]
  const [epcohs, setEpochs] = useState<Array<number[]>>()
  const round = useSingleContractMultipleData(contract, 'rounds', epcohs)

  useEffect(() => {
    if (totalRounds && totalRounds.toNumber() > 0) {
      const total = totalRounds.toNumber()
      let epochs = []
      if (total < 6) epochs = Array.from({ length: total }, (_, i) => i + 1).map((v) => [v])
      else {
        for (let i = total - 5; i <= total; i++) epochs.push([i])
      }
      setEpochs(epochs)
    }
  }, [totalRounds])

  const currentDate = new Date()
  const currentTimestamp = Math.ceil(currentDate.getTime() / 1000)
  let winnerList = []
  let result = round
    .map((v) => {
      const epoch = parseFloat(v.result?.epoch)
      const HeadAmount = v.result?.headsAmount ? parseFloat(utils.formatEther(v.result?.headsAmount)) : 0
      const TailAmount = v.result?.tailsAmount ? parseFloat(utils.formatEther(v.result?.tailsAmount)) : 0
      const closePrice = v.result?.closeOracleId ? parseFloat(utils.formatEther(v.result?.closeOracleId)) : 0
      const lockPrice = v.result?.lockPrice ? parseFloat(utils.formatEther(v.result?.lockPrice)) : 0
      const totalAmount = v.result?.totalAmount ? parseFloat(utils.formatEther(v.result?.totalAmount)) : 0
      const tossResult = v.result?.tossResult?.toString()
      const closeTimestamp = parseFloat(v.result?.closeTimestamp)
      const oracleCalled = v.result?.oracleCalled
      const status =
        currentTimestamp >= v.result?.startTimestamp?.toString()
          ? currentTimestamp > v.result?.closeTimestamp?.toString()
            ? 0
            : 1
          : 2
      if (status === 0) winnerList.push(tossResult === '1')
      return [
        {
          HeadAmount,
          TailAmount,
          closePrice,
          closeTimestamp,
          epoch,
          lockPrice,
          totalAmount,
          lockTimestamp: closeTimestamp,
          status,
          winner: tossResult === '1',
          Headpayout: 1.98,
          Tailpayout: 1.98,
          winnerList,
          oracleCalled,
        },
      ]
    })
    .map((v) => v[0])
  let upComing = []
  if (round && result.length > 0) {
    upComing = [
      {
        HeadAmount: 30.431041039184752,
        Headpayout: 1.7426575120035805,
        TailAmount: 22.5998412258398,
        Tailpayout: 2.3465157004904555,
        closePrice: 463.34,
        closeTimestamp: result[result.length - 1].closeTimestamp + 10,
        epoch: result[result.length - 1].epoch + 1,
        lockPrice: 463.1136569,
        lockTimestamp: result[result.length - 1].lockTimestamp,
        status: 2,
        totalAmount: 53.03088226502455,
        winner: false,
      },
      {
        HeadAmount: 30.431041039184752,
        Headpayout: 1.7426575120035805,
        TailAmount: 22.5998412258398,
        Tailpayout: 2.3465157004904555,
        closePrice: 463.34,
        closeTimestamp: result[result.length - 1].closeTimestamp + 40,
        epoch: result[result.length - 1].epoch + 2,
        lockPrice: 463.1136569,
        lockTimestamp: result[result.length - 1].lockTimestamp + 40,
        status: 2,
        totalAmount: 53.03088226502455,
        winner: false,
      },
    ]
    result = result.concat(upComing)
  }
  return result
}
