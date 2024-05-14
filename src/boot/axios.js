import axios from 'axios';
import {ref} from 'vue';
import {boot} from "quasar/wrappers";

const api = axios.create({ baseURL: process.env.SERVER_URL })

export default boot(({ app, router }) => {
  api.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  api.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    const originalRequest = error.config;
    const data = localStorage.getItem('token');
    const accessObject = JSON.parse(data);

    const form = ref({
      accessToken: accessObject.accessToken,
      refreshToken: accessObject.refreshToken,
    });

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + form.value.accessToken
      }

      try {
        api.post('/api/auth/reissue', form.value, {headers})
          .then(res => {
            localStorage.removeItem('token');
            localStorage.setItem('token', JSON.stringify(res.data.data))
          }).catch(error => {
          console.log("res error ==> " + error)
        })

        return api(originalRequest);
      } catch (error) {
        console.log('Refresh token failed:', error);
        return Promise.reject(error);
      }
    }
  });
})

export { api }
