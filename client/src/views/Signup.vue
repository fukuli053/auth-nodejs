<template>
  <div class="signup">
    <div class="jumbotron mt-5">
      <h3>Sign Up</h3>
      <div v-if="signingUp">
        <img src="../assets/loading.svg" alt="">
      </div>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ this.errorMessage }}
      </div>
      <form v-if="!signingUp" @submit.prevent="signup">
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
           Username must be longer than 2 characters, shorter than 20 characters.
          </small>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="password">Password</label>
            <input v-model="user.password"
                   type="password"
                   class="form-control"
                   id="password"
                   aria-describedby="passwordHelp"
                   placeholder="Password" required>
            <small id="passwordHelp"
                   class="form-text text-muted">
              Password must be longer than 5 characters.
            </small>
          </div>
          <div class="form-group col-md-6">
            <label for="confirmPassword">Confirm Password</label>
            <input v-model="user.confirmPassword"
                   type="password"
                   class="form-control"
                   id="confirmPassword"
                   aria-describedby="confirmPasswordHelp"
                   placeholder="Confirm Password" required>
            <small id="confirmPasswordHelp"
                   class="form-text text-muted">
              Please confirm your password.
            </small>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Sign Up</button>
      </form>
    </div>
  </div>
</template>
<script>
const Joi = require('@hapi/joi');

const SIGNUP_URL = 'http://localhost:5000/api/auth/signup';
const schema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9_]+$'))
    .min(3)
    .max(20)
    .required(),
  password: Joi.string().trim().min(5).required(),
  confirmPassword: Joi.string().trim().min(5).required(),
});

export default {
  name: 'Signup',
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  data: () => ({
    signingUp: false,
    errorMessage: '',
    user: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  }),
  methods: {
    signup() {
      this.errorMessage = '';
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        // User is valid! Lets send it to server from client.
        this.signingUp = true;
        fetch(SIGNUP_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
          // eslint-disable-next-line consistent-return
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }).then((result) => {
          setTimeout(() => {
            localStorage.token = result.token;
            this.signingUp = false;
            this.$router.push('/dashboard');
          }, 1000);
        }).catch((error) => {
          setTimeout(() => {
            this.signingUp = false;
            this.errorMessage = error.message;
          }, 1000);
        });
      }
    },
    validUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'Password must match.';
        return false;
      }
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
