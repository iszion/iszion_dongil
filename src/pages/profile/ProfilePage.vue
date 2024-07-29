<template>
  <q-page padding>
    <q-card class="q-pa-xs">
      <q-card-section class="text-center q-pa-sm" :class="$q.dark.isActive ? 'bg-teal-7' : 'bg-teal-3'">
        <q-item-label class="text-h6">나의정보</q-item-label>
      </q-card-section>
      <q-card-section class="row q-col-gutter-x-xl q-py-md">
        <div class="col-12 col-sm-auto q-py-md flex flex-center">
          <div>
            <q-avatar square size="180px"> <q-img :src="`https://www.iszion.com/images/${formData.imageFileNm}`" /></q-avatar>

            <div class="row q-py-md">
              <q-avatar
                v-if="!formDisable"
                color="blue"
                text-color="white"
                icon="photo_camera"
                size="md"
                class="q-pa-none cursor-pointer"
                @click="handleImageUpload"
              />
              <q-space />
              <q-avatar
                v-if="!formDisable"
                color="red"
                text-color="white"
                icon="delete_forever"
                size="md"
                class="q-pa-none cursor-pointer"
                @click="handleImageDelete"
              />
            </div>
          </div>
        </div>
        <!--        <div class="col-12 col-sm-grow column justify-between">-->
        <div class="col-12 col-sm-grow justify-between q-gutter-y-md">
          <div class="row items-center">
            <span class="text-h5 text-weight-bold">{{ formData.empNm }}</span>
            <q-space />
            <div class="q-gutter-x-sm">
              <q-btn outline color="secondary" label="프로필 수정" />
              <q-btn outline color="secondary" label="패스워드 변경" @click="isDialogVisible = true" />
            </div>
          </div>
          <!--          <div class="q-gutter-x-lg">-->
          <!--            <span>{{ formData.empCd }}</span>-->
          <!--            <span>팔로워 2,000</span>-->
          <!--            <span>팔로우 3,000</span>-->
          <!--          </div>-->
          <div class="q-gutter-y-xs text-subtitle1">
            <div>
              사번 : <span class="text-bold text-orange"> {{ formData.empCd }}</span>
            </div>
            <div>
              소속 : <span class="text-bold text-orange"> {{ formData.deptNm }}</span>
            </div>
            <div>
              직위 : <span class="text-bold text-orange"> {{ formData.pstnNm }}</span>
            </div>
            <div>
              직급 : <span class="text-bold text-orange"> {{ formData.titlNm }}</span>
            </div>
            <div>
              전화 : <span class="text-bold text-orange"> {{ formData.mobile }}</span>
            </div>
            <div>
              메일 : <span class="text-bold text-orange"> {{ formData.email }}</span>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
  <q-dialog v-model="isDialogVisible" @show="onDialogShow" @hide="onDialogHide">
    <q-card flat bordered style="max-width: 520px; width: 100%">
      <q-card-section>
        <div class="text-h4 text-center text-weight-bold">패스워드 변경</div>
      </q-card-section>
      <q-card-section>
        <div class="text-center text-subtitle2 text-grey">패스워드 변경 시 다시 로그인합니다. 😊</div>
      </q-card-section>
      <q-card-section>
        <div class="q-px-xl q-mb-sm">
          <q-input v-model="form.oldPassword" :type="isPwd1 ? 'password' : 'text'" label="현재비밀번호" hint="현재 비밀번호를 입력하세요" class="">
            <template v-slot:append>
              <q-icon :name="isPwd1 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd1 = !isPwd1" />
            </template>
          </q-input>
        </div>
        <div class="q-gutter-y-sm q-pa-xl">
          <!--            class="q-mt-md"-->
          <q-input v-model="form.newPassword" :type="isPwd2 ? 'password' : 'text'" label="비밀번호" hint="새로운 패스워드를 입력하세요">
            <template v-slot:append>
              <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd2 = !isPwd2" />
            </template>
          </q-input>
          <q-input v-model="form.newPasswordX" :type="isPwd3 ? 'password' : 'text'" label="비밀번호(확인)" hint="다시한번 입력하세요">
            <template v-slot:append>
              <q-icon :name="isPwd3 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd3 = !isPwd3" />
            </template>
          </q-input>
        </div>
        <div class="row">
          <q-btn class="full-width q-mt-lg" unelevated color="primary" size="lg" label="변경하기" @click="passwordChangeSave" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useYearInfoStore } from 'src/store/setYearInfo';
