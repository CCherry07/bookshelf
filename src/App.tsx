import { AuthenticatedApp } from "./authenticated-app"
import { useAuth } from "./context/auth-provider"
import { UnauthenticatedApp } from "./unauthenticated-app"

function App() {
  const { user, login, register } = useAuth()
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp login={login} register={register} />
}

export default App
