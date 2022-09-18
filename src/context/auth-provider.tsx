import React, { useState } from "react"

const AuthContext = React.createContext({})

function AuthProvider() {
  const user = useState({})
  
  return <AuthContext.Provider value={{}}></AuthContext.Provider>
}


export { }
