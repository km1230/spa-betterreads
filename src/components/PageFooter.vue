<template>
  <footer id="page-footer">
    <div class="content-container d-flex align-center justify-space-between">
      <!-- <img id="page-footer-logo" src="@/assets/library.png" alt="Base" />
      <div></div> -->
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class extends Vue {}
</script>

<style lang="scss">
#page-footer {
  background-color: white;
  position: absolute;
  bottom: 0%;
}
</style>
