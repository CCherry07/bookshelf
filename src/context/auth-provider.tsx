import React, { useContext, useState } from "react"
import { useAsync } from "../hooks";
import * as auth from '../utils/auth';

const AuthContext = React.createContext({})

function AuthProvider({ children }: { children: any }) {
  const { } = useAsync()
  const value = {}
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used under auth context provider!")
  return context
}

export { AuthProvider }
