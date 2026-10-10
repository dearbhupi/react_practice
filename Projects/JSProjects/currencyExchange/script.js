const fromCurrencyInput = document.getElementById('fromCurrency');
const toCurrencyInput = document.getElementById('toCurrency');
const amountInput = document.getElementById('amount');
const fetchBtn = document.getElementById('fetchBtn');
const resultText = document.getElementById('resultText');

fetchBtn.addEventListener('click', fetchExchangeRate);

async function fetchExchangeRate() {
  const fromCode = fromCurrencyInput.value.trim().toUpperCase();
  const toCode = toCurrencyInput.value.trim().toUpperCase();
  const amount = Number.parseFloat(amountInput.value);

  if (!fromCode || !toCode || Number.isNaN(amount) || amount < 0) {
    resultText.textContent = 'Please enter a valid amount and currencies.';
    return;
  }

  resultText.textContent = 'Loading...';

  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!response.ok) throw new Error('Failed to fetch exchange data.');

    const data = await response.json();
    const fromRate = fromCode === 'USD' ? 1 : data.rates[fromCode];
    const toRate = toCode === 'USD' ? 1 : data.rates[toCode];

    if (fromRate === undefined || toRate === undefined) {
      resultText.textContent = 'One of the selected currency codes was not found.';
      return;
    }

    const usdAmount = fromCode === 'USD' ? amount : amount / fromRate;
    const finalAmount = toCode === 'USD' ? usdAmount : usdAmount * toRate;

    resultText.textContent = `${amount} ${fromCode} = ${finalAmount.toFixed(2)} ${toCode}`;
  } catch (error) {
    resultText.textContent = `Error: ${error.message}`;
  }
}