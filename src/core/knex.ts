import type { CreateKnexConfig } from '@/utils/knex'
import { Knex, createKnex } from '@/utils/knex'
import { config } from '@/config/app'

const knexRef = { current: null as Knex | null }

export function getKnex() {
  if (!knexRef.current) {
    const opts = {
      client: 'pg',
      debug: true,
      ...config.db,
    } as CreateKnexConfig
    knexRef.current = createKnex(opts)
  }
  return knexRef.current!
}
