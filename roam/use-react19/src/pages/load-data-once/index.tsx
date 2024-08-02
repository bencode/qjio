import { App as Classic } from './classic'
import { App as UseSuspense } from './use-suspense'
import { App as TryLoadInComponent } from './try-load-in-component'
import { App as UnderstandEffect } from './understand-effect'
import { App as ExtractHook } from './extract-hook'
import { App as LoadDataInRender } from './load-data-in-render'

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
      <section>
        <h2>6. Load Data in Render</h2>
        <LoadDataInRender />
      </section>
    </div>
  )
}
