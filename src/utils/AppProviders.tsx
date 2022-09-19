import { AuthProvider } from "../context/auth-provider"

export const AppProviders = ({ children }: { children: any }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
