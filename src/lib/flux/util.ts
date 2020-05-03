export function action<T extends string, P>(type: T, payload: P) {
  return {
    type,
    payload,
  };
}

export type KnownActions<
  A extends Record<string, (...args: any[]) => any>
> = ReturnType<A[keyof A]>;

// reducer の網羅性検証を型安全に行うためのユーティリティ
export const unreduceable = (unknownAction: never) => void unknownAction;
