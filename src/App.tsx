/** @jsxImportSource @emotion/react */
import React, { useState } from "react"
import "@reach/dialog/styles.css"
import { Logo } from './components/logo'
import { Button, FormGroup, Input, Dialog } from "./components/lib"
import { jsx, css } from "@emotion/react"
type OpenModal = "none" | "login" | "register"
type FormData = { username: string, password: string }
interface LoginFormProps {
  onSubmit: ({ username, password }: FormData) => void
  submitButton: any
}
function LoginForm({ onSubmit, ...props }: LoginFormProps) {
  const { submitButton } = props
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
        {React.cloneElement(submitButton, { type: "submit" })}
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
      <div css={css`
        height:100vh;
        width:100%;
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      `}>
        <Logo width='80' height='80' />
        <h1> Bookshelf </h1>
        <div>
          <button style={{ margin: " 0 20px 0 0", }} onClick={() => setOpenModal("login")}>Login</button>
          <button onClick={() => setOpenModal("register")}>Register</button>
        </div>
        <Dialog aria-label="login form" isOpen={openModal === 'login'}>
          {/* <button onClick={() => setOpenModal("none")}>check</button> */}
          <LoginForm submitButton={(<Button>Login</Button>)} onSubmit={login} />
        </Dialog>
        <Dialog aria-label="register form" isOpen={openModal === 'register'}>
          <LoginForm onSubmit={register} submitButton={(<Button>Register</Button>)} />
        </Dialog>
      </div>
    </div>
  )
}

export default App
