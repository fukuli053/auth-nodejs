<template>
  <div class="home">
    <div class="jumbotron mt-5">
      <h1 class="display-3">Hello, world!</h1>
      <p class="lead">
        This is a simple node.js authentication app.
        It used Express, MongoDB and JWT.</p>
      <hr class="my-4">
      <p>Furkan Ergün - Sakarya University - furkanergun.com</p>
      <p class="lead">
        <router-link
          class="btn btn-primary btn-lg"
          role="button"
          :to=" {name: 'Signup' }">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
};
</script>
