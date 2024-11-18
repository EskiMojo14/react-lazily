import type { ComponentType } from 'react'

/**
 * Extract the keys of an object that are valid React components
 */
export type ComponentKeys<T> = {
  [K in keyof T]: T[K] extends ComponentType<any> ? K : never
}[keyof T]
