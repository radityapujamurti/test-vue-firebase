import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import firebase from 'firebase'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
var firebaseui = require('firebaseui');

Vue.use(Vuetify)

// const firebase = require("firebase");
require("firebase/firestore");
var config = {
  //configure firebase here
};
firebase.initializeApp(config);

var db = firebase.firestore();
window.db = db;
// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
});

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

