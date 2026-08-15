// This function is web-only as native doesn't have a concept of server-side rendering.
export function useClientOnlyValue
  <S, C>(server: S, client: C): S | C {
  return client;
}
