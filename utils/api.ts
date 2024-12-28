export const useFetchUserGet = (nameOrId: number | string) =>
  useFetch<Profile, ErrorResponse>(`/api/account/profile/${nameOrId}`);
