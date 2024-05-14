/*
export function someMutation (state) {
}
*/
export const updateDrawerState = (state, opened) => {
  state.drawerState = opened;
};

export const getUserNm = (state, opened) => {
  state.userNm = opened;
};
export const getUserNmx = (state, opened) => {
  state.userNmx = opened;
};

export const getEmpCd = (state, opened) => {
  state.empCd = opened;
};

export const getSalesCd = (state, opened) => {
  state.salesCd = opened;
};
export const getSalesNm = (state, opened) => {
  state.salesNm = opened;
};
export const getDeptCd = (state, opened) => {
  state.deptCd = opened;
};
export const getDeptNm = (state, opened) => {
  state.deptNm = opened;
};

export const getJobTitleCd = (state, opened) => {
  state.jobTitleCd = opened;
};
export const getJobTitleNm = (state, opened) => {
  state.jobTitleNm = opened;
};

// src/store/showcase/state.js
// Always use a function to return state if you use SSR
export default function () {
  return {
    drawerState: true,
  };
}
