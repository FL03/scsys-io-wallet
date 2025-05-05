// sources.ts

/** A basic state for implemented hooks; */
export type HookState = {
  isLoading: boolean;
}

export type HookStateExt = HookState & { [key: string]: boolean | string | number }

export type StatefulHook<TState> = TState & HookStateExt;
/** This type describes the standard callback pattern for all implemented hooks within the project. */
export type HookCallback<TOpts, TOut> = (options?: TOpts) => TOut;