import { createKnex } from '../core/knex'

export default async function Home() {
  console.log('herer')
  return (
    <main>
      <Contents />
    </main>
  );
}

async function Contents() {
  return (
    <h1>study(math) => practice(code)</h1>
  )
}
