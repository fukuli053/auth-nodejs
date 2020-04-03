import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';

Vue.use(VueRouter);

const loginRedirectDashboard = (to, from, next) => {
  if (localStorage.token) {
    next('/dashboard');
  } else {
    next();
  }
};

const redirectLogin = (to, from, next) => {
  if (localStorage.token) {
    next();
  } else {
    next('/login');
  }
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    beforeEnter: loginRedirectDashboard,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: loginRedirectDashboard,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: redirectLogin,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
