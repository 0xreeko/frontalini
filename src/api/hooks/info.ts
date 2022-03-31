import { useState, useEffect } from 'react'
import { UserType } from '../../hooks/types'
import { sendGet, sendPost } from '../common'

type BetType = {
  user_address: string
  total_bet: number
  total_profit: number
  user: string
}

type GlobalStatisticsType = {
  type: [
    {
      totaltails: number
      totalheads: number
    }
  ]
}

type GetBetInfoResult = {
  list?: BetType[]
  refetch: () => void
  loading?: boolean
  success?: boolean
}

type GetGlobalStatisticsResult = {
  list?: GlobalStatisticsType[]
  refetch: () => void
  loading?: boolean
  success?: boolean
}

export const useLogin = () => {
  const [user, setUser] = useState<UserType>()
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const login = (params: any) => {
    setLoading(true)
    sendPost('user_mgmt/login', params)
      .then(({ success, data }) => {
        setUser(data)
        setSuccess(success)
      })
      .catch(() => setSuccess(false))
      .finally(() => setLoading(false))
  }

  return { login, user, loading, success }
}

export const useUpdateUser = () => {
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const updateUser = (params: any) => {
    setLoading(true)
    sendPost('user_mgmt/updateUser', params)
      .then((res) => {
        setSuccess(res.success)
        if (res && res.status === 500 && res.success === false) {
          setMessage(res.message)
        } else {
          setMessage('success')
        }
      })
      .catch(() => setSuccess(false))
      .finally(() => setLoading(false))
  }

  return { updateUser, message, loading, success }
}

export const useTopWin24 = (): GetBetInfoResult => {
  const [list, setList] = useState<BetType[]>([])
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const refetch = () => setLoading(true)

  useEffect(() => {
    if (loading) {
      sendGet('reports/cointoss/topWin24')
        .then(({ success, data }) => {
          setList(data)
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
        .finally(() => setLoading(false))
    }
  }, [loading])

  useEffect(() => refetch(), [])
  return { list, refetch, loading, success }
}

export const useTopLoss24 = (): GetBetInfoResult => {
  const [list, setList] = useState<BetType[]>([])
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const refetch = () => setLoading(true)

  useEffect(() => {
    if (loading) {
      sendGet('reports/cointoss/topLoss24')
        .then(({ success, data }) => {
          setList(data)
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
        .finally(() => setLoading(false))
    }
  }, [loading])

  useEffect(() => refetch(), [])
  return { list, refetch, loading, success }
}

export const useGlobalStatistics = (): GetGlobalStatisticsResult => {
  const [list, setList] = useState<GlobalStatisticsType[]>([])
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const refetch = () => setLoading(true)

  useEffect(() => {
    if (loading) {
      sendGet('reports/cointoss/global')
        .then(({ success, data }) => {
          setList(data)
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
        .finally(() => setLoading(false))
    }
  }, [loading])

  useEffect(() => refetch(), [])
  return { list, refetch, loading, success }
}

export const useHouseTopWin24 = (): GetBetInfoResult => {
  const [list, setList] = useState<BetType[]>([])
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const refetch = () => setLoading(true)

  useEffect(() => {
    if (loading) {
      sendGet('reports/cointosshouse/topWin24')
        .then(({ success, data }) => {
          setList(data)
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
        .finally(() => setLoading(false))
    }
  }, [loading])

  useEffect(() => refetch(), [])
  return { list, refetch, loading, success }
}

export const useHouseTopLoss24 = (): GetBetInfoResult => {
  const [list, setList] = useState<BetType[]>([])
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const refetch = () => setLoading(true)

  useEffect(() => {
    if (loading) {
      sendGet('reports/cointosshouse/topLoss24')
        .then(({ success, data }) => {
          setList(data)
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
        .finally(() => setLoading(false))
    }
  }, [loading])

  useEffect(() => refetch(), [])
  return { list, refetch, loading, success }
}

export const useHouseGlobalStatistics = (): GetGlobalStatisticsResult => {
  const [list, setList] = useState<GlobalStatisticsType[]>([])
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const refetch = () => setLoading(true)

  useEffect(() => {
    if (loading) {
      sendGet('reports/cointosshouse/global')
        .then(({ success, data }) => {
          setList(data)
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
        .finally(() => setLoading(false))
    }
  }, [loading])

  useEffect(() => refetch(), [])
  return { list, refetch, loading, success }
}

export const usePredictionTopWin24 = (): GetBetInfoResult => {
  const [list, setList] = useState<BetType[]>([])
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const refetch = () => setLoading(true)

  useEffect(() => {
    if (loading) {
      sendGet('reports/binary/topWin24')
        .then(({ success, data }) => {
          setList(data)
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
        .finally(() => setLoading(false))
    }
  }, [loading])

  useEffect(() => refetch(), [])
  return { list, refetch, loading, success }
}

export const usePredictionTopLoss24 = (): GetBetInfoResult => {
  const [list, setList] = useState<BetType[]>([])
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const refetch = () => setLoading(true)

  useEffect(() => {
    if (loading) {
      sendGet('reports/binary/topLoss24')
        .then(({ success, data }) => {
          setList(data)
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
        .finally(() => setLoading(false))
    }
  }, [loading])

  useEffect(() => refetch(), [])
  return { list, refetch, loading, success }
}

export const usePredictionGlobalStatistics = (): GetGlobalStatisticsResult => {
  const [list, setList] = useState<GlobalStatisticsType[]>([])
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const refetch = () => setLoading(true)

  useEffect(() => {
    if (loading) {
      sendGet('reports/binary/global')
        .then(({ success, data }) => {
          setList(data)
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
        .finally(() => setLoading(false))
    }
  }, [loading])

  useEffect(() => refetch(), [])
  return { list, refetch, loading, success }
}

export const usePredictionHouseTopWin24 = (): GetBetInfoResult => {
  const [list, setList] = useState<BetType[]>([])
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const refetch = () => setLoading(true)

  useEffect(() => {
    if (loading) {
      sendGet('reports/binaryhouse/topWin24')
        .then(({ success, data }) => {
          setList(data)
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
        .finally(() => setLoading(false))
    }
  }, [loading])

  useEffect(() => refetch(), [])
  return { list, refetch, loading, success }
}

export const usePredictionHouseTopLoss24 = (): GetBetInfoResult => {
  const [list, setList] = useState<BetType[]>([])
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const refetch = () => setLoading(true)

  useEffect(() => {
    if (loading) {
      sendGet('reports/binaryhouse/topLoss24')
        .then(({ success, data }) => {
          setList(data)
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
        .finally(() => setLoading(false))
    }
  }, [loading])

  useEffect(() => refetch(), [])
  return { list, refetch, loading, success }
}

export const usePredictionHouseGlobalStatistics = (): GetGlobalStatisticsResult => {
  const [list, setList] = useState<GlobalStatisticsType[]>([])
  const [success, setSuccess] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()

  const refetch = () => setLoading(true)

  useEffect(() => {
    if (loading) {
      sendGet('reports/binaryhouse/global')
        .then(({ success, data }) => {
          setList(data)
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
        .finally(() => setLoading(false))
    }
  }, [loading])

  useEffect(() => refetch(), [])
  return { list, refetch, loading, success }
}
