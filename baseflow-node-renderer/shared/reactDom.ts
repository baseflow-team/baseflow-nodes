import ReactDom from "react-dom";

const ReactDomExports = ReactDom as typeof ReactDom & {
  __DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE: unknown;
};

export const {
  __DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
  createPortal,
  flushSync,
  preconnect,
  prefetchDNS,
  preinit,
  preinitModule,
  preload,
  preloadModule,
  requestFormReset,
  unstable_batchedUpdates,
  useFormState,
  useFormStatus,
  version,
} = ReactDomExports;
export default ReactDom;
