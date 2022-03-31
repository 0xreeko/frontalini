import axios, { Method } from 'axios'
import { API_ROOT_URL } from '../constants/api-constants'

export type ResponseData = {
  message?: string
  success: boolean
  data?: any
  status?: number
}

const sendRequest = async (method: Method, endpoint: string, params: any, body?: any): Promise<ResponseData> => {
  try {
    const { data } = await axios.request({
      url: `${API_ROOT_URL}/${endpoint}`,
      method,
      params,
      data: body,
    })
    return data
  } catch (e) {
    const { data, status } = e.response || {}
    return { success: false, status, ...data }
  }
}

const getMaticGasPrice =  async () => {
  try {
    const { data } = await axios.request({
      url: 'https://gasstation-mainnet.matic.network/',
    })
    return data
  } catch (e) {
    const { data, status } = e.response || {}
    return { success: false, status, ...data }
  }
}

const sendGet = (endpoint: string, params = {}) => sendRequest('GET', endpoint, params)

const sendPost = (endpoint: string, body = {}, params = {}) => sendRequest('POST', endpoint, params, body)

const sendPut = (endpoint: string, body = {}, params = {}) => sendRequest('PUT', endpoint, params, body)

const sendDelete = (endpoint: string, params = {}) => sendRequest('DELETE', endpoint, params)

export { getMaticGasPrice, sendGet, sendPost, sendPut, sendDelete }
