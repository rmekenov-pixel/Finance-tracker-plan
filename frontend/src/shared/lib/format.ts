export const formatCurrency = (amount: number | string | undefined | null, currency: string = 'KZT'): string => {
  const num = Number(amount) || 0
  const formattedNumber = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(num)

  switch (currency.toUpperCase()) {
    case 'KZT':
      return `${formattedNumber} ₸`
    case 'USD':
      return `$${formattedNumber}`
    case 'EUR':
      return `€${formattedNumber}`
    case 'RUB':
      return `${formattedNumber} ₽`
    default:
      return `${formattedNumber} ${currency}`
  }
}

export const formatDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d)
  } catch {
    return dateStr
  }
}

export const formatFullDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d)
  } catch {
    return dateStr
  }
}
