import axios from "axios";
const apiKey = "d4b12f0e2e0a4848977162532251301"

const forecastEndpoint = params=>`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=7&aqi=no&alerts=no`
const locationEndpoint = params=> `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;
const forecastOneDayEndpoint = 
           params=>`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=1&aqi=no&alerts=no`
 
// get infos data
const apiCall = async(endPoints)=>{
    const options = {
        method : "GET",
        url : endPoints
    }
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.log("Error at ", error)
        return null
    }
}

//fetch data with params  
export const fetchWeatherForecast = params=>{
 
    return apiCall(forecastEndpoint(params));
}

export const fetchWeatherLocation = params=>{
    return apiCall(locationEndpoint(params));
}
export const fetchWeatherForOneDay = params=>{
    return apiCall(forecastOneDayEndpoint(params));
}