import { useUserInfoStore } from 'src/store/setUserInfo';
import { api } from 'boot/axios';
import { QBtn, QIcon } from 'quasar';
import { AgGridVue } from 'ag-grid-vue3';
const storeUser = useUserInfoStore();
const storeYear = useYearInfoStore();

const isDialogVisible = ref(false);
const rowData = ref(null);
const formData = ref({
  empCd: '',
  empNm: '',
  deptCd: '',
  deptNm: '',
  pstnCd: '',
  pstnNm: '',
  titlCd: '',
  titlNm: '',
  mobile: '',
  email: '',
  imageFileNm: '',
});

const isPwd1 = ref(true);
const isPwd2 = ref(true);
const isPwd3 = ref(true);
const form = ref({
  oldPassword: '',
  newPassword: '',
  newPasswordX: '',
});

onBeforeMount(() => {
  getData().then(() => {
    formData.value = rowData.value;
  });
});

const onDialogShow = () => {};
const onDialogHide = () => {};

const passwordChangeSave = () => {
  if (form.value.oldPassword) {
    api
      .post('/api/sys/passwordCheck', {
        paramUserId: storeUser.setEmpCd,
        paramOldPassword: form.value.oldPassword,
        paramNewPassword: form.value.newPassword,
      })
      .then(res => {
        if (res.data.data.check) {
          alert('ok');
        } else {
          $q.notify({
            group: false,
            icon: 'report_problem',
            message: t('login_check_message'),
            color: 'negative',
            position: 'bottom-right',
          });
        }
      })
      .catch(res => {
        console.log(res);
        console.log('error1');
      });
  }
};
// **************************************************************//
// ***** DataBase 연결부분  ***************************************//
// **************************************************************//

// ***** 유저정보 처리 부분 *****************************//
const getData = async () => {
  try {
    const response = await api.post('/api/mst/mst1010_select', { paramStdYear: storeYear.setYear, paramEmpCd: storeUser.setEmpCd });
    rowData.value = response.data.data[0];
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
// ***** 유저정보 처리 부분 끝 *****************************//

const handleImageUpload = () => {
  // 파일 선택 대화 상자 열기
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*'; // 이미지 파일만 선택 가능하도록 설정 (선택 사항)
  input.onchange = event => {
    const file = event.target.files[0];
    console.log('File object: ', file);

    console.log('file name : ' + file.name);
    console.log('File type: ', file.type);
    console.log('File size: ', file.size);

    if (file) {
      // 파일이 선택된 경우, 여기에서 파일 업로드 로직을 추가할 수 있습니다.
      uploadFile(file);
    }
  };
  input.click();
};
const uploadFile = async file => {
  try {
    const param = new FormData();
    param.append('file', file); // 'file'은 서버에서 받는 파라미터 이름
    param.append('empCd', formData.value.empCd);
    const response = await api.post('/api/mst/mst1010_fileSave', param, {
      headers: {
        'Content-Type': 'multipart/form-data', // 파일 업로드를 위한 헤더
      },
    });
    // 서버의 응답 처리

    console.log('File uploaded successfully:', response.data);
  } catch (error) {
    // 오류 처리
    console.error('Error uploading file:', error);
  }
};

const handleImageDelete = async () => {
  const response = await api.delete('/api/mst/mst1010_fileDelete', {
    params: {
      filename: formData.value.imageFileNm,
      empCd: formData.value.empCd,
    },
  });
  console.log('delete : ' + response);
};
</script>

<style lang="scss" scoped>
.q-page {
  background-color: #fafafa;
}
</style>
