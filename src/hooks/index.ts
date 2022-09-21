import { Dispatch, useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react"

export const useMounted = () => {
  const mountedRef = useRef(false)
  useLayoutEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
    }
    return ()=>{
      mountedRef.current = false
    }
  }, [])
  return mountedRef
}

export const useSafeDispatch = <T extends Record<string, any>>(dispatch: Dispatch<T>) => {
  const mountedRef = useMounted()
  return useCallback((...args: [T]) => {
    return mountedRef.current ? dispatch(...args) : void 0
  }, [])
}

type AsyncStatus = "idle" | "success" | "error" | "pending"

interface State<D> {
  status: AsyncStatus,
  data: D | null,
  error: { message: any } | null
}
const defaultInitialState: State<null> = { status: 'idle', data: null, error: null }
export const useAsync = <D>(initialState?: State<D>) => {
  const initialStateRef = useRef({
    ...defaultInitialState,
    ...initialState,
  })
  const [{ status, data, error }, unSafeDispatch] = useReducer((state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }), initialStateRef.current)
  const dispatch = useSafeDispatch<State<D>>(unSafeDispatch)

  const setData = useCallback((data: D) => dispatch({ data, status: "success", error: null }), [dispatch])
  const setError = useCallback((error: { message: any }) => dispatch({ error, data: null, status: "error" }), [dispatch])
  const rest = useCallback(() => dispatch({ status: "idle", data: null, error: null }), [dispatch])

  const run = useCallback((promise: Promise<D>) => {
    dispatch({ status: "pending", data: null, error: null })
    return promise.then(data => {
      setData(data)
      return data
    }, (err: { message: any }) => {
      setError(err)
      return Promise.reject(err)
    })
  }, [dispatch, setData, setError])

  return {
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
    status,
    data,
    error,
    setData,
    setError,
    rest,
    run,
  }
}

export const useLocalStorage = (localStorageKey: string, defaultValue: any = "", { serialize = JSON.stringify, deserialize = JSON.parse } = {}) => {
  const [state, setState] = useState(() => {
    const value = window.localStorage.getItem(localStorageKey)
    if (value) return deserialize(value)
    return (typeof defaultValue === "function") ? defaultValue() : defaultValue
  })
  const preKeyRef = useRef(localStorageKey)
  useEffect(() => {
    if (preKeyRef.current !== localStorageKey) {
      window.localStorage.removeItem(preKeyRef.current)
    }
    preKeyRef.current = localStorageKey
  }, [localStorageKey])

  useEffect(() => {
    window.localStorage.setItem(localStorageKey, serialize(state))
  }, [localStorageKey, state, serialize])
  return [state, setState]
}
