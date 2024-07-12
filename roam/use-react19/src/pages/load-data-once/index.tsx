import { App as Classic } from './1-classic'
import { App as UseSuspense } from './2-use-suspense'
import { App as TryLoadInComponent } from './3-try-load-in-component'
import { App as UnderstandEffect } from './4-understand-effect'
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
        <h2>3. Try load in component</h2>
        <TryLoadInComponent />
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
