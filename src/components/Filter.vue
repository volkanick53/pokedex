<template>
  <div class="search-bar d-flex flex-column flex-lg-row justify-center my-5 py-5 ">
    <div class="w-lg-25 w-sm-100 mx-md-3 mb-3 mb-md-0">
      <v-text-field
        variant="outlined"
        v-model="this.searchQuery"
      ></v-text-field>
    </div>
    <v-btn
      class="mx-3 my-3 my-md-0 rounded"
      icon="mdi-magnify"
      color="red"
      size="large"
      @click="performSearch()"
    ></v-btn>
    <div class="search-text bg-green w-lg-25 w-sm-100   mx-3 pa-6 rounded-xl">
      <p>Search for a Pokemon by name or using its National Pokedex number.</p>
    </div>
  </div>

  <div class="filter-container" v-if="filterSection">
    <div class="d-flex align-center">
      <v-chip-group class="d-flex flex-wrap w-25 " multiple filter>
        <v-chip
          v-for="(type, index) in orderedTypes"
          :key="index"
          @click="typeSelect(type)"
          :class="'type-color-' + type.name"
          class="ma-2 max-width-50"
          :ripple="false"
        >
          <p>
            {{ type.name }}
          </p>
        </v-chip>
      </v-chip-group>
      
      
    </div>
    <v-btn prepend-icon="mdi-magnify" class="mb-2" color="red" @click="filterByType"
      >Search</v-btn
    >
  </div>

  <v-btn color="#5e5e5e" class="mb-2" @click="filterSection = !filterSection">
    Show Advanced Filter
  </v-btn>
</template>

<script>
import axios from "axios";

export default {
  props: {
    pokemons: Array,
  },
  emits: ["filterEvent", "searchEvent"],
  data() {
    return {
      types: [],
      filterSection: false,
      selectedType: [],
      filteredPokemons: [],
      searchQuery: "",
    };
  },
  methods: {
    async getTypes() {
      const response = await axios.get("https://pokeapi.co/api/v2/type");
      this.types = response.data.results;
      this.types.splice(-2, 2);
    },
    typeSelect(type) {
      const index = this.selectedType.indexOf(type);
      if (index === -1) {
        this.selectedType.push(type);
      } else {
        this.selectedType.splice(index, 1);
      }

      console.log(this.selectedType);
    },
    filterByType() {
      const filterTypes = this.selectedType.map((type) => type.name);
      this.filteredPokemons = this.pokemons.filter((pokemon) => {
        if (
          (filterTypes.length == 2 &&
            filterTypes.every((value) => pokemon.types.includes(value))) ||
          filterTypes == pokemon.types[0] ||
          filterTypes == pokemon.types[1] ||
          filterTypes.length == 0
        ) {
          return this.filteredPokemons;
        }
      });
      this.$emit("filterEvent", this.filteredPokemons);
    },
    performSearch() {
      this.filteredPokemons = this.pokemons.filter(
        (pokemon) =>
          pokemon.name.includes(this.searchQuery) ||
          pokemon.id.toString().includes(this.searchQuery)
      );
      this.$emit("searchEvent", this.filteredPokemons);
    },
  },
  computed: {
    orderedTypes() {
      return [...this.types].sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  mounted() {
    this.getTypes();
  },
};
</script>

<style scoped>
.filter-container {
  background-color: #5e5e5e;
  margin: auto;
  max-width: 800px; /* Adjust the max-width based on your design */
  padding: 15px; /* Adjust padding for better spacing */
}

@media only screen and (max-width: 600px) {
  

  .search-text,
  .filter-container {
    margin: auto;
    max-width: 100%; /* Take full width on smaller screens */
  }
}
@media only screen and (max-width:1280px) {
  .w-sm-100 {
    width: 100%;
  }
}
@media only screen and (min-width: 1280px) {
  .w-lg-25 {
    width: 25%;
  }
}
</style>
