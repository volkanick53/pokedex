<template>
  <div class="pokedex-container">
    <Filter
      :pokemons="pokemons"
      @filterEvent="handleFilteredPokemons"
      @searchEvent="handleSearch"
    ></Filter>

    <div class="container-fluid">
      <!-- Region Section-->
      <Region :pokemons="pokemons" @regionEvent="handleRegionFilter"></Region>
      <!--Sorting Section-->
      <div>
        <h4>Sort By</h4>
        <v-select v-model="sort" :items="sorts"></v-select>
      </div>
      <!--Loader-->
      <v-row>
        <v-col v-for="index in 3" :key="index" cols="12" sm="6" md="4" lg="4">
          <v-skeleton-loader
            v-if="this.isLoading"
            type="card"
          ></v-skeleton-loader>
        </v-col>
      </v-row>

      <!-- Display Pokemons -->
      <div class="d-flex align-center justify-space-around flex-wrap">
        <v-card
          class="w-xl-25 w-sm-48 w-md-48 w-lg-32 ma-3 rounded-xl"
          hover
          :class="'background-color-' + pokemon.types[0]"
          v-for="pokemon in displayedPokemons"
          :key="pokemon.id"
        >
          <!--Favorite Button-->
          <v-btn
            @click="addToLocalStorage(pokemon)"
            :icon="pokemon.favorite ? 'mdi-heart' : 'mdi-heart-outline'"
          ></v-btn>
          <!-- Pokemon Cards -->
          <router-link :to="'/pokemon/' + pokemon.id">
            <div>
              <img :src="pokemon.image" :alt="pokemon.name" />
              <p># {{ pokemon.id }}</p>

              <h5>{{ pokemon.name }}</h5>
              <div class="types-container">
                <div
                  v-for="(type, index) in pokemon.types"
                  :key="index"
                  :class="'type-color-' + type"
                  class="type-pill"
                >
                  {{ type }}
                </div>
              </div>
            </div>
          </router-link>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Filter from "./Filter.vue";
import Region from "./Region.vue";

export default {
  components: { Filter, Region },
  emits: ["favoriteEvent"],
  data() {
    return {
      pokemons: [],
      regionPokemons: [],
      filteredPokemons: [],
      isLoading: false,
      lastClickedRegion: null,
      favoritePokemons: [],
      sorts: ["Lowest Number(First)", "Highest Number(First)", "A-Z", "Z-A"],
      sort: "Lowest Number(First)",
    };
  },

  methods: {
    async fetchPokemons() {
      this.isLoading = true;
      const pokemonResponse = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=1017"
      );

      const pokemonList = pokemonResponse.data.results;

      const detailedPokemonRequests = pokemonList.map((pokemon) =>
        axios.get(pokemon.url)
      );
      const detailedPokemonResponses = await Promise.all(
        detailedPokemonRequests
      );

      this.pokemons = await Promise.all(
        detailedPokemonResponses.map(async (response) => {
          const speciesResponse = await axios.get(response.data.species.url);
          const pokemon = {
            name: response.data.name,
            types: response.data.types.map((typeData) => typeData.type.name),
            id: response.data.id,
            image: response.data.sprites.front_default,
            generation: speciesResponse.data.generation.name,
            weight: response.data.weight,
            height: response.data.height,
            favorite: false,
          };
          const isFavorite = this.favoritePokemons.some(
            (favPokemon) => favPokemon.id === pokemon.id
          );
          if (isFavorite) {
            pokemon.favorite = true;
          }

          return pokemon;
        })
      );

      this.filteredPokemons = [...this.pokemons];
      this.isLoading = false;
      console.log(this.isLoading);
    },

    handleRegionFilter(regionFilter, lastRegion) {
      this.regionPokemons = regionFilter;
      this.lastClickedRegion = lastRegion;
    },

    handleFilteredPokemons(filteredPokemons) {
      this.filteredPokemons = filteredPokemons;
    },

    handleSearch(searchedPokemons) {
      this.filteredPokemons = searchedPokemons;
    },

    addToLocalStorage(pokemon) {
      // Check if the item already exists
      const pokemonExist = this.favoritePokemons.some(
        (pokemons) => pokemons.id === pokemon.id
      );
      if (pokemonExist) {
        // Item exists, remove it from the array
        this.favoritePokemons = this.favoritePokemons.filter(
          (item) => item.id !== pokemon.id
        );
        pokemon.favorite = false;
      } else {
        // Item doesn't exist, add it to the array
        this.favoritePokemons.push(pokemon);

        pokemon.favorite = true;
      }

      // Save the updated array back to local storage
      localStorage.setItem(
        "favoritePoke",
        JSON.stringify(this.favoritePokemons)
      );
      const favoriteLength = this.favoritePokemons.length;
      this.$emit("favoriteEvent", favoriteLength);

      console.log(this.favoritePokemons);
    },

    sortPokemons() {
      return this.filteredPokemons.slice().sort((a, b) => {
        let result = 0;
        if (this.sort === "Lowest Number(First)") {
          result = a.id - b.id;
        } else if (this.sort === "Highest Number(First)") {
          result = b.id - a.id;
        } else if (this.sort === "A-Z") {
          result = a.name.localeCompare(b.name);
        } else if (this.sort === "Z-A") {
          result = b.name.localeCompare(a.name);
        }
        return result;
      });
    },
  },

  computed: {
    displayedPokemons() {
      return this.lastClickedRegion ? this.regionPokemons : this.sortPokemons();
    },
  },

  mounted() {
    // Retrieve existing items from local storage
    this.favoritePokemons =
      JSON.parse(localStorage.getItem("favoritePoke")) || [];

    const favoriteLength = this.favoritePokemons.length;
    this.$emit("favoriteEvent", favoriteLength);
  },

  created() {
    this.fetchPokemons();
  },
};
</script>

<style scoped>
@import "../assets/colors.css";
img {
  width: 100px;
  max-width: 150px;
}
.pokedex-container {
  background: #fff url(../assets/container_bg.png);
  opacity: 1;
  max-width: 1280px;
  margin: 0 auto;
}

.container-fluid {
  max-width: 1024px;
  width: 100%;
  background: #fff;
  margin: auto;
}

a {
  text-decoration: none;
  color: black;
}
a:visited {
  color: black;
}
a h5 {
  text-transform: uppercase;
}
@media only screen and (min-width: 576px) {
  .w-sm-48 {
    width: 48%;
  }
}

@media only screen and (min-width: 768px) {
  .w-md-48 {
    width: 48%;
  }
}

@media only screen and (min-width: 992px) {
  .w-lg-32 {
    width: 32%;
  }
}
@media only screen and (min-width: 992px) {
  .w-xl-25 {
    width: 25%;
  }
}
</style>
