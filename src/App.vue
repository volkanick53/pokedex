<template>
  <v-layout class="my-6">
    <v-app-bar color="#333">
      <v-row align="center" justify="space-between">
        <v-col xs="12" md="6">
          <router-link :to="'/'">
            <img src="./assets/logo-pokemon.png" alt="" class="mx-auto" />
          </router-link>
        </v-col>

        <v-col xs="12" md="6">
          <router-link :to="'/favoritepokemons'">
            <v-btn color="red">
              <v-icon>mdi-heart</v-icon>
              Favorites({{ favoritePokemonLength }})
            </v-btn>
          </router-link>
        </v-col>
      </v-row>
    </v-app-bar>
  </v-layout>
  <router-view @favoriteEvent="handleFavoriteEvent"></router-view>
</template>

<script>
import PokemonList from "./components/PokemonList.vue";
export default {
  name: "App",
  components: { PokemonList },
  data() {
    return {
      favoritePokemonLength: Number,
    };
  },

  methods: {
    handleFavoriteEvent(data) {
      this.favoritePokemonLength = data;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background: #424242 url(./assets/body_bg.png);
}
</style>
