export function formatMoney(amount: number) {
  const options = {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }

  const formatter = new Intl.NumberFormat('en-AU', options)

  return formatter.format(amount)
}
