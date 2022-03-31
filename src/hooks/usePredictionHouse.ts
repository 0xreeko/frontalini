import { useEffect, useState, useCallback, useMemo } from 'react'
import { TransactionResponse } from '@ethersproject/providers'
// import { BigNumber } from '@ethersproject/bignumber'
import { BigNumber, utils } from 'ethers'
import { getMaticGasPrice} from '../api/common'
import { calculateGasMargin } from '../functions/trade'

import { useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import ABI from '../constants/abis/PredictionsHouse.json'
import AGGREGATOR_ABI from '../constants/abis/AggregatorV3Interface.json'
import { PREDICTION_HOUSE_ADDRESS } from '../constants'
import { useContract } from './useContract'
import { PredictionType } from './types'

export function useBetTails(): [(epoch: number, value: number) => Promise<void>, boolean, boolean] {
  const contract = useContract(PREDICTION_HOUSE_ADDRESS, ABI)
  const addTransaction = useTransactionAdder()

  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const betTails = useCallback(
    async (epoch: number, value: number) => {
      const gasPrice = (await getMaticGasPrice())?.fast.toString()
      setSuccess(false)
      setLoading(true)
      const feeAmount = await contract.feeAmount()

      const estimatedGas = await contract.estimateGas
        .betBear(BigNumber.from(epoch), utils.parseEther(value.toString()), { value: feeAmount, gasPrice: utils.parseUnits(gasPrice, 'gwei') })
      const tx = await contract
        .betBear(BigNumber.from(epoch), utils.parseEther(value.toString()), { value: feeAmount, gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'betBear ',
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
  const contract = useContract(PREDICTION_HOUSE_ADDRESS, ABI)
  const addTransaction = useTransactionAdder()
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const betHeads = useCallback(
    async (epoch: number, value: number) => {
      const gasPrice = (await getMaticGasPrice())?.fast.toString()
      setSuccess(false)
      setLoading(true)
      const feeAmount = await contract.feeAmount()

      const estimatedGas = await contract.estimateGas
        .betBull(BigNumber.from(epoch), utils.parseEther(value.toString()), { value: feeAmount, gasPrice: utils.parseUnits(gasPrice, 'gwei') })
      const tx = await contract
        .betBull(BigNumber.from(epoch), utils.parseEther(value.toString()), { value: feeAmount, gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'betBull ',
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

export function useGetOraclePrice(): number {
  const contract = useContract(PREDICTION_HOUSE_ADDRESS, ABI)
  const oracle: string = useSingleCallResult(contract, 'oracle')?.result?.[0]
  const [aggregatorV3Address, setAggregatorV3Address] = useState(oracle)
  const AggregatorContract = useContract(aggregatorV3Address, AGGREGATOR_ABI)

  useMemo(() => {
    setAggregatorV3Address(oracle)
  }, [oracle])

  const price: BigNumber = useSingleCallResult(AggregatorContract, 'latestRoundData')?.result?.answer
  return price ? parseFloat(utils.formatUnits(price, 8)) : 0
}

export function useGetUserRounds(account: string): BigNumber[] {
  const contract = useContract(PREDICTION_HOUSE_ADDRESS, ABI)
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
  const contract = useContract(PREDICTION_HOUSE_ADDRESS, ABI)

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
  const contract = useContract(PREDICTION_HOUSE_ADDRESS, ABI)

  const getUserBetHistory = useCallback(
    async (roundId: number, account: string) => {
      const userRounds = await contract.getUserRounds(account, 0, roundId)
      const UserRound = userRounds[0].filter((v: BigNumber) => v.toNumber() === roundId)
      if (UserRound.length > 0) {
        const userRoundEpoch = parseFloat(roundId.toString())
        const RoundHistory = await contract.rounds(userRoundEpoch)
        const RoundUserHistory = await contract.ledger(userRoundEpoch, account)
        if (
          (RoundHistory.closePrice >= RoundHistory.lockPrice && RoundUserHistory.position === 0) ||
          (RoundHistory.closePrice < RoundHistory.lockPrice && RoundUserHistory.position === 1)
        )
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

export function useClaim() {
  const contract = useContract(PREDICTION_HOUSE_ADDRESS, ABI)
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

export function useClaimable(epoch: number, account: string) {
  const contract = useContract(PREDICTION_HOUSE_ADDRESS, ABI)
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

export function useRounds(): PredictionType[] {
  const contract = useContract(PREDICTION_HOUSE_ADDRESS, ABI)
  const totalRounds: BigNumber = useSingleCallResult(contract, 'currentEpoch')?.result?.[0]
  const [epcohs, setEpochs] = useState<Array<number[]>>()
  const round = useSingleContractMultipleData(contract, 'rounds', epcohs)

  useEffect(() => {
    if (totalRounds && totalRounds.toNumber() > 0) {
      const total = totalRounds.toNumber()
      let epochs = []
      if (total < 7) epochs = Array.from({ length: total }, (_, i) => i + 1).map((v) => [v])
      else {
        for (let i = total - 6; i <= total; i++) epochs.push([i])
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
      const BullAmount = v.result?.bullAmount ? parseFloat(utils.formatEther(v.result?.bullAmount)) : 0
      const BearAmount = v.result?.bearAmount ? parseFloat(utils.formatEther(v.result?.bearAmount)) : 0
      const closePrice = v.result?.closePrice ? parseFloat(utils.formatUnits(v.result?.closePrice, 8)) : 0
      const lockPrice = v.result?.lockPrice ? parseFloat(utils.formatUnits(v.result?.lockPrice, 8)) : 0
      const totalAmount = v.result?.totalAmount ? parseFloat(utils.formatEther(v.result?.totalAmount)) : 0
      const closeTimestamp = parseFloat(v.result?.closeTimestamp)
      const lockTimestamp = parseFloat(v.result?.lockTimestamp)
      const oracleCalled = v.result?.oracleCalled
      const status =
        currentTimestamp >= v.result?.startTimestamp?.toString()
          ? currentTimestamp > v.result?.closeTimestamp?.toString()
            ? 0
            : 1
          : 2
      if (status === 0) winnerList.push(closePrice >= lockPrice)
      return [
        {
          BullAmount,
          BearAmount,
          closePrice,
          closeTimestamp,
          epoch,
          lockPrice,
          totalAmount,
          lockTimestamp,
          status,
          winner: closePrice >= lockPrice,
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
        BullAmount: 30.431041039184752,
        Headpayout: 1.7426575120035805,
        BearAmount: 22.5998412258398,
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
        BullAmount: 30.431041039184752,
        Headpayout: 1.7426575120035805,
        BearAmount: 22.5998412258398,
        Tailpayout: 2.3465157004904555,
        closePrice: 463.34,
        closeTimestamp: result[result.length - 1].closeTimestamp + 310,
        epoch: result[result.length - 1].epoch + 2,
        lockPrice: 463.1136569,
        lockTimestamp: result[result.length - 1].lockTimestamp + 310,
        status: 2,
        totalAmount: 53.03088226502455,
        winner: false,
      },
    ]
    result = result.concat(upComing)
  }
  return result
}
