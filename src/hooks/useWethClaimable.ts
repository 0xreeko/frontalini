import { useCallback } from 'react'

import COINTOSS_ABI from '../constants/abis/CoinTossWithTokenV2.json'
import PREDICTION_ABI from '../constants/abis/CWJPrediction.json'
import { COINTOSS_ADDRESS, PREDICTION_ADDRESS } from '../constants'
import { useContract } from './useContract'
import { utils } from 'ethers'

export function useGetTossClaimAmount() {
  const contract = useContract(COINTOSS_ADDRESS, COINTOSS_ABI)
  const getTossClaimAmount = useCallback(
    async (account: string) => {
      const totalRounds = await contract.currentEpoch()
      const rounds = await contract.getUserRounds(account, 0, totalRounds)
      if (!rounds || rounds.length === 0 || rounds[0].length === 0) return 0
      let result = 0
      for (let i = 0; i < rounds[0].length; i++) {
        const claimable = await contract.claimable(rounds[0][i], account)
        if (claimable) {
          const RoundHistory = await contract.rounds(rounds[0][i])
          const RoundUserHistory = await contract.ledger(rounds[0][i], account)
          const HeadAmount = parseFloat(utils.formatEther(RoundHistory.headsAmount))
          const TailAmount = parseFloat(utils.formatEther(RoundHistory.tailsAmount))
          let amount = parseFloat(utils.formatEther(RoundUserHistory.amount))
          if (RoundHistory.tossResult.toString() === RoundUserHistory.position.toString()) {
            if (RoundHistory.tossResult.toString() === '1') {
              result += (amount / HeadAmount) * TailAmount * 0.97 + amount
            } else if (RoundHistory.tossResult.toString() === '0') {
              result += (amount / TailAmount) * HeadAmount * 0.97 + amount
            }
          }
        }
      }
      return result
    },
    [contract]
  )
  return [getTossClaimAmount]
}

export function useGetPredictionClaimAmount() {
  const contract = useContract(PREDICTION_ADDRESS, PREDICTION_ABI)
  const getPredictionClaimAmount = useCallback(
    async (account: string) => {
      const totalRounds = await contract.currentEpoch()
      const rounds = await contract.getUserRounds(account, 0, totalRounds)
      if (!rounds || rounds.length === 0 || rounds[0].length === 0) return 0
      let result = 0
      for (let i = 0; i < rounds[0].length; i++) {
        const claimable = await contract.claimable(rounds[0][i], account)
        if (claimable) {
          const RoundHistory = await contract.rounds(rounds[0][i])
          const RoundUserHistory = await contract.ledger(rounds[0][i], account)
          const BullAmount = parseFloat(utils.formatEther(RoundHistory.bullAmount))
          const BearAmount = parseFloat(utils.formatEther(RoundHistory.bearAmount))
          let amount = parseFloat(utils.formatEther(RoundUserHistory.amount))
          if (
            (RoundHistory.closePrice >= RoundHistory.lockPrice && RoundUserHistory.position === 0) ||
            (RoundHistory.closePrice < RoundHistory.lockPrice && RoundUserHistory.position === 1)
          ) {
            if (RoundHistory.closePrice >= RoundHistory.lockPrice && RoundUserHistory.position === 0) {
              result += (amount / BullAmount) * BearAmount * 0.97 + amount
            } else if (RoundHistory.closePrice < RoundHistory.lockPrice && RoundUserHistory.position === 1) {
              result += (amount / BearAmount) * BullAmount * 0.97 + amount
            }
          }
        }
      }
      return result
    },
    [contract]
  )
  return [getPredictionClaimAmount]
}
