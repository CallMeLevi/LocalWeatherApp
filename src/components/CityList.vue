<template>
    <div v-for="city in savedCities" :key="city.id">
        <CityCard :city="city" @click="goToCityView(city)"/>
    </div>
    <p v-if="savedCities.length === 0">
        No locations have been added. To start tracking a location, search in the field above
    </p>
</template>

<script setup>
import CityCard from './CityCard.vue';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter()

const savedCities = ref([])
const getCities = async () => {
    if(localStorage.getItem('savedCities')){
        savedCities.value = JSON.parse(localStorage.getItem('savedCities'))
    }
    const requests = []
    savedCities.value.forEach((city) => {
        requests.push(
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.lat}&lon=${city.coords.lng}&exclude={part}&appid=7efa332cf48aeb9d2d391a51027f1a71&units=metric`)
        )
    })
    const weatherData = await Promise.all(requests)

    //Flicker delay
    await new Promise((res) => setTimeout(res, 1000))

    weatherData.forEach((value, index) => {
        savedCities.value[index].weather = value.data
    })
}

const goToCityView = (city) => {
    router.push({
        name: 'CityView',
        params: {state: city.state, city: city.city},
        query: {id: city.id, lat: city.coords.lat, lng: city.coords.lng}
    })
}

await getCities()

</script>

