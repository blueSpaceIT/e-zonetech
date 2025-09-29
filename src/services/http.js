import axios from 'axios';

function getToken() {
  const cname = 'token';
  if (typeof window !== 'undefined') {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }
  return '';
}

function removeToken() {
  if (typeof window !== 'undefined') {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
}

const baseURL = process.env.BASE_URL;
const http = axios.create({
  baseURL: baseURL + `/api`,
  timeout: 30000
});

http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (Boolean(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      // Only redirect in browser environments. On server, just reject so caller can handle.
      if (typeof window !== 'undefined' && window?.location?.replace) {
        try {
          window.location.replace('/auth/login');
        } catch (e) {
          // ignore navigation errors
        }
      }
    }
    return Promise.reject(error);
  }
);

export default http;
