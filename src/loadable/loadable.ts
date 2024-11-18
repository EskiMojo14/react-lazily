import load, {
  OptionsWithoutResolver,
  LoadableComponent,
} from '@loadable/component'
import { ComponentType, ComponentProps } from 'react'
import { ComponentKeys } from '../util/types'

/**
 * Map a module to an object of loadable components.
 * Non-component keys will be filtered out.
 */
export type LoadableComponents<T extends {}> = Pick<
  {
    [K in keyof T]: T[K] extends ComponentType<any>
      ? LoadableComponent<ComponentProps<T[K]>>
      : never
  },
  // see core for why we use Pick here
  ComponentKeys<T> & string
>

// see https://loadable-components.com/docs/babel-plugin/#loadable-detection
export const loadable = <T extends {}>(
  loader: () => Promise<T>,
  opts?: OptionsWithoutResolver<any>
) =>
  new Proxy({} as LoadableComponents<T>, {
    get: (target, componentName) => {
      if (typeof componentName === 'string') {
        return load(() => loader().then((x) => x[componentName as never]), opts)
      }
    },
  })
