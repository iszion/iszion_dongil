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

export const getDeptCd = (state, opened) => {
  state.deptCd = opened;
};
export const getDeptNm = (state, opened) => {
  state.deptNm = opened;
};

// src/store/showcase/state.js
// Always use a function to return state if you use SSR
export default function () {
  return {
    drawerState: true,
  };
}
