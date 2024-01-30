<template>
  <div class="d-flex justify-space-evenly my-3">
    <v-btn-toggle divided color="blue" class="regions">
      <v-btn
        class="px-6 py-3"
        @click="filterPokeByRegion(region)"
        v-for="region in regions"
        :key="region.id"
        variant="text"
        size="large"
      >
        <p>
          {{ region.regionName }}
        </p>
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
import axios from "axios";

export default {
    props: ['pokemons'],
  emits: ["regionEvent"],
  data() {
    return {
      regions: [],
      regionPokemons: [],
      lastClickedRegion: null,
    };
  },
  methods: {
    async fetchRegion() {
      const regionResponse = await axios.get(
        "https://pokeapi.co/api/v2/generation"
      );
      const regionList = regionResponse.data.results;
      const detailedRegionrequests = regionList.map((region) =>
        axios.get(region.url)
      );
      const detailedRegionResponses = await Promise.all(detailedRegionrequests);
      this.regions = detailedRegionResponses.map((response) => ({
        regionName: response.data.main_region.name,
        generationName: response.data.name,
      }));

    },
    filterPokeByRegion(region) {
      this.regionPokemons = [];
      if (region.regionName === this.lastClickedRegion) {
        this.lastClickedRegion = null;
      } else {
        this.lastClickedRegion = region.regionName;

        this.pokemons.forEach((pokemon) => {
          if (pokemon.generation == region.generationName) {
            return this.regionPokemons.push(pokemon);
          }
        });
        
      }
      this.$emit(
        "regionEvent",
        this.regionPokemons,
        this.lastClickedRegion
      );
    },
  },
  mounted() {
    this.fetchRegion();
  },
};
</script>

<style scoped>

.regions{
  max-width: max-content;
  min-width: auto;
  overflow: visible;
}


</style>
