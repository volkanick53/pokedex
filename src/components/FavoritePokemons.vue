<template>
    <div class="d-flex align-center justify-space-around flex-wrap">
        
        <v-card
        class="w-xl-25 w-sm-48 w-md-48 w-lg-32 ma-3 rounded-xl"
        hover
        :class="'background-color-' + favorite.types[0]"
        v-for="favorite in favoritePokemons"
        :key="favorite.id"
      >
      <router-link :to="'/pokemon/' + favorite.id">
          <div>
            <img :src="favorite.image" :alt="favorite.name" />
            <p># {{ favorite.id }}</p>

            <h5>{{ favorite.name }}</h5>
            <div class="types-container">
              <div
                v-for="(type, index) in favorite.types"
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
</template>


<script>
export default {
    data() {
        return {
            favoritePokemons: []
        }
    },
    created() {
        this.favoritePokemons =
      JSON.parse(localStorage.getItem("favoritePoke")) || [];
      const favoriteLength = this.favoritePokemons.length;
    this.$emit("favoriteEvent", favoriteLength);
    },
    
}
</script>

<style scoped>

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
@media only screen and (min-width: 200px) {
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