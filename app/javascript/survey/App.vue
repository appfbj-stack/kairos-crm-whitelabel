<script>
import Response from './views/Response.vue';

export default {
  name: 'App',
  components: {
    Response,
  },
};
</script>

<template>
  <div id="app" dir="ltr" class="kairos-survey-wrap min-h-screen">
    <Response />
  </div>
</template>

<style lang="scss">
@import './assets/scss/kairos.scss';
</style>
