import { pick } from 'ramda'
import createKnexInstance, { Knex } from 'knex'

export { Knex }

export type CreateKnexConfig = {
  client: string
  host: string
  port: number
  user: string
  password: string
  database: string
  debug?: boolean
}

export function createKnex(config: CreateKnexConfig) {
  const timeout = 5_000
  const knex = createKnexInstance({
    client: config.client,
    debug: config.debug,
    pool: { min: 0, max: 1 },
    // TODO 为什么这个无效，默认时间是10s，需要把它调短一些。
    acquireConnectionTimeout: timeout,
    connection: {
      ...pick(['host', 'port', 'user', 'password', 'database'], config),
    },
  })
  return knex
}

export async function withKnex<T>(config: CreateKnexConfig, work: (knex: Knex) => Promise<T>) {
  const knex = createKnex(config)
  try {
    const ret = await work(knex)
    return ret
  } finally {
    await knex.destroy()
  }
}
