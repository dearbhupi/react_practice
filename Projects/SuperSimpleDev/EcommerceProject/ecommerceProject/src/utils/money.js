/** Formats an integer amount of cents as a dollar currency string. */
function formatMoney(amountInCents) {
  return `$${(amountInCents / 100).toFixed(2)}`;
}

export default formatMoney;