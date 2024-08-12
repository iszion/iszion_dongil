<template>
  <div v-if="value">
    <!--    <q-img :src="`https://hr.energyshop.co.kr/images/${value}`" />-->
    <q-img :src="`https://www.iszion.com/images/${value}`" />
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
