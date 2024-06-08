<template>
  <q-page>
    <div class="row">
      <div class="col-sm-6 col-md-8 col-lg-9" :class="leftColStyle">
        <q-img height="100vh" src="~assets/images/bg_login.png" />
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3 flex flex-center q-pt-xs-xl q-px-xl" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
        <q-card flat :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
          <q-card-section class="q-mb-xl">
            <q-item-label>
              <div class="row">
                <q-avatar square class="q-mr-sm" size="md">
                  <q-img src="/src/assets/images/dongil_logo.png" />
                </q-avatar>
                <div class="self-center"><span class="text-h5 text-weight-bold">동일석유주식회사</span><br /></div>
                <span class="text-weight-bold self-center q-mt-md" style="font-size: 1.92em">{{ $t('project_name') }}</span>
              </div>
            </q-item-label>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-y-lg">
              <q-input
                ref="userId"
                label-color="orange"
                color="orange"
                :label="$t('login_id')"
                :hint="$t('login_id_hint')"
                v-model="form.id"
                lazy-rules
                :rules="[val => !!val || $t('login_id_hint')]"
              ></q-input>
              <!--            class="q-mt-md"-->
              <q-input
                ref="passWd"
                label-color="orange"
                color="orange"
                type="password"
                :label="$t('login_password')"
                :hint="$t('login_password_hint')"
                v-model="form.id"
                lazy-rules
                :rules="[val => !!val || $t('login_password_hint')]"
              ></q-input>
              <q-toggle v-model="form.idSave" :label="$t('login_id_save')" />
              <q-btn type="submit" class="full-width q-mt-xl" unelevated color="primary" size="lg" :label="$t('login_button')" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <footer-bar />
  </q-page>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import FooterBar from 'layouts/FooterBar.vue';
import { useQuasar, Cookies, SessionStorage } from 'quasar';
import { api } from '/src/boot/axios';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const $q = useQuasar();
const leftColStyle = computed(() => ({ hidden: $q.screen.lt.sm }));
const router = useRouter();
import { useUserInfoStore } from 'src/store/setUserInfo';
const storeUser = useUserInfoStore();

const userId = ref(null);
const passWd = ref(null);
const form = ref({
  id: '',
  password: '',
  idSave: false,
});

const onSubmit = () => {
  form.value.password = form.value.id;
  if (form.value.id !== true) {
    idToStorageSave();
    api
      .post('/api/auth/login', form.value, {})
      .then(res => {
        if (res.data.data.accessToken && res.data.state === 200) {
          sessionStorage.setItem('accessToken', JSON.stringify(res.data.data.accessToken));
          sessionStorage.setItem('refreshToken', JSON.stringify(res.data.data.refreshToken));
          router.push({ path: '/main' });
          try {
            SessionStorage.set('empCd', form.value.id);
          } catch (e) {
            // data wasn't successfully saved due to
            // a Web Storage API error
          }
          router.push({ path: '/main' });
        } else {
          $q.notify({
            group: false,
            icon: 'report_problem',
            message: t('login_check_message'),
            color: 'negative',
            position: 'bottom-right',
          });
        }

        return res.data.data;
      })
      .catch(res => {
        console.log('error');
      });
  }
};

const idToStorageSave = () => {
  if (form.value.idSave) {
    $q.localStorage.set('idSave', form.value.id);
  } else {
    $q.localStorage.set('idSave', '');
  }
};

onBeforeMount(() => {
  form.value.id = $q.localStorage.getItem('idSave');
  form.value.idSave = !!form.value.id;

  if (form.value.idSave) {
    setTimeout(() => {
      passWd.value.focus();
    }, 100);
  } else if (form.value.idSave) {
    setTimeout(() => {
      compCd.value.focus();
    }, 100);
  }
});
</script>
