import { handleController } from '~~/utils'
import CronManager from '~~/utils/cron'
import {
  cancelInvestment,
  checkInvestments,
  createInvestment,
  deleteInvestment,
  getInvestment,
  getInvestments,
  getUserInvestment,
  updateInvestment,
} from './queries'

export const controllers = {
  index: handleController(async () => {
    return getInvestments()
  }),
  show: handleController(async (_, __, params) => {
    return getInvestment(params.uuid)
  }),
  user: handleController(async (_, __, ___, ____, _____, user) => {
    if (!user) throw new Error('User not found')
    return getUserInvestment(user.id)
  }),
  store: handleController(async (_, __, ___, ____, body, user) => {
    if (!user) throw new Error('User not found')
    return createInvestment(user.id, body.plan, body.amount)
  }),
  update: handleController(async (_, __, params, ___, body) => {
    return updateInvestment(Number(params.id), body.data)
  }),
  delete: handleController(async (_, __, params) => {
    return deleteInvestment(Number(params.id))
  }),
  cancel: handleController(async (_, __, params, ___, body, user) => {
    if (!user) throw new Error('User not found')
    return cancelInvestment(user.id, params.uuid)
  }),
}

function setupInvestmentsCron() {
  CronManager.addJob('check investments', '0 * * * *', async () => {
    try {
      await checkInvestments()
    } catch (error) {
      console.error(`Error running check investments task: ${error}`)
    }
  })

  CronManager.startJob('check investments')
}

setupInvestmentsCron()
