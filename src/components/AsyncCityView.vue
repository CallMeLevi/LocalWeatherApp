<template>
    <div class="flex flex-1 flex-col items-center ">

        <!-- Banner -->
        <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
            <p>You are currently viewing the city. Click the '+' icon to start tracking the city.</p>
        </div>

        <!-- Weather Overview -->
        <div class="flex flex-col text-white py-12 items-center">
            <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
            <p class="text-sm mb-12">
                {{ 
                    new Date(weatherData.currentTime).toLocaleDateString(
                        "en-us",
                        {
                            weekday: "short",
                            day: "2-digit",
                            month: "long"
                        }
                    )    
                }}
                {{ 
                    new Date(weatherData.currentTime).toLocaleTimeString(
                        "en-us",
                        {
                            timeStyle: "short",
                        }
                    )    
                }}
            </p>
            <p class="text-8xl mb-8">
                {{ Math.round(weatherData.current.temp) }}&deg;
            </p>
            <p>Feels like
                    {{ Math.round(weatherData.current.feels_like) }}&deg;
            </p>
            <p class="capitalize">
                    {{ weatherData.current.weather[0].description }}
            </p>
            <img class="w-[150px] h-auto" :src="`http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"/>
        </div>

        <hr class="border-white border-opacity-10 border width-full">
        
        <!-- Hourly weather -->
        <div class="max-w-sceen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">
                    Hourly Weather
                </h2>
                <div class="flex gap-10 overflow-x-scroll">
                    <div class="flex flex-col gap-4 items-center" v-for="hourData in weatherData.hourly" :key="hourData.dt">
                        <p class="whitespace-nowrap text-md">
                            {{ new Date(
                                hourData.currentTime
                            ).toLocaleTimeString("en-us", {
                                hour: "numeric"
                            })
                                
                            }}
                        </p>
                        <img class="w-auto h-[50px] object-cover" :src="`http://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`"/>
                        <p class="text-xl">
                            {{ Math.round(hourData.temp) }}&deg;
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <hr class="border-white border-opacity-10 border width-full">

        <!-- Weekly Weather -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">7 Day Forecast</h2>
                <div v-for="day in weatherData.daily" :key="day.dt" class="flex items-center">
                    <p class="flex-1">
                        {{ 
                            new Date(day.dt * 1000).toLocaleDateString(
                                "en-us",
                                {
                                    weekday: 'long'
                                }
                            )
                        }}
                    </p>
                    <img
                        class="w-[50px] h-[50px] object-cover"
                        :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
                    />
                    <div class="flex gap-2 flex-1 justify-end">
                        <p>H: {{ Math.round(day.temp.max) }}</p>
                        <p>L: {{ Math.round(day.temp.min) }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div @click="removeCity" class="flex items-center gap-2 text-white cursor-pointer duration-150 hover:text-red-500">
            <i class="fas fa-circle-minus"></i>
            <i class="fas fa-sun text-2xl"></i>
            <p>Remove City</p>
        </div>
        
    </div>
    
</template>

<script setup>
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { useWeatherStore } from '@/stores/weatherStore';

const weatherStore = useWeatherStore()
const router = useRouter()
const route = useRoute()
const apiKey = '7efa332cf48aeb9d2d391a51027f1a71'
const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${route.query.lat}&lon=${route.query.lng}&exclude={part}&appid=${apiKey}&units=metric`;


const getWeatherData = async () => {
    try{
        const res = await axios.get(apiUrl)
        const weatherData = res.data
       
        // Calculate date and time
        const localOffset = new Date().getTimezoneOffset() * 60000
        const utc = weatherData.current.dt * 1000 + localOffset
        weatherData.currentTime = utc + 1000 * weatherData.timezone_offset

        // Calculate hourly offset
        weatherData.hourly.forEach((hour) => {
            const utc = hour.dt * 1000 + localOffset
            hour.currentTime = utc + 1000 * weatherData.timezone_offset
        })

        // Flicker Delay
        await new Promise((res) => setTimeout(res, 1000))
        
        return weatherData
    }
    catch(err){
        console.log('Error fetching data',err)
    }
}

const removeCity = () => {
    const cities = JSON.parse(localStorage.getItem('savedCities'))
    const updatedCities = cities.filter((city) => city.id !== route.query.id)
    localStorage.setItem('savedCities', JSON.stringify(updatedCities))
    router.push({
        name:'home'
    })
}



const weatherData = await getWeatherData()
console.log(weatherData)

</script>

<style lang="scss" scoped>


</style>