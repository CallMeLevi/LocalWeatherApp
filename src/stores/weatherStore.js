import { defineStore } from 'pinia';
import axios from 'axios'

export const useWeatherStore = defineStore('weatherStore', {
  state: () => ({
    modalActive: false,
    searchQuery: ``,
    queryTimeout: undefined,
    mapboxAPIKey: 'pk.eyJ1IjoiYmlnYnJvbiIsImEiOiJjbHZ2NDlvbTExc3JoMnFxenM2bDdtd2drIn0.v2yq0uchmf6BlHuEfhy1tg',
    weatherAPIKey: `128027bca3684d77b6035626241105`,
    mapboxSearchResults: null,
    searchError: null
  }),


  actions: {
    toggleModal() {
      this.modalActive = !this.modalActive;
    },
    getSearchResults(){
        clearTimeout(this.queryTimeout)
        this.queryTimeout = setTimeout(async () => {
            if(this.searchQuery !== ''){
                try{
                    const result = await axios.get(`https://api.mapbox.com/search/geocode/v6/forward?q=${this.searchQuery}&access_token=${this.mapboxAPIKey}&types=place`)
                    this.mapboxSearchResults = result.data.features
                    console.log(this.mapboxSearchResults)
                    this.searchError = null

                }catch(error){
                    console.log('There seems to be an error', error.message)
                    this.searchError = true
                }
                return
            }
            this.mapboxSearchResults = null
        },300)
    },
  },
});
