<template>
  <div class="login">
    <div class="jumbotron mt-5">
      <h3>Login</h3>
      <div v-if="loggingIn">
        <img src="../assets/loading.svg" alt="">
      </div>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ this.errorMessage }}
      </div>
      <form v-if="!loggingIn" @submit.prevent="login()">
        <div class="form-group">
          <label for="username">Username</label>
          <input v-model="user.username"
                 type="text"
                 class="form-control"
                 id="username"
                 aria-describedby="usernameHelp"
                 placeholder="Enter username" required>
          <small id="usernameHelp"
                 class="form-text text-muted">
           Enter your username to login.
          </small>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input v-model="user.password"
                   type="password"
                   class="form-control"
                   id="password"
                   aria-describedby="passwordHelp"
                   placeholder="Password" required>
            <small id="passwordHelp"
                   class="form-text text-muted">
              Enter your password to login.
            </small>
          </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
const Joi = require('@hapi/joi');

const LOGIN_URL = 'http://localhost:5000/api/auth/login';

const schema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9_]+$'))
    .min(3)
    .max(20)
    .required(),
  password: Joi.string().trim().min(5).required(),
});

export default {
  name: 'Login',
  data: () => ({
    errorMessage: '',
    loggingIn: false,
    user: {
      username: '',
      password: '',
    },
  }),
  methods: {
    login() {
      this.errorMessage = '';
      if (this.validUser()) {
        this.loggingIn = true;
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        fetch(LOGIN_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }).then((result) => {
          // it worked! the entered valid info !
          localStorage.token = result.token;
          setTimeout(() => {
            this.loggingIn = false;
            this.$router.push('/dashboard');
          }, 1000);
        }).catch((error) => {
          setTimeout(() => {
            this.loggingIn = false;
            this.errorMessage = error.message;
          }, 1000);
        });
      }
    },
    validUser() {
      const { error } = schema.validate(this.user);
      if (!error) {
        return true;
      }
      if (error.message.includes('username')) {
        this.errorMessage = 'Username is invalid.';
      } else {
        this.errorMessage = 'Password is invalid.';
      }
      return false;
    },
  },
};
</script>

<style scoped>

</style>
