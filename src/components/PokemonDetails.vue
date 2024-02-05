<template>
  <div v-if="pokemon">
    <div class="header">
      <h2>
        {{ pokemon.name }} <span class="pokemon-number">#{{ pokemon.id }}</span>
      </h2>
    </div>

    <div class="container flex-md-row flex-column">
      <div class="avatar">
        <img :src="pokemon.sprites.front_default" />
      </div>
      <div class="info flex-md-row flex-column">
        <div class="column">
          <p>Height:</p>
          {{ pokemon.height }}
          <p>Weight:</p>
          {{ pokemon.weight }}
        </div>
        <div class="column">
          <p>Abilities:</p>
          {{ pokemon.abilities[0].ability.name }}
          <p>Base Experience:</p>
          {{ pokemon.base_experience }}
        </div>
      </div>
    </div>

    <div class="type-section">
      <h3>Type</h3>
      <div class="type-container">
        <div
          v-for="type in pokemon.types"
          :key="type.id"
          :class="'type-color-' + type.type.name"
          class="type-pill"
        >
          {{ type.type.name }}
        </div>
      </div>
      <h3>Weaknesses</h3>
      <div class="type-container">
        <div
          v-for="weakness in mergedWeakness"
          :key="weakness.id"
          :class="'type-color-' + weakness"
          class="type-pill"
        >
          {{ weakness }}
        </div>
      </div>
    </div>

    <div class="stat">
      <h4>Stats:</h4>
      <li v-for="stat in pokemon.stats" :key="stat.id">
        {{ stat.stat.name }} - {{ stat.base_stat }}
      </li>
    </div>
    <Evolution :id="pokemon.id"></Evolution>

    <v-btn color="#FF3D00" class="mt-2" @click="mainPage()"
      >Explore More Pokemon</v-btn
    >
  </div>
</template>

<script>
import axios from "axios";
import Evolution from "./Evolution.vue";

export default {
  props: ["id"],
  components: { Evolution },
  data() {
    return {
      pokemon: null,
      firstTypeWeakness: [],
      secondTypeWeakness: [],
      favoritePokemons: [],
    };
  },
  methods: {
    async fetchPokemonDetails() {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${this.id}`
      );

      this.pokemon = response.data;

      const TypeUrl = await axios.get(this.pokemon.types[0].type.url);

      (this.firstTypeWeakness =
        TypeUrl.data.damage_relations.double_damage_from.map(
          (damage) => damage.name
        )),
        console.log(TypeUrl);
      console.log(this.firstTypeWeakness);

      if (this.pokemon.types.length > 1) {
        const secondTypeUrl = await axios.get(this.pokemon.types[1].type.url);
        this.secondTypeWeakness =
          secondTypeUrl.data.damage_relations.double_damage_from.map(
            (damage) => damage.name
          );
      }
      
    },

    mainPage() {
      this.$router.push("/");
    },
  },
  computed: {
    // Create new array to store weakness data and display it more properly
    mergedWeakness() {
      const realWeakness = [
        ...new Set([...this.firstTypeWeakness, ...this.secondTypeWeakness]),
      ];
      return realWeakness;
    },
  },

  created() {
    this.fetchPokemonDetails();
    this.favoritePokemons =
      JSON.parse(localStorage.getItem("favoritePoke")) || [];
    const favoriteLength = this.favoritePokemons.length;
    this.$emit("favoriteEvent", favoriteLength);
  },
};
</script>

<style scoped>
@import "../assets/colors.css";
.container {
  margin: auto;
  
  max-width: 50%; 
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

h2,
li {
  text-transform: capitalize;
}

.info {
  background-color: #30a7d7;
  border: 1px solid;
  display: flex;
  
  align-items: center;
}
.column {
  padding: 20px;
}
.info p {
  color: white;
}

.type-section {
  text-align: center;
}

.type-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin: 20px;
}

.stat {
  margin: 5%;
  text-align: center;
}

.pokemon-number {
  color: #a4acaf;
}
</style>