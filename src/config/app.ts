import * as pathUtil from 'node:path' 

const appRoot = process.cwd()

export const config = {
  graphRoot: pathUtil.join(appRoot, 'graph/pages'),

  db: {
    host:  process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.PASS,
    database: process.env.DB_NAME,
  }
}
