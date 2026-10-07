import { useRef } from "react";

export function useEvent<F extends Function>(fn: F): F {
  const fnRef = useRef<F>(fn);
  fnRef.current = fn;

  const memoizedFn = useRef<F>(undefined);
  if (!memoizedFn.current) {
    memoizedFn.current = function (this: any, ...args: any) {
      return fnRef.current.apply(this, args);
    } as any;
  }

  return memoizedFn.current!;
}
