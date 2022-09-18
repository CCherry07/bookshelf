import { Dispatch, useCallback, useLayoutEffect, useReducer, useRef, useState } from "react"

export const useMounted = () => {
  const mountedRef = useRef(false)
  useLayoutEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
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
  // const [retry , setReTry] = useState<any>(() => () => ({}))
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

    data,
    error,
    setData,
    setError,
    rest,
    run,
  }
}
