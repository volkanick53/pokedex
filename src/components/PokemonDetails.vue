<template>
  <div v-if="pokemon" class="pokemon-container">
    <div class="header">
      <h2>
        {{ pokemon.name }} <span class="pokemon-number">#{{ pokemon.id }}</span>
      </h2>
    </div>
    <div class="max-container d-flex justify-space-around">
      <div class="profile-container d-flex flex-column">
        <div class="avatar">
          <img :src="pokemon.sprites.front_default" />
        </div>
        <!--Bar Chart for Pokemon Stats-->

        <div class="stats">
          <h3>Stats</h3>

          <div class="my-5">
            <canvas id="baseStats"></canvas>
          </div>
        </div>
      </div>
      <div class="info-container">
        <div class="info flex-md-row flex-column rounded-lg">
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
      </div>
    </div>
    <div class="bottom-section">
      <Evolution :id="pokemon.id"></Evolution>

      <v-btn color="#FF3D00" class="mt-2" @click="mainPage()"
        >Explore More Pokemon</v-btn
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Evolution from "./Evolution.vue";
import Chart from "chart.js/auto";

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
      this.renderChart();
    },

    mainPage() {
      this.$router.push("/");
    },
    renderChart() {
      // Check if pokemon data is available
      if (this.pokemon) {
        const ctx = document.getElementById("baseStats").getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: this.pokemon.stats.map((stat) => stat.stat.name),
            datasets: [
              {
                label: "Base Stats",
                data: this.pokemon.stats.map((stat) => stat.base_stat),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(255, 205, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                ],
                borderColor: [
                  "rgb(255, 99, 132)",
                  "rgb(255, 159, 64)",
                  "rgb(255, 205, 86)",
                  "rgb(75, 192, 192)",
                  "rgb(54, 162, 235)",
                  "rgb(153, 102, 255)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },

            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
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
  destroyed() {
    // Destroy chart instance when component is destroyed to prevent memory leaks
    if (this.chart) {
      this.chart.destroy();
    }
  },
};
</script>

<style scoped>
@import "../assets/colors.css";

.max-container {
  margin: auto;
  max-width: 1024px;
  background: #fff;
}

.pokemon-container {
  max-width: 1280px;
  margin: auto;
  background: #fff url(../assets/container_bg.png);
  opacity: 1;
  min-height: 100vh;
}
.bottom-section {
  margin-top: 20%;
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
