import { useEffect, useState, useCallback } from 'react'
import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber, utils } from 'ethers'
import { getMaticGasPrice} from '../api/common'
import { calculateGasMargin } from '../functions/trade'

import { useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import STAKING_ABI from '../constants/abis/OFStaking.json'
import { STAKING_BOLD_ADDRESS, STAKING_LP_ADDRESS } from '../constants'
import { useContract } from './useContract'

export function useGetBoldStakingBalance() {
  const contract = useContract(STAKING_BOLD_ADDRESS, STAKING_ABI)

  const getBoldStakingBalance = useCallback(
    async (account: string) => {
      const currentCashout = await contract.getCurrentCashout(account)
      return currentCashout
    },
    [contract]
  )
  return [getBoldStakingBalance]
}

export function useStakeBold(): [(value: number) => Promise<void>, boolean, boolean] {
  const contract = useContract(STAKING_BOLD_ADDRESS, STAKING_ABI)
  const addTransaction = useTransactionAdder()

  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const stakeBold = useCallback(
    async (value: number) => {
      const gasPrice = (await getMaticGasPrice())?.fast.toString()
      setSuccess(false)
      setLoading(true)

      const estimatedGas = await contract.estimateGas
        .enter(value.toString().toBigNumber(18), {gasPrice: utils.parseUnits(gasPrice, 'gwei')})

      const tx = await contract
        .enter(value.toString().toBigNumber(18), {gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Staking BOLD ',
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

  return [stakeBold, success, loading]
}

export function useUnstakeBold(): [(value: number) => Promise<void>, boolean, boolean] {
  const contract = useContract(STAKING_BOLD_ADDRESS, STAKING_ABI)
  const addTransaction = useTransactionAdder()

  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const unstakeBold = useCallback(
    async (value: number) => {
      const gasPrice = (await getMaticGasPrice())?.fast.toString()
      setSuccess(false)
      setLoading(true)

      const estimatedGas = await contract.estimateGas
        .leave(value.toString().toBigNumber(18), {gasPrice: utils.parseUnits(gasPrice, 'gwei') })

      const tx = await contract
        .leave(value.toString().toBigNumber(18), {gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Unstaking BOLD ',
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

  return [unstakeBold, success, loading]
}

export function useClaimBold(): [() => Promise<void>, boolean, boolean] {
  const contract = useContract(STAKING_BOLD_ADDRESS, STAKING_ABI)
  const addTransaction = useTransactionAdder()

  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const claimBold = useCallback(async () => {
    const gasPrice = (await getMaticGasPrice())?.fast.toString()
    setSuccess(false)
    setLoading(true)

    const estimatedGas = await contract.estimateGas
      .cashoutAllRewards({gasPrice: utils.parseUnits(gasPrice, 'gwei')})

    const tx = await contract
      .cashoutAllRewards({gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Claiming BOLD ',
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
  }, [contract, addTransaction])

  return [claimBold, success, loading]
}

export function useGetLPStakingBalance() {
  const contract = useContract(STAKING_LP_ADDRESS, STAKING_ABI)

  const getLPStakingBalance = useCallback(
    async (account: string) => {
      const currentCashout = await contract.getCurrentCashout(account)
      return currentCashout
    },
    [contract]
  )
  return [getLPStakingBalance]
}

export function useStakeLP(): [(value: number) => Promise<void>, boolean, boolean] {
  const contract = useContract(STAKING_LP_ADDRESS, STAKING_ABI)
  const addTransaction = useTransactionAdder()

  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const stakeLP = useCallback(
    async (value: number) => {
      const gasPrice = (await getMaticGasPrice())?.fast.toString()
      setSuccess(false)
      setLoading(true)

      const estimatedGas = await contract.estimateGas
        .enter(value.toString().toBigNumber(18), {gasPrice: utils.parseUnits(gasPrice, 'gwei') })
      
      const tx = await contract
        .enter(value.toString().toBigNumber(18), {gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Staking LP ',
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

  return [stakeLP, success, loading]
}

export function useUnstakeLP(): [(value: number) => Promise<void>, boolean, boolean] {
  const contract = useContract(STAKING_LP_ADDRESS, STAKING_ABI)
  const addTransaction = useTransactionAdder()

  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const unstakeLP = useCallback(
    async (value: number) => {
      const gasPrice = (await getMaticGasPrice())?.fast.toString()
      setSuccess(false)
      setLoading(true)

      const estimatedGas = await contract.estimateGas
        .leave(value.toString().toBigNumber(18), {gasPrice: utils.parseUnits(gasPrice, 'gwei') })
      const tx = await contract
        .leave(value.toString().toBigNumber(18), {gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
        .then((response: TransactionResponse) => {
          addTransaction(response, {
            summary: 'Unstaking LP ',
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

  return [unstakeLP, success, loading]
}

export function useClaimLP(): [() => Promise<void>, boolean, boolean] {
  const contract = useContract(STAKING_LP_ADDRESS, STAKING_ABI)
  const addTransaction = useTransactionAdder()

  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const claimLP = useCallback(async () => {
    const gasPrice = (await getMaticGasPrice())?.fast.toString()
    setSuccess(false)
    setLoading(true)

    const estimatedGas = await contract.estimateGas
      .cashoutAllRewards({gasPrice: utils.parseUnits(gasPrice, 'gwei') })
    const tx = await contract
      .cashoutAllRewards({gasPrice: utils.parseUnits(gasPrice, 'gwei'), gasLimit: calculateGasMargin(estimatedGas)})
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Claiming LP ',
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
  }, [contract, addTransaction])

  return [claimLP, success, loading]
}
