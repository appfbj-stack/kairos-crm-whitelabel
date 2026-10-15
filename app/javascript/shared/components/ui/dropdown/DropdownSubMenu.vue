<script>
import KairosDropdownHeader from 'shared/components/ui/dropdown/DropdownHeader.vue';

export default {
  name: 'KairosDropdownMenu',
  componentName: 'KairosDropdownMenu',

  components: {
    KairosDropdownHeader,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<template>
  <li class="!mt-0.5">
    <ul class="!m-0">
      <KairosDropdownHeader v-if="title" :title="title" />
      <slot />
    </ul>
  </li>
</template>
