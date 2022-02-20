<template>
  <div class="login--app d-flex flex-column align-center justify-center">
    <div
      class="main d-flex align-center justify-center"
      :class="{
        'mt-10': ['md', 'lg', 'xl'].includes($vuetify.breakpoint.name),
        'mt-2': ['xs', 'sm'].includes($vuetify.breakpoint.name),
        'flex-row': $vuetify.breakpoint.name !== 'xs',
        'flex-column': $vuetify.breakpoint.name === 'xs'
      }"
    >
      <div
        class="description d-flex flex-column align-center justify-center"
      >
        <div class="main-image mb-1">
          <v-img
            v-if="this.$vuetify.theme.dark"
            src="./img/logoAgeticLight.png"
            max-width="140"
          />
          <v-img v-else src="./img/logoAgeticDark.png" max-width="140" />
        </div>
        <div class="text d-flex flex-column align-center justify-center">
          <v-container
            fluid
            :style="['md', 'lg', 'xl'].includes($vuetify.breakpoint.name)
            ? 'max-width: 75%; text-align: center' : 'text-align: center'"
          >
            <span class="primary--text fs10 font-weight-bold">
              {{ title }}
            </span>
          </v-container>
          <v-container
            fluid
            :style="['md', 'lg', 'xl'].includes($vuetify.breakpoint.name) ?
              'max-width: 80%; text-align: justify' : 'text-align: justify'"
            class="pt-3"
          >
            <span class="font-weight-light fs10">
              Esta seccion esta para colocar un texto medianamente largo,
              para explicar lo que hara el sistema y sobre los modulos que
              tendra dicho sistema.
            </span>
          </v-container>
        </div>
      </div>
      <v-divider vertical v-if="!['xs'].includes($vuetify.breakpoint.name)"/>
      <div class="credentials d-flex flex-column align-center justify-center" >
        <template v-if="!['xs'].includes($vuetify.breakpoint.name)">
          <span class="iniciar-sesion primary--text font-weight-medium">
            Iniciar Sesión
          </span>
          <v-container style="text-align: center">
            <div
              class="font-weight-light"
              style="margin: auto; max-width: 50%; width: 50%"
            >
              Ingresa con el usuario y contraseña.
              Si estas en el frontend base son ADMINISTRADOR / 123
            </div>
          </v-container>
        </template>
        <v-form
          lazy-validation
          ref="loginForm"
          class="d-flex flex-column align-center justify-center"
          :class="{
            'mt-5': $vuetify.breakpoint.name === 'xs'
          }"
        >
          <v-input-text-field
            @value="e => form.user = e"
            v-model="form.user"
            label="Usuario"
            :full-width="false"
            :autofocus="$vuetify.breakpoint.name !== 'xs'"
            @keypress.enter.native="loginWithCredentials"
            :width="300"
            :clearable="false"
            :rules="
              [val => !!val || 'El nombre del usuario no puede estar vacio']
            "
          >
          </v-input-text-field>
          <v-input-text-field
            @value="e => form.password = e"
            v-model="form.password"
            label="Contraseña"
            @keypress.enter.native="loginWithCredentials"
            :full-width="false"
            :width="300"
            v-on:append="() => showPassword = !showPassword"
            :append-icon="
              showPassword ? ICONS.visibility : ICONS.visibility_off
            "
            :type="!showPassword ? 'password' : 'text'"
            :rules="[val => !!val || 'La contraseña no puede estar vacio']"
          >
          </v-input-text-field>
          <v-btn
            color="primary"
            class="rounded-lg"
            depressed
            :loading="loadingCredentials"
            height="50"
            block
            :disabled="loadingCredentials"
            @click="loginWithCredentials"
          >
            <span
              class="font-weight-bold"
              style="text-transform: capitalize; font-size: 1rem"
            >
              Ingresar
            </span>
          </v-btn>
          <br>
          <v-btn
            color="secondary"
            class="rounded-lg"
            depressed
            height="50"
            block
            @click="loginCiudadania"
          >
            <span
              class="font-weight-bold"
              style="text-transform: capitalize; font-size: 1rem"
            >
              Login Ciudadania
            </span>
          </v-btn>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Auth from './mixins/auth';

const TITLE = 'informacion acerca del frontend base';
export default {
  mixins: [Auth],
  data() {
    return {
      title: TITLE,
      form: {
        user: null,
        password: null
      },
      loadingCredentials: null,
      showPassword: false,
      show: false
    };
  },
  mounted() {
    this.$nextTick(async () => {
      this.$vuetify.theme.dark = this.$storage.get('theme');
      if (this.$route.query?.code) {
        try {
          const request = {
            method: 'GET',
            url: `${this.$baseServer}usuarios/cuenta/perfil`,
            headers: {
              Authorization: `Bearer ${this.$route.query.code}`
            }
          };
          let credentials = await axios(request);
          credentials = {
            data: {
              datos: {
                ...credentials.data.datos,
                access_token: this.$route.query.code
              }
            }
          };
          await this.credentials(null, null, credentials.data);
        } catch (err) {
          this.$message.error(err.message);
        }
      } else {
        if (this.$route.path !== '/login') this.$router.push('/login');
      }
    });
  },
  methods: {
    loginWithCredentials() {
      if (this.$refs.loginForm.validate()) {
        this.credentials(this.form.user, this.form.password, null);
      } else {
        this.$message.error('Complete los campos obligatorios');
      }
    },
    loginCiudadania() {
      const urlCiudadania = `${process.env.VUE_APP_API_CIUDADANIA}/ciudadania-auth`;
      window.location.href = urlCiudadania;
    }
  }
};
</script>

<style lang="scss">
@import '../../scss/variables.scss';
.login--app {
  .main {
    margin-top: -40px;
      .credentials {
        .iniciar-sesion {
          font-weight: 500;
          font-size: 1.4rem;
          margin-bottom: 10px;
          max-width: 80% !important;
        }
      }
      .description {
        .text {
          margin: auto;
          span {
            user-select: none;
            &:first-child {
              font-weight: 500;
              font-size: 1.1rem;
              margin-top: 10px;
              margin-bottom: 10px;
            }
            &:last-child {
              font-size: 0.83rem;
            }
          }
        }
      }
  }
}
@media screen and (min-width: 601px) {
  .login--app {
    .header {
      background-position: top center;
      background-size: contain;
      width: 100%;
      height: 200px;
    }
    .main {
      .credentials {
        width: 50%;
      }
      .description {
        width: 50%;
        .text {
          width: 70%;
          span {
            user-select: none;
            &:first-child {
              text-align: center;
            }
            &:last-child {
              text-align: left;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 600px) and (min-width: 1px) {
  .login--app {
    .header {
      background-position: top center;
      background-size: contain;
      width: 100%;
      height: 200px;
    }
    .main {
      .credentials {
        width: 100%;
      }
      .description {
        width: 100%;
        .text {
          width: 85%;
          span {
            user-select: none;
            &:first-child {
              text-align: center;
            }
            &:last-child {
              text-align: justify;
            }
          }
        }
      }
    }
  }
}
</style>
