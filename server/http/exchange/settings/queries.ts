import { processCurrenciesPrices } from '~~/http/exchange/currencies/controller'

import prisma from '~~/utils/prisma'

async function saveValidCurrencies(currencies: any): Promise<string[]> {
  const validCurrencies: string[] = []

  const batchUpsertCurrencies = []

  for (const currencyCode in currencies) {
    const currencyData = currencies[currencyCode]
    if (currencyData.precision) {
      const validChains = currencyData.chains.filter(
        (chain) =>
          chain.depositStatus === true && chain.withdrawStatus === true,
      )

      if (validChains.length > 0) {
        batchUpsertCurrencies.push(
          prisma.exchange_currency.upsert({
            where: { currency: currencyCode },
            create: {
              currency: currencyCode,
              name: currencyData.name,
              precision: currencyData.precision,
              status: currencyData.status,
              chains: validChains,
            },
            update: {
              name: currencyData.name,
              precision: currencyData.precision,
              status: currencyData.status,
              chains: validChains,
            },
          }),
        )

        validCurrencies.push(currencyCode)
      }
    }
  }

  await prisma.$transaction(batchUpsertCurrencies)
  return validCurrencies
}

async function saveValidMarkets(validCurrencies: string[], symbols: any) {
  const batchUpsertMarkets = []

  for (const symbolKey in symbols) {
    const [currency, pair] = symbolKey.split('/')

    if (validCurrencies.includes(currency)) {
      const symbolData = symbols[symbolKey]
      batchUpsertMarkets.push(
        prisma.exchange_market.upsert({
          where: { symbol: symbolKey },
          create: {
            symbol: symbolKey,
            pair: pair,
            metadata: symbolData,
            status: true,
          },
          update: {
            metadata: symbolData,
          },
        }),
      )
    }
  }

  await prisma.$transaction(batchUpsertMarkets)
}

export async function saveExchangeMarkets(symbols: any, currencies: any) {
  try {
    // Delete all existing currencies and markets
    await prisma.$transaction([
      prisma.exchange_currency.deleteMany(),
      prisma.exchange_market.deleteMany(),
    ])

    // Step 1: Save unique currencies with valid precision, deposit and withdraw statuses
    const validCurrencies = await saveValidCurrencies(currencies)

    // Step 2: Save markets only if the currency exists in the validCurrencies list
    await saveValidMarkets(validCurrencies, symbols)

    // Process currency prices (assuming you already have this function)
    await processCurrenciesPrices()

    return {
      message: 'Exchange markets and currencies saved successfully!',
    }
  } catch (error) {
    console.error('Error in saveExchangeMarkets:', error)
    throw new Error('Failed to save exchange markets and currencies.')
  }
}

export async function getExchangeDetails() {
  // Fetch the exchange details
  const exchange = await prisma.exchange.findFirst({
    where: { status: true },
  })

  if (!exchange) {
    throw new Error('No exchange found')
  }
  // Fetch the exchange markets
  const markets = await prisma.exchange_market.findMany()

  if (markets.length === 0) {
    return {
      exchange: exchange,
    }
  }

  // Prepare the response
  const response = {
    exchange: exchange,
    symbols: markets.reduce((acc, market) => {
      acc[market.symbol] = market.metadata
      return acc
    }, {}),
  }

  return response
}

export async function saveLicense(productId: string, username: string) {
  try {
    await prisma.$transaction([
      prisma.exchange.updateMany({
        where: { status: true, productId: { not: productId } },
        data: {
          status: false,
        },
      }),
      prisma.exchange_market.deleteMany(),
      prisma.exchange_currency.deleteMany(),
      prisma.exchange_orders.deleteMany(),
      prisma.exchange_watchlist.deleteMany(),
      prisma.exchange.update({
        where: { productId: productId },
        data: {
          licenseStatus: true,
          status: true,
          username: username,
        },
      }),
    ])
  } catch (error) {
    console.error('Error in saveLicense:', error)
    throw new Error(`Failed to save license: ${error}`)
  }
}
