import React from "react";

const ReactInternals = React as typeof React & {
  __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE: unknown;
  __COMPILER_RUNTIME: unknown;
  unstable_useCacheRefresh: unknown;
};

export const { __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, __COMPILER_RUNTIME, unstable_useCacheRefresh } = ReactInternals;

export {
  Activity,
  Children,
  Component,
  cache,
  cacheSignal,
  cloneElement,
  createContext,
  createElement,
  createRef,
  Fragment,
  forwardRef,
  isValidElement,
  lazy,
  memo,
  Profiler,
  PureComponent,
  StrictMode,
  Suspense,
  startTransition,
  use,
  useActionState,
  useCallback,
  useContext,
  useDebugValue,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useId,
  useImperativeHandle,
  useInsertionEffect,
  useLayoutEffect,
  useMemo,
  useOptimistic,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  version,
} from "react";
export default React;
