import React, { Suspense } from 'react'
import { fireEvent, render } from '@testing-library/react'
import { lazily } from '../src/index'

it('Shows loading for some random component', async () => {
  const f = jest.fn(async () => ({ Component: () => <>Hello</> }))
  const { Component } = lazily(f)

  const App: React.FC = () => {
    const [open, setOpen] = React.useReducer(() => true, false)
    return (
      <>
        {open ? (
          <Suspense fallback={<>Loading...</>}>
            <Component />
          </Suspense>
        ) : (
          <button onClick={setOpen}>Load</button>
        )}
      </>
    )
  }

  const { findByText, getByText } = render(<App />)

  fireEvent.click(getByText('Load'))
  await findByText('Loading...')

  expect(f).toBeCalledTimes(1)
  expect(f).toBeCalledWith('Component')

  await findByText('Hello')
})
