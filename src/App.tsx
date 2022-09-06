import React, { useState } from "react"
import "@reach/dialog/styles.css"

import { Logo } from './components/logo'
import { Button, FormGroup, Input, Dialog } from "./components/lib"
type OpenModal = "none" | "login" | "register"
type FormData = { username: string, password: string }
interface LoginFormProps {
  onSubmit: ({ username, password }: FormData) => void
  buttontext: string,
  submitButton?: React.ReactNode
}
function LoginForm({ onSubmit, buttontext = "submit" }: LoginFormProps) {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const { username, password } = (event.target as any).elements
    onSubmit({
      username: username.value as string,
      password: password.value as string
    })
  }
  return (
    <form onSubmit={handleSubmit}>
      <FormGroup>
        <label htmlFor="username"> Username </label>
        <Input id="username" type="text" />
      </FormGroup>
      <FormGroup>
        <label htmlFor="password"> Password </label>
        <Input id="password" type="password" />
      </FormGroup>
      <div>
        <Button onSubmit={handleSubmit}> {buttontext} </Button>
      </div>
    </form>
  )
}

function App() {
  const [openModal, setOpenModal] = useState<OpenModal>("none")

  function login(formData: FormData) {
    console.log("login", formData);

  }

  function register(formData: FormData) {
    console.log("register", formData);

  }
  return (
    <div className="App">
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Logo width='80' height='80' />
        <h1> Bookshelf </h1>
        <div>
          <Button style={{ margin: " 0 20px 0 0", }} width="80" onClick={() => setOpenModal("login")}>Login</Button>
          <Button type="secondary" onClick={() => setOpenModal("register")}>Register</Button>
        </div>
        <Dialog aria-label="login form" isOpen={openModal === 'login'}>
          {/* <Button onClick={() => setOpenModal("none")}>check</Button> */}
          <LoginForm onSubmit={login} buttontext="Login" />
        </Dialog>
        <Dialog aria-label="register form" isOpen={openModal === 'register'}>
          <LoginForm onSubmit={register} buttontext="Register" />
        </Dialog>
      </div>
    </div>
  )
}

export default App
