import { defineStore } from 'pinia';

export const useUserInfoStore = defineStore('userInfo', {
  state: () => ({
    setEmpCd: '',
    setEmpNm: '',
    setEmpNmx: '',
    setDepgNm: '',
    setDepgCd: '',
    setDeptCd: '',
    setDeptNm: '',
    setTitlCd: '',
    setTitlNm: '',
    setPstnCd: '',
    setPstnNm: '',
  }),
  getters: {},
  actions: {},
});
