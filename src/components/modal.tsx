import * as React from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import { Dialog, CircleButton } from './lib'

const callAll =
  (...fns: Function[]) =>
    (...args: any[]) =>
      fns.forEach(fn => fn && fn(...args))

const ModalContext = React.createContext(false)

function Modal(props: any) {
  const [isOpen, setIsOpen] = React.useState(false)

  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />
}

function useModalContext() {
  const context = React.useContext(ModalContext) as unknown as [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  if (!context) {
    throw Error("usemodal context must be used in ModalContext.Provider")
  }
  return context
}

function ModalDismissButton({ children: child }: { children: any }) {
  const [, setIsOpen] = React.useContext(ModalContext) as unknown as [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  })
}

function ModalOpenButton({ children: child }: { children: any }) {
  const [, setIsOpen] = useModalContext()
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  })
}

function ModalContentsBase(props: any) {
  const [isOpen, setIsOpen] = useModalContext()
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}


interface ModalContentsProps {
  title: string,
  children: React.ReactNode,
  // [key in string]: any
}
function ModalContents({ title, children, ...props }: ModalContentsProps) {
  return (
    <ModalContentsBase {...props}>
      <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ModalDismissButton>
          <CircleButton>
            <VisuallyHidden>Close</VisuallyHidden>
            <span aria-hidden>×</span>
          </CircleButton>
        </ModalDismissButton>
      </div>
      <h3 css={{ textAlign: 'center', fontSize: '2em' }}>{title}</h3>
      {children}
    </ModalContentsBase>
  )
}

export { Modal, ModalDismissButton, ModalOpenButton, ModalContents }
