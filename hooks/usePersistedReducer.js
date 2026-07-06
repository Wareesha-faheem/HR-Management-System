"use client";

import { useEffect, useReducer, useState } from "react";
import { loadState, saveState } from "@/utils/storage";

// useReducer that hydrates its initial state from localStorage on mount
// and persists every subsequent change back to it.
//
// Why `hydrated` is state (not a ref): the hydrate-dispatch and the
// "we're ready now" flag must land in the SAME render. If "ready" were a
// ref, it would flip to true synchronously inside the mount effect while
// `state` in that same effect's closure is still the pre-hydration default
// — and the save-effect below would fire immediately afterwards with that
// stale default, overwriting the very data we just loaded. Using state for
// both means React batches them into a single re-render, so the save-effect
// only ever runs after the hydrated data is actually in `state`.
export function usePersistedReducer(reducer, defaultState, storageKey) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persisted = loadState(storageKey, null);
    if (persisted) {
      dispatch({ type: "__HYDRATE__", payload: persisted });
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveState(storageKey, state);
    }
  }, [state, hydrated, storageKey]);

  return [state, dispatch];
}
