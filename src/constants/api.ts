/** Edit this to point at your backend (must include `/api` prefix). */
export const API_BASE_URL = 'http://192.168.0.154:3001/api';

/** Origin for uploaded assets (`consultant/...` paths from API). */
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');
