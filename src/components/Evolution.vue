<template>
  <div class="evo-container">
    <h4 class="title">Evolutions:</h4>

    <div class="d-flex flex-wrap justify-space-around align-center">
      <div
        v-for="(evolution, index) in evolutionDetails"
        :key="index"
        class="evo"
        @click="reloadPage"
      >
        <router-link :to="'/pokemon/' + evolution.id">
          <img :src="evolution.image" alt="" class="image" />
          <p class="evo-name">
            {{ evolution.name }}
            <span class="pokemon-number">#{{ evolution.id }}</span>
          </p>
          <div class="types-container">
            <div
              v-for="(type, typeIndex) in evolution.types"
              :key="typeIndex"
              :class="'type-color-' + type"
              class="type-pill"
            >
              {{ type }}
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["id"],
  data() {
    return {
      evolutionDetails: [],
    };
  },
  methods: {
    async fetchEvolutionData() {
      const speciesResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon-species/${this.id}`
      );
      this.pokeSpecies = speciesResponse.data;

      const pokeEvolutionRequest = await axios.get(
        this.pokeSpecies.evolution_chain.url
      );
      console.log(pokeEvolutionRequest);

      const firstImg = pokeEvolutionRequest.data.chain.species.url;
      const firstId = firstImg.split("/").slice(-2, -1)[0];
      const firstResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${firstId}`
      );

      const firstEvolution = {
        image: firstResponse.data.sprites.front_default,
        name: pokeEvolutionRequest.data.chain.species.name,
        types: firstResponse.data.types.map((typeData) => typeData.type.name),
        id: firstResponse.data.id,
      };
      this.evolutionDetails.push(firstEvolution);

      //check if there is a second evolution

      if (pokeEvolutionRequest.data.chain.evolves_to.length > 0) {
        const secondImg =
          pokeEvolutionRequest.data.chain.evolves_to[0].species.url;
        const secondId = secondImg.split("/").slice(-2, -1)[0];
        const secondResponse = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${secondId}`
        );
        const secondEvolution = {
          image: secondResponse.data.sprites.front_default,
          name: pokeEvolutionRequest.data.chain.evolves_to[0].species.name,
          types: secondResponse.data.types.map(
            (typeData) => typeData.type.name
          ),
          id: secondResponse.data.id,
        };
        this.evolutionDetails.push(secondEvolution);

        //check if third evolution is possible
        if (
          pokeEvolutionRequest.data.chain.evolves_to[0].evolves_to.length > 0
        ) {
          const thirdImg =
            pokeEvolutionRequest.data.chain.evolves_to[0].evolves_to[0].species
              .url;
          const thirdId = thirdImg.split("/").slice(-2, -1)[0];
          const thirdResponse = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${thirdId}`
          );
          const thirdEvolution = {
            image: thirdResponse.data.sprites.front_default,
            name: pokeEvolutionRequest.data.chain.evolves_to[0].evolves_to[0].species.name,
            types: thirdResponse.data.types.map((typeData) => typeData.type.name),
            id: thirdResponse.data.id,
          };
          this.evolutionDetails.push(thirdEvolution);
        }
      }
      console.log(this.evolutionDetails);
    },
    reloadPage() {
      window.location.reload();
    },
  },

  created() {
    this.fetchEvolutionData();
  },
};
</script>

<style scoped>
@import "../assets/colors.css";
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
span {
  font-size: 50px;
}
.title {
  color: white;
  float: left;
  display: block;
}

.evo-container {
  background-color: rgb(99, 97, 97);
  padding: 20px;
  margin: 0 10% 0 10% ;
}



.evo {
  margin: 10px;
  flex: 1; 
  max-width: 300px;
}

.evo-name {
  color: rgb(231, 229, 229);
  text-align: center; 
}

.pokemon-number {
  font-size: 18px;
  color: #a4acaf;
}

.image {
  border: 3px solid white;
  border-radius: 50%;
   
}
</style>