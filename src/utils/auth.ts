export type FormData = { username: string, password: string }
const authURL = "https://auth-provider.jk/auth"

export const TOKEN_LOCAL_STORAGE_KEY = "TOKEN_LOCAL_STORAGE_KEY"

function handleTokenStorage(token: string) {
  window.localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, token)
}
const getToken = async () => window.localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY)
export const login = (data: FormData) => {
  // TODO useLocalStorage
  const res = client("login", data)
  console.log(res);
  return client("login", data)
}
export const register = (data: FormData) => {
  const res = client("register", data)
  console.log(res);
  return client("register", data)
}
export const logout = () => window.localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY)

function client(endpoint: string, data: FormData) {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  }

  return window.fetch(`${authURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    }
    Promise.reject(data)
  })
}
