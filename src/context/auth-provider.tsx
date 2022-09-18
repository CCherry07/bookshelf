import React, { useState } from "react"
import { useAsync } from "../hooks"

const AuthContext = React.createContext({})

function AuthProvider({ children }: { children: any }) {
  const user = useState({})

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}


export { AuthProvider }
