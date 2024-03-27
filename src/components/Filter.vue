<template>
  <div
    class="search-container d-flex flex-column flex-lg-row justify-center my-5 py-5"
  >
    <!--Search Bar-->
    <div class="d-flex flex-column w-lg-25 w-sm-100 mx-md-3 mb-3 mb-md-0">
      <h3>Name or Number</h3>
      <v-card-text>
        <v-text-field
          placeholder="Search for a Pokemon by name or using its Pokedex number."
          variant="outlined"
          v-model="this.searchQuery"
          append-inner-icon="mdi-magnify"
          @click:append-inner="performSearch()"
          bg-color="#fff"
        ></v-text-field>
      </v-card-text>

      <p class="subtitle">
        Use the Advanced Search to explore Pokémon by type,size and more!
      </p>
    </div>
  </div>

  <div class="filter-container" v-if="filterSection">
    <div class="d-flex justify-space-between">
      <v-chip-group class="d-flex flex-wrap w-25" multiple filter>
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

      <div class="size-container d-flex flex-column justify-space-around w-50">
        <div>
          <h3 class="size-title">Height</h3>
          <ul class="size-list">
            <li
              class="icon"
              @click="selectSize('height_small')"
              :class="{ 'icon-highlight': isSizeSelected('height_small') }"
            >
              <span class="icons icon_filter_height_small"></span>
            </li>
            <li
              class="icon"
              @click="selectSize('height_medium')"
              :class="{ 'icon-highlight': isSizeSelected('height_medium') }"
            >
              <span class="icons icon_filter_height_medium"></span>
            </li>
            <li
              class="icon"
              @click="selectSize('height_large')"
              :class="{ 'icon-highlight': isSizeSelected('height_large') }"
            >
              <span class="icons icon_filter_height_large"></span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="size-title">Weight</h3>
          <ul class="size-list">
            <li
              class="icon"
              @click="selectSize('weight_small')"
              :class="{ 'icon-highlight': isSizeSelected('weight_small') }"
            >
              <span class="icons icon_filter_weight_small"></span>
            </li>
            <li
              class="icon"
              @click="selectSize('weight_medium')"
              :class="{ 'icon-highlight': isSizeSelected('weight_medium') }"
            >
              <span class="icons icon_filter_weight_medium"></span>
            </li>
            <li
              class="icon"
              @click="selectSize('weight_large')"
              :class="{ 'icon-highlight': isSizeSelected('weight_large') }"
            >
              <span class="icons icon_filter_weight_large"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <v-btn
      prepend-icon="mdi-magnify"
      class="mb-2"
      color="red"
      @click="filterByType"
      >Search</v-btn
    >
  </div>

  <v-btn color="#5e5e5e" class="mb-2" @click="filterSection = !filterSection">
    {{ filterSection ? "Hide" : "Show" }} Advanced Filter
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
      filterSection: true,
      selectedType: [],
      filteredPokemons: [],
      searchQuery: "",
      selectedSizes: [],
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
      const filterSizes = this.selectedSizes.map((size) => size);

      this.filteredPokemons = this.pokemons.filter((pokemon) => {
        if (filterSizes.includes("height_small") && pokemon.height < 3) {
          return this.filteredPokemons;
        } else if (
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
      console.log(filterSizes);
      console.log(filterTypes);
    },
    performSearch() {
      this.filteredPokemons = this.pokemons.filter(
        (pokemon) =>
          pokemon.name.includes(this.searchQuery) ||
          pokemon.id.toString().includes(this.searchQuery)
      );
      this.$emit("searchEvent", this.filteredPokemons);
    },
    selectSize(size) {
      const index = this.selectedSizes.indexOf(size);
      if (index === -1) {
        this.selectedSizes.push(size);
      } else {
        this.selectedSizes.splice(index, 1);
      }
      console.log(this.selectedSizes);
    },
    isSizeSelected(size) {
      return this.selectedSizes.includes(size);
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
@font-face {
  font-family: "icons";
  src: url("../assets/icons.woff") format("woff");
  /* Additional font-face properties */
}
.icons {
  font-family: "icons", sans-serif;
}

.filter-container {
  background-color: #616161;
  margin: auto;
  max-width: 800px;
  padding: 15px;
}
.search-container {
  background-color: #313131;
}
h3 {
  color: #fff;
}
.subtitle {
  color: #fff;
}

.icon_filter_height_large:before {
  content: "\f116";
}

.icon_filter_height_medium:before {
  content: "\f117";
}

.icon_filter_height_small:before {
  content: "\f118";
}

.icon_filter_weight_large:before {
  content: "\f119";
}

.icon_filter_weight_medium:before {
  content: "\f11a";
}

.icon_filter_weight_small:before {
  content: "\f11b";
}

.icon {
  float: left;
  width: 27.46%;
  background-color: #f2f2f2;
  border-radius: 12px;
  color: #313131;
  cursor: pointer;
  height: 100%;
  margin: 0 2%;
  overflow: hidden;
}

.size-list span {
  font-size: 300%;
  text-align: center;
  line-height: 80px;
  width: 100%;
}
.size-list span.icon_filter_height_large {
  font-size: 500%;
}

.size-title {
  color: #f2f2f2;
  text-align: left;
  margin: 0 2%;
  cursor: default;
}
.icon-highlight {
  background-color: #ee6b2f;
  color: #f2f2f2;
}

@media only screen and (max-width: 600px) {
  .search-text,
  .filter-container {
    margin: auto;
    max-width: 100%;
  }
}
@media only screen and (max-width: 1280px) {
  .w-sm-100 {
    width: 100%;
  }
}
</style>
