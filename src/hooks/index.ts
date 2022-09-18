import { Dispatch, useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react"

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
    if (mountedRef.current) {
      dispatch(...args)
    }
  }, [])
}

type AsyncStatus = "idle" | "success" | "error" | "panding"
interface AsyncType<D> {
  status: AsyncStatus,
  data: D | null,
  error: { message: any } | null
}
const defaultInitialState = { status: 'idle', data: null, error: null }
export const useAsync = <D>(initialState?: AsyncType<D>) => {
  const initialStateRef = useRef({
    ...defaultInitialState,
    ...initialState,
  })
  const [status, unSafeDispatch] = useReducer((state: any, action: any) => ({ ...state, ...action }), initialStateRef)
  const [fn, setFn] = useState<any>(() => () => ({}))
  const dispatch = useSafeDispatch<AsyncType<D>>(unSafeDispatch)

  const setData = useCallback((data: D) => dispatch({ data, status: "success", error: null }), [dispatch])
  const setError = useCallback((error: { message: any }) => dispatch({ error, data: null, status: "error" }), [dispatch])
  const rest = useCallback(() => dispatch({ status: "idle", data: null, error: null }), [dispatch])

  const run = useCallback((promise: Promise<D>) => {
    setFn(fn)
    useEffect(() => {
      dispatch({ status: "panding", data: null, error: null })
      promise.then(res => {
        setData(res)
      }, (err: { message: any }) => setError(err))
    }, [promise])

    return () => {
      setFn(() => ({}))
      dispatch({
        status: "idle",
        data: null,
        error: null
      })
    }
  }, [])

  const retry = useCallback(() => run(fn), [fn])

  return {
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',

    setData,
    setError,
    rest,
    run,
    retry
  }
}
