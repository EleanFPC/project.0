const EXCHANGE_RATE = 36; // 1 USD = 36 NIO

function usdToCordobas(usd) {
  return +(usd * EXCHANGE_RATE).toFixed(2);
}

module.exports = { usdToCordobas, EXCHANGE_RATE };
