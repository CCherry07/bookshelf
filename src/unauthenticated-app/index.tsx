/** @jsxImportSource @emotion/react */
import "@reach/dialog/styles.css"
import { css } from "@emotion/react"
import VisuallyHidden from "@reach/visually-hidden"
import React, { useState } from "react"
import { Button, CircleButton, Dialog, FormGroup, Input, Spinner } from "../components/lib"
import { Logo } from "../components/logo"

type OpenModal = "none" | "login" | "register"
type FormData = { username: string, password: string }
interface unauthenticatedAppProps {
  login: (data: FormData) => void,
  register: (data: FormData) => void
}

export const UnauthenticatedApp = ({ login, register }: unauthenticatedAppProps) => {
  interface LoginFormProps {
    title: string
    onSubmit: ({ username, password }: FormData) => void
    submitButton: any
  }
  function LoginForm({ onSubmit, ...props }: LoginFormProps) {
    const { submitButton, title } = props
    const [isLoading, setLoading] = useState(true)
    function handleSubmit(event: React.FormEvent) {
      event.preventDefault()
      const { username, password } = (event.target as any).elements
      console.log(username, password);
      onSubmit({
        username: username.value as string,
        password: password.value as string
      })
      setLoading(false)
    }
    return (
      <>
        <div css={css`display:flex;justify-content:flex-end`}>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </div>
        <h1 style={{ textAlign: "center" }}>{title}</h1>
        <form onSubmit={handleSubmit} css={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          '> div': {
            margin: '10px auto',
            width: '100%',
            maxWidth: '300px',
          },
        }}>
          <FormGroup>
            <label htmlFor="username"> Username </label>
            <Input id="username" type="text" />
          </FormGroup>
          <FormGroup>
            <label htmlFor="password"> Password </label>
            <Input id="password" type="password" />
          </FormGroup>
          <div>
            {React.cloneElement(submitButton, { type: "submit" },
              ...(Array.isArray(submitButton.props.children) ?
                submitButton.props.children : [submitButton.props.children]),
              isLoading ? <Spinner css={{ marginLeft: 5 }} /> : null)}
          </div>
        </form>
      </>
    )
  }
  const [openModal, setOpenModal] = useState<OpenModal>("none")
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
        <div css={css`
          display:flex;
        `}>
          <Button style={{ margin: " 0 20px 0 0", }} onClick={() => setOpenModal("login")}>Login</Button>
          <Button variant={"secondary"} onClick={() => setOpenModal("register")}>Register</Button>
        </div>
        <Dialog aria-label="login form" isOpen={openModal === 'login'}>
          <LoginForm title="Login" submitButton={(<Button variant={"primary"}>Login</Button>)} onSubmit={login} />
        </Dialog>
        <Dialog aria-label="register form" isOpen={openModal === 'register'}>
          <LoginForm title="Register" onSubmit={register} submitButton={(<Button css={css`
            width: fit-content;
          `} variant={"secondary"}>Register</Button>)} />
        </Dialog>
      </div>
    </div>
  )
}
