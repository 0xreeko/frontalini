export const numberWithCommas = (x: string) => {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const addressFormat = (address: string) => {
  return address.slice(0, 4) + '...' + address.slice(-4)
}

export const getTimeAgo = (timestamp: number) => {
  const diff = new Date().getTime() - timestamp
  if (diff < 1000) return 'now'
  else if (diff < 60000) return Math.floor(diff / 1000) + ' seconds ago'
  else if (diff < 1000 * 3600) return Math.floor(diff / 60000) + ' minutes ago'
  else if (diff < 1000 * 3600 * 24) return Math.floor(diff / (1000 * 3600)) + ' hours ago'
  else if (diff < 1000 * 3600 * 24 * 30) return Math.floor(diff / (1000 * 3600 * 24)) + ' days ago'
  else return 'long time ago'
}
