import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import "./assets/style.css";
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import PokemonList from "./components/PokemonList.vue";
import PokemonDetails from "./components/PokemonDetails.vue";
import FavoritePokemons from "./components/FavoritePokemons.vue"

import App from "./App.vue";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/pokemon/:id", component: PokemonDetails, props: true },
    { path: "/", component: PokemonList },
    {path: "/favoritepokemons", component: FavoritePokemons}
  ],
});

const app = createApp(App);
app.use(router);
app.use(vuetify)



app.mount("#app");
