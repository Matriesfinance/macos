// cronManager.ts

import cron from 'node-cron'

class CronManager {
  private static instance: CronManager
  private jobs: { [key: string]: cron.ScheduledTask } = {}

  public static getInstance(): CronManager {
    if (!CronManager.instance) {
      CronManager.instance = new CronManager()
    }
    return CronManager.instance
  }

  public addJob(name: string, schedule: string, task: () => Promise<void>) {
    if (this.jobs[name]) {
      console.warn(
        `Cron job '${name}' is already defined and will not be added again.`,
      )
      return
    }

    const job = cron.schedule(
      schedule,
      async () => {
        console.log(`Cron job '${name}' is running.`)
        try {
          await task()
        } catch (error) {
          console.error(`Error during cron job '${name}' execution:`, error)
        }
      },
      {
        scheduled: false,
      },
    )

    this.jobs[name] = job
  }

  public startJob(name: string) {
    if (this.jobs[name]) {
      this.jobs[name].start()
      console.log(`Cron job '${name}' started.`)
    } else {
      console.error(`Cron job '${name}' not found.`)
    }
  }

  public stopJob(name: string) {
    if (this.jobs[name]) {
      this.jobs[name].stop()
      console.log(`Cron job '${name}' stopped.`)
    } else {
      console.error(`Cron job '${name}' not found.`)
    }
  }
}

export default CronManager.getInstance()
