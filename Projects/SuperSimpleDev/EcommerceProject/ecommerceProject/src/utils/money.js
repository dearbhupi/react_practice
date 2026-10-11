function formatMoney(amountInCents) {
  return `$${(amountInCents / 100).toFixed(2)}`;
}

export { formatMoney };