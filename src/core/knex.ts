import createKnexInstance, { Knex } from 'knex'
import { config } from '../config/app'

export function createKnex() {
  const knex = createKnexInstance({
    client: 'better-sqlite3',
    connection: {
      filename: config.dbPath,
    },
  })
  return knex
}

export async function withKnex<T>(work: (knex: Knex) => Promise<T>) {
  const knex = createKnex()
  try {
    const ret = await work(knex)
    return ret
  } finally {
    await knex.destroy()
  }
}
