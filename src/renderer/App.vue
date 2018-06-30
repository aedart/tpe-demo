<template>
  <div id="app" class="container">

    <!-- Print -->
    <div class="row justify-content-end">
      <div class="col-auto">
          <button
                  class="btn btn-link"
                  title="Print this estimate"
                  v-on:click="printEstimate"
          >
            Print
          </button>
      </div>
    </div>

    <!-- Pages -->
    <router-view></router-view>

    <!-- App. title and author -->
    <nav class="navbar navbar-light bg-light justify-content-end">
      <span class="navbar-text font-italic">
        PERT Three Point Estimation Demo, By Alin Eugen Deac
      </span>
    </nav>
  </div>
</template>

<script>
  export default {
      name: 'tpe',
      methods: {
          printEstimate () {
              print()
          }
      }
  }
</script>

<style>
  /* CSS */
  @import "~bootstrap/dist/css/bootstrap.min.css";
  .estimations-list {
    margin-top: 0.1rem;
  }
  .estimation-list--date {
    text-align: right;
  }

  @media print {
    button {
      display: none !important;
    }

    .alert {
      display: none;
    }

    .estimation-list--new-task-form {
      display: none;
    }
  }
</style>
