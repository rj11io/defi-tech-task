/* eslint-disable no-param-reassign */
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Api from './Api';

export const AuthStatus = {
  Loading: 0,
  SignedIn: 1,
  SignedOut: -1
};

let refreshTokenPromise = null;

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [authStatus, setAuthStatus] = useState(AuthStatus.Loading);
  const [logged, setLogged] = useState({});

  const expireSession = useCallback(() => {
    setAuthStatus(AuthStatus.SignedOut);
    setLogged({});
  }, []);

  const signIn = useCallback(
    (email, password, afterSignIn = () => {}) =>
      Api.post('/auth/login', { email, password }).then(async res => {
        setLogged(res.data);
        setAuthStatus(AuthStatus.SignedIn);
        return afterSignIn();
      }),
    []
  );

  const signOut = useCallback(
    async (afterSignOut = () => {}) => {
      expireSession();
      try {
        await Api.get('/auth/logout');
      } catch {
        // Local session cleanup must succeed even when the server session has expired.
      }
      return afterSignOut();
    },
    [expireSession]
  );

  const retryRT = useCallback((prevRequest, originalError) => {
    prevRequest.__isRetryRequest = true;

    if (!refreshTokenPromise) {
      refreshTokenPromise = Api.get('/auth/rt').finally(() => {
        refreshTokenPromise = null;
      });
    }

    return refreshTokenPromise.then(() => Api(prevRequest)).catch(() => Promise.reject(originalError));
  }, []);

  const refreshTokenInterceptor = useCallback(
    error => {
      const prevRequest = error?.config;
      const statusCode = error?.response?.status;
      const customErrorCode = error?.response?.data?.error;
      const requestUrl = prevRequest?.url || '';

      if (customErrorCode === 306 || customErrorCode === 307 || customErrorCode === 308) {
        expireSession();
        return Promise.reject(error);
      }

      // A missing session on the initial check is a normal signed-out state.
      // Do not try to refresh it, otherwise /auth/check -> /auth/rt can loop.
      if (requestUrl.endsWith('/auth/check') || requestUrl.endsWith('/auth/rt')) return Promise.reject(error);

      if (statusCode === 401 && !prevRequest?.__isRetryRequest) return retryRT(prevRequest, error);

      return Promise.reject(error);
    },
    [expireSession, retryRT]
  );

  const checkUserStatus = useCallback(
    () =>
      Api.get('/auth/check')
        .then(res => {
          if (res.data) {
            setLogged(res.data);
            setAuthStatus(AuthStatus.SignedIn);
          }
        })
        .catch(expireSession),
    [expireSession]
  );

  useEffect(() => {
    const responseInterceptor = Api.interceptors.response.use(res => res, refreshTokenInterceptor);
    return () => Api.interceptors.response.eject(responseInterceptor);
  }, [refreshTokenInterceptor]);

  useEffect(() => {
    if (authStatus === AuthStatus.Loading) checkUserStatus();
  }, [authStatus, checkUserStatus]);

  useEffect(() => {
    if (logged?.lang) i18n.changeLanguage(logged.lang.toLowerCase());
  }, [i18n, logged]);

  const exportedValue = useMemo(
    () => ({
      signOut,
      signIn,
      logged,
      setLogged,
      setAuthStatus,
      authStatus
    }),
    [authStatus, logged, signIn, signOut]
  );

  return <AuthContext.Provider value={exportedValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
