type FormData = { username: string, password: string }
const authURL = "https://auth-provider.jk/auth"
export const login = (data: FormData) => {
  // TODO useLocalStorage
  return client("login", data)
}
export const register = (data: FormData) => {
  return client("register", data)
}
export const logout = () => {
  // todo
}
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
