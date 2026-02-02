import axios, { AxiosInstance } from 'axios';

import { type HttpClientMinState } from '../type';

export const createHttpClient = () => {
  const httpClient = axios.create();
  return httpClient;
};

export const setupHttpInterceptors = (
  httpClient: AxiosInstance,
  httpClientMinState: HttpClientMinState,
) => {
  httpClient.interceptors.request.use((config) => {
    const { user, authTokenVersion } = httpClientMinState;
    if (user) {
      const { accessToken } = user;
      const authHeaders = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

      (config as any).headers = {
        ...config.headers,
        ...authHeaders,
      };
      (config as any)._authTokenVersion = authTokenVersion;
    }

    return config;
  });

  httpClient.interceptors.response.use(undefined, async (err) => {
    const { config, response } = err;
    const statusCode = +response.status;

    // const result = await guardApi(
    //   Api.authApi.refreshToken(
    //     {
    //       refreshToken,
    //     },
    //     {
    //       _skipExchange: true,
    //     },
    //   ),
    // );

    // if 401 and token expired?
    if (statusCode === 401 && !config._retried && !config._skipExchange) {
      config._retried = true;
      // console.log(
      //   'Exchange and retry - ',
      //   config._authTokenVersion,
      //   httpClientMinState.authTokenVersion,
      // );

      // await exchange the token only once.
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      config._authTokenVersion === httpClientMinState.authTokenVersion &&
        (await httpClientMinState.exchangeOnlyOnce());

      return httpClient(config);
    }

    // if status is 400 & user is deactivated then logout
    if (statusCode === 400 && response?.data?.actions?.authFail === true) {
      try {
        httpClientMinState.logout();
      } catch (e) {
        console.error('Logout error', e);
        //
      }
    }

    // if 401
    if (statusCode === 401) {
      try {
        // console.log(config.url, ' logout');
        //  logout only once
        httpClientMinState.logout();
      } catch (e) {
        console.error('Logout error', e);
        //
      }
    }
    throw err;
    // return err(e);
  });
};
