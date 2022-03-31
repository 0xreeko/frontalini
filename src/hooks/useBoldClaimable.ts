import { useCallback } from 'react'

import COINTOSS_ABI from '../constants/abis/CoinTossWithTokenV2.json'
import COINTOSS_HOUSE_ABI from '../constants/abis/CoinTossHouse.json'
import PREDICTION_ABI from '../constants/abis/CWJPrediction.json'
import PREDICTION_HOUSE_ABI from '../constants/abis/PredictionsHouse.json'
import ROUTER_ABI from '../constants/abis/Router.json'
import {
  COINTOSS_ADDRESS,
  PREDICTION_ADDRESS,
  COINTOSS_HOUSE_ADDRESS,
  PREDICTION_HOUSE_ADDRESS,
  ROUTER_ADDRESS,
  SPOXTOKEN_ADDRESS,
} from '../constants'
import { useContract } from './useContract'

export function useGetTossHouseClaimAmount() {
  const contract = useContract(COINTOSS_HOUSE_ADDRESS, COINTOSS_HOUSE_ABI)
  const tossContract = useContract(COINTOSS_ADDRESS, COINTOSS_ABI)
  const routerContract = useContract(ROUTER_ADDRESS, ROUTER_ABI)
  const getTossHouseClaimAmount = useCallback(
    async (account: string) => {
      let result = 0
      const totalRounds = await contract.currentEpoch()
      const rounds = await contract.getUserRounds(account, 0, totalRounds)
      if (rounds && rounds.length !== 0 && rounds[0].length !== 0) {
        for (let i = 0; i < rounds[0].length; i++) {
          const claimable = await contract.claimable(rounds[0][i], account)
          if (claimable) {
            const RoundUserHistory = await contract.ledger(rounds[0][i], account)
            result += (parseFloat(RoundUserHistory.amount) * 1.98) / 10 ** 18
          }
        }
      }

      const totalTossRounds = await tossContract.currentEpoch()
      const tossRounds = await tossContract.getUserRounds(account, 0, totalTossRounds)
      if (tossRounds && tossRounds.length !== 0 && tossRounds[0].length !== 0) {
        for (let i = 0; i < tossRounds[0].length; i++) {
          const claimableBonus = await tossContract.bonusClaimable(tossRounds[0][i], account)
          if (claimableBonus) {
            const RoundBonusUserHistory = await tossContract.ledger(tossRounds[0][i], account)
            const bonus = await routerContract.calculateEquivalenceToBold(
              SPOXTOKEN_ADDRESS,
              account,
              RoundBonusUserHistory.amount
            )
            result += parseFloat(bonus) / 10 ** 18
          }
        }
      }
      return result
    },
    [contract, tossContract, routerContract]
  )
  return [getTossHouseClaimAmount]
}

export function useGetPredictionHouseClaimAmount() {
  const contract = useContract(PREDICTION_HOUSE_ADDRESS, PREDICTION_HOUSE_ABI)
  const predictionContract = useContract(PREDICTION_ADDRESS, PREDICTION_ABI)
  const routerContract = useContract(ROUTER_ADDRESS, ROUTER_ABI)
  const getPredictionHouseClaimAmount = useCallback(
    async (account: string) => {
      let result = 0
      const totalRounds = await contract.currentEpoch()
      const rounds = await contract.getUserRounds(account, 0, totalRounds)
      if (rounds && rounds.length !== 0 && rounds[0].length !== 0) {
        for (let i = 0; i < rounds[0].length; i++) {
          const claimable = await contract.claimable(rounds[0][i], account)
          if (claimable) {
            const RoundUserHistory = await contract.ledger(rounds[0][i], account)
            result += (parseFloat(RoundUserHistory.amount) * 1.98) / 10 ** 18
          }
        }
      }

      const totalPredictionRounds = await predictionContract.currentEpoch()
      const predictionRounds = await predictionContract.getUserRounds(account, 0, totalPredictionRounds)
      if (predictionRounds && predictionRounds.length !== 0 && predictionRounds[0].length !== 0) {
        for (let i = 0; i < predictionRounds[0].length; i++) {
          const claimable = await predictionContract.bonusClaimable(predictionRounds[0][i], account)
          if (claimable) {
            const RoundUserHistory = await predictionContract.ledger(predictionRounds[0][i], account)
            const bonus = await routerContract.calculateEquivalenceToBold(
              SPOXTOKEN_ADDRESS,
              account,
              RoundUserHistory.amount
            )
            result += parseFloat(bonus) / 10 ** 18
          }
        }
      }
      return result
    },
    [contract, predictionContract, routerContract]
  )
  return [getPredictionHouseClaimAmount]
}
