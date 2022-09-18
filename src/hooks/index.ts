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

// type AsyncStatus = "idle" | "success" | "error" | "panding"
// interface AsyncType<D> {
//   status: AsyncStatus,
//   data: D | null,
//   error: { message: any } | null
// }
// export const useAsync = <D>(promise: Promise<D>) => {
//   const [status, unSafeDispatch] = useReducer((state: AsyncType<D>, action: { type: AsyncStatus, status: AsyncStatus, data: D | null, error: { message: any } | null }): AsyncType<D> => ({ ...state, ...action }), {
//     status: "idle",
//     data: null,
//     error: null
//   })
//   const [fn, setFn] = useState<any>(() => () => ({}))
//   const dispatch = useSafeDispatch(unSafeDispatch)

//   const run = useCallback((fn: () => Promise<D>) => {
//     setFn(fn)
//     const promise = fn()
//     useEffect(() => {
//       dispatch({ type: "panding", status: "panding", data: null, error: null })
//       promise.then(res => {
//         dispatch({ type: "success", status: "success", data: res, error: null })
//       }, (err: { message: any }) => dispatch({ type: "error", status: "error", error: err, data: null }))
//     }, [promise])
//     return () => {
//       setFn(() => ({}))
//       dispatch({
//         type: "idle",
//         status: "idle",
//         data: null,
//         error: null
//       })
//     }
//   }, [])

//   const retry = useCallback(() => run(fn), [fn])

//   return {
//     ...status,
//     run,
//     retry
//   }
// }

// interface useHttpProps {
//   src: string,
//   payload: Record<string, any>,
//   config: any
// }

// export const useHttp = ({ src, payload, config }: useHttpProps) => {
  
// }
