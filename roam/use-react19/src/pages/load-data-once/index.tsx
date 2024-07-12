import { App as Classic } from './1-classic'
import { App as UseSuspense } from './2-use-suspense'
import { App as StartEncapsulate } from './3-start-encapsulate'
import { App as UnderstandEffect } from './4-effect'
import { App as ExtractHook } from './5-extract-hook'

export const App = () => {
  return (
    <div>
      <h1>Load data once</h1>
      <section>
        <h2>1. Classic</h2>
        <Classic />
      </section>
      <section>
        <h2>2. Use Suspense</h2>
        <UseSuspense />
      </section>
      <section>
        <h2>3. Start encapsulate</h2>
        <StartEncapsulate />
      </section>
      <section>
        <h2>4. Understand effect</h2>
        <UnderstandEffect />
      </section>
      <section>
        <h2>5. Extract to hook</h2>
        <ExtractHook />
      </section>
    </div>
  )
}
