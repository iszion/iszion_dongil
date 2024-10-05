<template>
  <div v-if="value">
    <q-select
      dense
      options-dense
      v-model="value.teamCd"
      :options="valueOptions"
      option-value="commCd"
      option-label="commNm"
      emit-value
      map-options
      @update:model-value="handleUpdate"
    />
  </div>
  <div v-else></div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['params']);
const value = ref(props.params.data);
const { updateSelectedValue, valueOptions } = props.params;

const handleUpdate = () => {
  updateSelectedValue(value);
};
</script>
