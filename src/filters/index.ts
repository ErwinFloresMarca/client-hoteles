/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
export function pluralize(time: number, label: string, addToPlurar?: string): string {
  if (time === 1) {
    return time + label
  }
  return time + label + (addToPlurar || 's')
}

/**
 * @param {Date} time
 */
export function timeAgo(time: Date | string): string {
  if (typeof time === 'string') {
    time = new Date(time)
  }
  const between = Date.now() / 1000 - Number(time) / 1000
  if (between < 3600) {
    return 'Hace ' + pluralize(~~(between / 60), ' minuto')
  } else if (between < 86400) {
    return 'Hace ' + pluralize(~~(between / 3600), ' hora')
  } else {
    return 'Hace ' + pluralize(~~(between / 86400), ' dia')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num: number, digits: number): string {
  const si = [
    { value: 1e18, symbol: 'E' },
    { value: 1e15, symbol: 'P' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'G' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num: number): string {
  return (+num || 0).toString().replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
