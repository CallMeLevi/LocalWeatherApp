<template>
    <header class="sticky top-0 bg-weather-primary shadow-lg">
        <nav class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6">
            <router-link :to="{name: 'home'}">
                <div class="flex items-center gap-3 flex-1">
                    <i class="fas fa-sun text-2xl"></i>
                    <p class="text-2xl">The Local Weather</p>
                </div>
            </router-link>
            <div class="flex gap-3 flex-1 justify-end">
                <i @click="weatherStore.toggleModal" class="fas fa-info text-xl hover:text-weather-secondary duration-150 cursor-pointer"></i>
                <i v-if="route.query.preview" class="fas fa-plus text-xl hover:text-weather-secondary duration-150 cursor-pointer" v-on:click="addCity"></i>
            </div>
            <BaseModal><div class="text-black">
                <h1 class="text-2xl mb-1">About: </h1>
                <p class="mb-4">The Local Weather allows you to track the current and future weather of cities of your choosing</p>
                <h2 class="class-2xl">How it works:</h2>
                <ol class="list-decimal list-inside mb-4">
                    <li>Search for your name by entering the name into the search bar</li>
                    <li>Select a city within the results that will take you to the current weather for your selection</li>
                    <li>Track the city by clicking on the "+" icon at the top-right corner. This will save the city to view at a later time on the homepage</li>
                </ol>
                <h1 class="text-2xl mb-1">How to remove a city </h1>
                <p class="mb-4">If you no longer wish to track a city, simply select the city within the homepage. Within the city, there will be an option to delete city</p>

            </div>
            </BaseModal>
        </nav>
    </header>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useWeatherStore } from '@/stores/weatherStore';
import BaseModal from './BaseModal.vue'
import { ref } from 'vue';
import {uid} from 'uid'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()
const savedCities = ref([])
const addCity = () => {
    if(localStorage.getItem('savedCities')){
        savedCities.value = JSON.parse(localStorage.getItem('savedCities'))
    }
    const locationObj = {
        id: uid(),
        state: route.params.state,
        city: route.params.city,
        coords: {
            lat: route.query.lat,
            lng: route.query.lng,
        }
    }

    savedCities.value.push(locationObj)
    localStorage.setItem('savedCities', JSON.stringify(savedCities.value))
    let query = Object.assign({}, route.query)
    delete query.preview
    query.id = locationObj.id
    router.replace({query})
}

</script>