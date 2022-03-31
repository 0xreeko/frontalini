import { useCallback } from 'react'

import COINTOSS_ABI from '../constants/abis/CoinTossWithTokenV2.json'
import PREDICTION_ABI from '../constants/abis/CWJPrediction.json'
import COINTOSS_HOUSE_ABI from '../constants/abis/CoinTossHouse.json'
import PREDICTION_HOUSE_ABI from '../constants/abis/PredictionsHouse.json'
import { COINTOSS_ADDRESS, PREDICTION_ADDRESS, COINTOSS_HOUSE_ADDRESS, PREDICTION_HOUSE_ADDRESS } from '../constants'
import { useContract } from './useContract'
import { BigNumber, utils } from 'ethers'
import { getMaticGasPrice} from '../api/common'
import { calculateGasMargin } from '../functions/trade'

export function useTossHouseClaim() {
  const contract = useContract(COINTOSS_HOUSE_ADDRESS, COINTOSS_HOUSE_ABI)
  const tossHouseClaim = useCallback(
    async (account: string) => {
      const totalRounds = await contract.currentEpoch()
      const rounds = await contract.getUserRounds(account, 0, totalRounds)
      if (!rounds || rounds.length === 0 || rounds[0].length === 0) return 0
      let result = []
      for (let i = 0; i < rounds[0].length; i++) {
        const claimable = await contract.claimable(rounds[0][i], account)
        if (claimable) if (claimable) result.push(rounds[0][i])
      }

      const gasPrice = (await getMaticGasPrice())?.fast.toString()

      const estimatedGas = await contract.estimateGas
        .claim(result, {gasPrice: utils.parseUnits(gasPrice, 'gwei')})
      return contract
        .claim(result, {gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
        .catch((error: Error) => {
        console.debug('Failed to Claim Toss House Bold', error)
        throw error
      })
    },
    [contract]
  )
  return [tossHouseClaim]
}

export function useTossBonusClaim() {
  const contract = useContract(COINTOSS_ADDRESS, COINTOSS_ABI)
  const tossBonusClaim = useCallback(
    async (account: string) => {
      const totalRounds = await contract.currentEpoch()
      const rounds = await contract.getUserRounds(account, 0, totalRounds)
      if (!rounds || rounds.length === 0 || rounds[0].length === 0) return 0
      let result = []
      for (let i = 0; i < rounds[0].length; i++) {
        const claimable = await contract.bonusClaimable(rounds[0][i], account)
        if (claimable) if (claimable) result.push(rounds[0][i])
      }

      const gasPrice = (await getMaticGasPrice())?.fast.toString()

      const estimatedGas = await contract.estimateGas
        .claimBonusRewards(result, {gasPrice: utils.parseUnits(gasPrice, 'gwei')})
      return contract
        .claimBonusRewards(result, {gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
        .catch((error: Error) => {
        console.debug('Failed to Claim Toss Bonus Bold', error)
        throw error
      })
    },
    [contract]
  )
  return [tossBonusClaim]
}

export function usePredictionHouseClaim() {
  const contract = useContract(PREDICTION_HOUSE_ADDRESS, PREDICTION_HOUSE_ABI)
  const predictionHouseClaim = useCallback(
    async (account: string) => {
      const totalRounds = await contract.currentEpoch()
      const rounds = await contract.getUserRounds(account, 0, totalRounds)
      if (!rounds || rounds.length === 0 || rounds[0].length === 0) return 0
      let result = []
      for (let i = 0; i < rounds[0].length; i++) {
        const claimable = await contract.claimable(rounds[0][i], account)
        if (claimable) result.push(rounds[0][i])
      }

      const gasPrice = (await getMaticGasPrice())?.fast.toString()

      const estimatedGas = await contract.estimateGas
        .claim(result, {gasPrice: utils.parseUnits(gasPrice, 'gwei')})
      return contract
        .claim(result, {gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
        .catch((error: Error) => {
        console.debug('Failed to Claim Prediction House Bold', error)
        throw error
      })
    },
    [contract]
  )
  return [predictionHouseClaim]
}

export function usePredictionBonusClaim() {
  const contract = useContract(PREDICTION_ADDRESS, PREDICTION_ABI)
  const predictionBonusClaim = useCallback(
    async (account: string) => {
      const totalRounds = await contract.currentEpoch()
      const rounds = await contract.getUserRounds(account, 0, totalRounds)
      if (!rounds || rounds.length === 0 || rounds[0].length === 0) return 0
      let result = []
      for (let i = 0; i < rounds[0].length; i++) {
        const claimable = await contract.bonusClaimable(rounds[0][i], account)
        if (claimable) result.push(rounds[0][i])
      }

      const gasPrice = (await getMaticGasPrice())?.fast.toString()

      const estimatedGas = await contract.estimateGas
        .claimBonusRewards(result, {gasPrice: utils.parseUnits(gasPrice, 'gwei')})
      return contract
        .claimBonusRewards(result, {gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
        .catch((error: Error) => {
        console.debug('Failed to Claim Prediction Bonus Bold', error)
        throw error
      })
    },
    [contract]
  )
  return [predictionBonusClaim]
}
