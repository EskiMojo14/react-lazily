import { lazy, ComponentType, LazyExoticComponent } from 'react'
import { ComponentKeys } from '../util/types'

/**
 * Map a module to an object of lazy-loaded components.
 * Non-component keys will be filtered out.
 */
export type LazyComponents<T extends {}> = Pick<
  {
    [K in keyof T]: T[K] extends ComponentType<any>
      ? LazyExoticComponent<T[K]>
      : never
  },
  // using Pick here instead of using key remapping directly preserves the reference to the original component
  // so you can Cmd/Ctrl + click on the imported component to jump to its definition
  // unfortunately key remapping seems to lose this context, which is worse DX
  //
  // we intersect with string because we're filtering out symbol keys in our get trap
  ComponentKeys<T> & string
>

export const lazily = <T extends {}>(
  loader: (x: keyof LazyComponents<T>) => Promise<T>
) =>
  new Proxy({} as LazyComponents<T>, {
    get: (target, componentName) => {
      if (typeof componentName === 'string') {
        return lazy(() =>
          loader(componentName as never).then((x) => ({
            default: x[componentName as never] as ComponentType<any>,
          }))
        )
      }
    },
  })
