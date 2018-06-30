<template>
  <div id="app" class="container">
    <router-view></router-view>

    <nav class="navbar navbar-light bg-light justify-content-end">
      <span class="navbar-text font-italic">
        PERT Three Point Estimation Demo, By Alin Eugen Deac
      </span>
    </nav>
  </div>
</template>

<script>
  export default {
      name: 'tpe'
  }
</script>

<style>
  /* CSS */
  @import "~bootstrap/dist/css/bootstrap.min.css";
  .estimations-list {
    margin-top: 3rem;
  }
</style>
