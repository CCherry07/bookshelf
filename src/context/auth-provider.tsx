import React, { useCallback, useContext, useMemo, useState } from "react"
import { useAsync } from "../hooks";
import * as auth from '../utils/auth';

interface AuthContextProps {
  user: unknown;
  login: (formData: auth.FormData) => Promise<void>;
  logout: () => void;
  register: (formData: auth.FormData) => Promise<void>
}
const AuthContext = React.createContext({})
AuthContext.displayName = 'AuthContext'
function AuthProvider({ children }: { children: any }) {
  const {
    data: user,
    setData,
    ...otherProps
  } = useAsync()

  const login = useCallback(async (formData: auth.FormData) => setData(await auth.login(formData)), [setData])
  const register = useCallback(async (formData: auth.FormData) => setData(await auth.register(formData)), [setData])
  const logout = useCallback(() => setData(auth.logout() as undefined ?? null), [setData])
  const value = useMemo(() => ({ user, login, logout, register }), [user, login, logout, register])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext) as AuthContextProps
  if (!context) throw new Error("useAuth must be used under auth context provider!")
  return context
}

export { AuthProvider }
