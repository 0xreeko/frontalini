import { useCallback } from 'react'

import COINTOSS_ABI from '../constants/abis/CoinTossWithTokenV2.json'
import PREDICTION_ABI from '../constants/abis/CWJPrediction.json'
import { COINTOSS_ADDRESS, PREDICTION_ADDRESS } from '../constants'
import { useContract } from './useContract'
import { utils } from 'ethers'
import { getMaticGasPrice} from '../api/common'
import { calculateGasMargin } from '../functions/trade'

export function useTossClaim() {
  const contract = useContract(COINTOSS_ADDRESS, COINTOSS_ABI)
  const tossClaim = useCallback(
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
        console.debug('Failed to Claim Toss Live USDC', error)
        throw error
      })
    },
    [contract]
  )
  return [tossClaim]
}

export function usePredictionClaim() {
  const contract = useContract(PREDICTION_ADDRESS, PREDICTION_ABI)
  const predictionClaim = useCallback(
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
        console.debug('Failed to Claim Prediction USDC', error)
        throw error
      })
    },
    [contract]
  )
  return [predictionClaim]
}
