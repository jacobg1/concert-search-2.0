import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '../../src/app/store'
import App from '../../src/App'

test('App renders properly', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  )

  expect(getByText('Concert Search')).toBeInTheDocument()
})
