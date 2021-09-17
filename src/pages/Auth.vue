<template>
    <q-page
    class="fullscreen row justify-center items-center"
    style="background: #fff;"
  >
  <div class="column q-pa-lg">
      <div class="row">
        <q-card square class="shadow-24" style="width:300px;height:400px;">
          <q-card-section class="login-screen">
            <h3 class="text-h6 text-white q-my-sm">Timesheet App</h3>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pa-md q-gutter-md">
              <p class="text-bold">Sign In with your Google Account to proceed.</p>
              <button @click="googleLogin" class="social-button">
                <img alt="Google Logo" src="../assets/google-logo.png">
              </button>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    </q-page>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'login',
  methods: {
    ...mapActions('auth', ['socialLogin']),
    googleLogin () {
      this.socialLogin()
    }
  }
}
</script>

<style>  /* "scoped" attribute limit the CSS to this component only */
  .login-screen {
    background: #488ee2;
  }
  button {
    margin-top: 20px;
    width: 10%;
    cursor: pointer;
  }
  p {
    margin-top: 40px;
    font-size: 13px;
  }
  p a {
    text-decoration: underline;
    cursor: pointer;
  }
  .social-button {
    width: 75px;
    background: white;
    padding: 10px;
    border-radius: 100%;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.2);
    outline: 0;
    border: 0;
  }
  .social-button img {
    width: 100%;
  }
</style>
