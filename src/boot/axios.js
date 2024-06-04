import axios from 'axios';
import {ref} from 'vue';
import {boot} from "quasar/wrappers";
import {Cookies} from "quasar";

const api = axios.create({ baseURL: process.env.SERVER_URL })

export default boot(({ app, router }) => {
  api.interceptors.request.use(function (config) {
    //const token = Cookies.get('accessToken');
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      router.push('/')
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  api.interceptors.response.use(function (response) {
    return response;
  }, async function (error) {
    const originalRequest = error.config;

    //const accessToken = Cookies.get('accessToken');
    //const refreshToken = Cookies.get('refreshToken');
    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = sessionStorage.getItem('refreshToken');

    const form = ref({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post('/api/auth/reissue', form.value);

        // 새로운 토큰 저장
        //Cookies.remove('accessToken');
        //Cookies.remove('refreshToken');
        //Cookies.set('accessToken', res.data.data.accessToken, {expires: '60m'});
        //Cookies.set('refreshToken', res.data.data.refreshToken, {expires: 1});

        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');

        sessionStorage.setItem('accessToken', JSON.stringify(res.data.data.accessToken));
        sessionStorage.setItem('refreshToken', JSON.stringify(res.data.data.refreshToken));

        // 원래 요청의 헤더를 새 토큰으로 설정
        originalRequest.headers['Authorization'] = `Bearer ${res.data.data.accessToken}`;

        console.log(originalRequest)
        return api(originalRequest);
      } catch (error) {
        console.log('Refresh token failed:', error);
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  });
})

export { api }
