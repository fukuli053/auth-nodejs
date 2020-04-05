<template>
  <div class="dashboard">
    <div class="jumbotron mt-5">
      <h1 class="display-3">Dashboard!</h1>
      <h1>Hello,{{ this.user.username }} !</h1>
      <button @click="logout()" class="btn btn-primary">Logout</button>
    </div>
  </div>
</template>

<script>

const API_URL = 'http://localhost:5000/';

export default {
  name: 'Dashboard',
  data: () => ({
    user: {},
  }),
  mounted() {
    fetch(API_URL, {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    }).then((res) => res.json())
      .then((result) => {
        if (result.user) {
          this.user = result.user;
        } else {
          this.logout();
        }
      });
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
};
</script>
