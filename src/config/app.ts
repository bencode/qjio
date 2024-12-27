import * as pathUtil from 'node:path'

const appRoot = process.cwd()

export const config = {
  graphRoot: pathUtil.join(appRoot, 'public/graph/pages'),
  assetHost: 'https://www.qijun.io',

  db: {
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || '6532'),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
}
