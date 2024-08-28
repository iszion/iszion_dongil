<template>
  <div v-if="value">
    <q-avatar size="35px">
      <q-img :src="`https://hr.energyshop.co.kr/imagesThumbnail/${value}`" />
    </q-avatar>
  </div>
  <div v-else>
    <q-icon name="face" color="teal" size="md" />
  </div>
</template>

<script>
export default {
  setup(props) {
    let { value } = props.params;
    // console.log('component data: ', value);
    return { value };
  },
};
</script>
