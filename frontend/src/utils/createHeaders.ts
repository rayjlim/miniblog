import { AUTH_HEADER, STORAGE_KEY } from '../constants';

export default function createHeaders () {
  const requestHeaders = new Headers();
  const token = window.localStorage.getItem(STORAGE_KEY) || '';
  requestHeaders.set(AUTH_HEADER, token);
  return requestHeaders;
}
