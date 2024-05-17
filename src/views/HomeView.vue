<template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input type="text" placeholder="Search for a city or state" @input="weatherStore.getSearchResults" v-model="weatherStore.searchQuery" class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]">
      <ul v-if="weatherStore.mapboxSearchResults" class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]">
        <template v-if="!weatherStore.searchError && weatherStore.mapboxSearchResults.length === 0">
          <p class="text-gray-400">No results match your query. Please try a different term.</p>
        </template>
        <template v-else>
          <li v-for="searchResult in weatherStore.mapboxSearchResults" 
            :key="searchResult.id" 
            class="py-2 cursor-pointer" 
            @click="previewCity(searchResult)">
            {{ searchResult.properties.full_address }}
          </li>
        </template>
      </ul>
      <p v-if="weatherStore.searchError" class="absolute top-12 text-red-500">Sorry, we were unable to get any results. Please check your internet connection and try again.</p>
    </div>
    <div class="flex flex-col gap-4">
      <Suspense>
        <CityList/>
        <template #fallback>
          <CityCardSkeleton/>
        </template>
      </Suspense>
    </div>
  </main>
</template>

<!-- <template>
  <main class="container text-white">
    <div class="pt-4 mb-8 relative">
      <input type="text" placeholder="Search for a city or state" @input="weatherStore.getSearchResults" v-model="weatherStore.searchQuery" class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]">
      <ul v-if="weatherStore.mapboxSearchResults" class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]">
        <p v-if="weatherStore.searchError">Sorry we were unable to get any results</p>
        <p v-if="!searchError && mapboxSearchResults.length === 0">
          No results match your query, try a different term
        </p>
        <template v-else>
          <li v-for="searchResult in weatherStore.mapboxSearchResults" 
            :key="searchResult.id" 
            class="py-2 cursor-pointer">
            {{ searchResult.properties.full_address }}
          </li>
        </template>
      </ul>
    </div>

  </main>
</template> -->


<script setup>
import { useWeatherStore } from '@/stores/weatherStore';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CityList from '../components/CityList.vue'
import CityCardSkeleton from '../components/CityCardSkeleton.vue'

const router = useRouter()
const weatherStore = useWeatherStore()

onMounted(() => {
  // Log properties of each object in mapboxSearchResults
  console.log(weatherStore.mapboxSearchResults);
});

const previewCity = (searchResults) => {   
  const [city, state] = searchResults.properties.full_address.split(',')
  const lat = searchResults.geometry.coordinates[0]
  const lng = searchResults.geometry.coordinates[1]

  router.push({
    name: 'CityView',
    params: {
      state: state.replaceAll(" ", ""),
      city: city
    },
    query: {
      lat: searchResults.geometry.coordinates[1],
      lng: searchResults.geometry.coordinates[0],
      preview: true
    }
  })
       
    console.log('The city is', city, 'the state is', state)
}




</script>