import prisma from './prisma.mjs'

const faqCategories = [
  'BINARY',
  'AI TRADING',
  'FOREX',
  'ICO',
  'ECOSYSTEM',
  'FRONTEND',
  'STAKING',
  'MLM',
  'P2P',
  'ECOMMERCE',
  'MAILWIZARD',
  'KYC',
  'INVESTMENT',
  'DEPOSIT_SPOT',
  'DEPOSIT_FIAT',
  'WIDTHDRAW_SPOT',
  'WIDTHDRAW_FIAT',
  'TRANSFER',
]

async function main() {
  const categoryUpserts = faqCategories.map((identifier) => {
    return prisma.faq_category.upsert({
      where: { identifier },
      update: {},
      create: { identifier },
    })
  })

  await Promise.all(categoryUpserts)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
