import { QueryCache } from 'react-query'
import * as auth from './auth'
// REACT_APP_API_URL=https://bookshelf.jk/api
// REACT_APP_AUTH_URL=https://auth-provider.jk/auth
const apiURL = 'https://bookshelf.jk/api'

interface ClientParameter {
  data: Pick<RequestInit, "body">,
  token: string,
  headers: HeadersInit,
  customHeaders: HeadersInit
}

async function client(
  endpoint: string,
  { data, token, headers: customHeaders, ...customConfig }: ClientParameter,
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      'Content-Type': data ? 'application/json' : "",
      ...customHeaders,
    },
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      new QueryCache().clear()
      await auth.logout()
      // refresh the page for them
      window.location.assign(window.location as unknown as string)
      return Promise.reject({ message: 'Please re-authenticate.' })
    }
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export { client }
