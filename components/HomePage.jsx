import { View, Image, SafeAreaView, TextInput, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';
import { CalendarDaysIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline"
import { MapPinIcon } from "react-native-heroicons/solid"
import { debounce } from "lodash"
import { fetchWeatherForecast, fetchWeatherLocation, fetchWeatherForOneDay } from "../api/weather"
import * as Progress from 'react-native-progress';
import {storeData, getData} from "../lib/asyncStorage"
// data Weather for image source 
const weatherImage = {
  "Partly cloudy": require('../assets/images/meteo/partlycloudy.png'),
  "Moderate rain": require('../assets/images/meteo/moderaterain.png'),
  "Patchy rain possible": require('../assets/images/meteo/moderaterain.png'),
  "Sunny": require("../assets/icons/light.png"),
  "Clear": require("../assets/icons/light.png"),
  "Overcast": require("../assets/images/meteo/cloud.png"),
  "Cloudy": require("../assets/images/meteo/cloud.png"),
  "Light rain": require("../assets/images/meteo/moderaterain.png"),
  "Moderate rain at times": require('../assets/images/meteo/moderaterain.png'),
  "Heavy rain": require('../assets/images/meteo/heavyrain.png'),
  "Heavy rain at time": require('../assets/images/meteo/heavyrain.png'),
  "Moderate or heavy freezing rain": require('../assets/images/meteo/heavyrain.png'),
  "Moderate or heavy rain shower": require("../assets/images/meteo/heavyrain.png"),
  "Moderate or heavy rain with thunder": require('../assets/images/meteo/heavyrain.png'),
  "Moderate snow" : require("../assets/images/meteo/snowfall.png"),
  "other": require('../assets/images/meteo/sun.png')

}


const HomePage = () => {
  const [search, setSearch] = useState(false)
  const [Location, setLocation] = useState([])
  const [weather, setweather] = useState({})
  const [weekForcaste, setweekForcaste] = useState([])
  const [loading, setLoading] = useState(true)

  const handleLoc = (loc) => {

    setLocation([]);  // Vider la localisation avant de récupérer une nouvelle
    setLoading(true)
    fetchWeatherForOneDay({
      cityName: loc.name,
    }).then(data => {
      setweather(data)
      setLoading(false)
    });

    fetchWeatherForecast({
      cityName: loc.name,
    }).then(week => {
      setweekForcaste(week?.forecast?.forecastday || []); // Récupérer la prévision de 7 jours
      setLoading(false)
      storeData("city", loc.name)
    })
  }

  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchWeatherLocation({ cityName: value }).then(data => {
        if (data) {
          setLocation(data); // Utilisez setLocation ici pour la réponse correcte.

        }
      }).catch(error => {
        console.error("Error fetching weather location:", error);
      });
    }
  };

  useEffect(() => {
    fetchMyWeatherData()
    setLoading(false)
  }, [])

  const fetchMyWeatherData = async () => {
    let myCity = await getData("city")
    let cityName = "Marrakech"
    if(myCity) cityName = myCity
    fetchWeatherForOneDay({
      cityName: "MARRAKECH",
    }).then(data => {
      setweather(data)
    });

    fetchWeatherForecast({
      cityName,
    }).then(week => {

      setweekForcaste(week?.forecast?.forecastday || []); // Récupérer la prévision de 7 jours
    })
  }
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])
  const { current, location, forecast } = weather;



  return (
    <ScrollView className=''>
      <View className="flex-1 relative h-screen">
        <StatusBar style="light" backgroundColor="transparent" translucent />
        {/**BackGround image  */}
        <Image source={require('../assets/images/bg.jpg')} className="absolute h-full w-full" blurRadius={30} />

        {/** Body  */}
        {
          loading ? (
            <View className='flex-row  flex-1 justify-center items-center '>
              <Progress.CircleSnail size={160} thickness={10} color="#0bb3b2" />
            </View>
          ) : (
            <SafeAreaView className="flex flex-1 space-y-3 ">

              <View className="mx-4  my-14 z-50" style={{ height: "7%" }}>
                <View className="justify-end items-center h-16 rounded-full flex-row "
                  style={{ backgroundColor: 'rgba(255,255,255, 0.2)' }}>
                  <TextInput
                    onChangeText={handleTextDebounce}
                    placeholder="Enter the City or Country Name"
                    placeholderTextColor={'lightgray'}
                    className=" w-full h-full p-3 flex-1 text-xl text-white "
                  />
                  <TouchableOpacity
                    onPress={() => setSearch(!search)}
                    className='p-4  my-1  w-auto  h-full rounded-full  ' style={{ backgroundColor: 'rgba(255,255,255, 0.3)' }}>
                    <MagnifyingGlassIcon size={25} color="white" />
                  </TouchableOpacity>
                </View>
                {
                  Location.length > 0 && search ? (
                    <View className='absolute w-full  rounded-3xl p-2 top-16 mt-1'
                      style={{ backgroundColor: 'rgba(255,255,255, 1)' }}>
                      {
                        Location.map((loc, k) => {
                          let showBorder = loc + 1 != Location.length;
                          let borderStyle = showBorder ? "border-b-2 border-b-gray-500" : "";
                          return (
                            <TouchableOpacity
                              onPress={() => handleLoc(loc)}
                              className={`flex-row p-3 items-center border-0 px-4 ${borderStyle}`} key={k}>
                              <MapPinIcon size="20" color="gray" />
                              <Text className='text-lg ml-2 '>{loc?.name},
                                <Text>
                                  {"   " + loc?.country}</Text>
                              </Text>
                            </TouchableOpacity>
                          )
                        })
                      }
                    </View>
                  ) : null
                }
              </View>

              <View className='justify-around  items-center flex flex-1 mb-3 '>
                <Text className='text-white text-center text-4xl font-bold  '>{location?.country},
                  <Text className='font-semibold text-3xl text-white'>
                    {" " + location?.name}
                  </Text>
                </Text>

                <View className='flex-row justify-center '>
                  <Image source={weatherImage[current?.condition?.text] || weatherImage["other"]}
                    className='w-44 h-44'
                  />
                </View>

                <View className='space-y-2'>
                  <Text className='text-center  text-6xl font-semibold text-white ml-5 mt-4 mb-3   '>
                    {current?.temp_c}&#176;
                  </Text>
                  <Text className='text-center  text-xl tracking-widest text-white ml-5 mb-5 '>
                    {current?.condition?.text}
                  </Text>
                </View>

                <View className='justify-between w-full  space-x-5  flex-row pb-3   '>
                  <View className='flex-row space-x-2  items-center '>
                    <Image source={require('../assets/icons/light.png')}
                      className='w-9 h-10'
                    />
                    <Text className=' font-semibold text-white text-md ml-2 mb-1 '>
                      {forecast?.forecastday[0]?.astro?.sunrise}</Text>
                  </View>
                  <View className='flex-row space-x-2  items-center '>
                    <Image source={require('../assets/icons/drops.png')}
                      className='w-9 h-10'
                    />
                    <Text className=' font-semibold text-white text-md  ml-2 '>
                      {current?.humidity}%</Text>
                  </View>
                  <View className='flex-row space-x-2  items-center '>
                    <Image source={require('../assets/icons/wind.png')}
                      className='w-9 h-10'
                    />
                    <Text className=' font-semibold text-white text-md  ml-2 '> {current?.wind_kph}Km</Text>
                  </View>
                </View>
              </View>


              <View >
                {/* 7 days forecast */}
                <View className='mb-1 space-y-2 '>
                  <View className='flex-row items-center mx-5 space-x-2 mb-2'>
                    <CalendarDaysIcon size="24" color="white" />
                    <Text className="text-2xl text-white ml-3 font-bold ">7 Day Forecast</Text>
                  </View>

                  <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 16 }} showsHorizontalScrollIndicator={false}>
                    {weekForcaste.map((day, index) => {
                      let date = new Date(day?.date)
                      let options = { weekday: "long" }
                      let dayName = date.toLocaleDateString('en-US', options)

                      return (
                        <View
                          key={index}
                          className="justify-center flex items-center w-24 rounded-3xl py-4   space-y-1 mr-8"
                          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                        >
                          <Image
                            source={weatherImage[day?.day?.condition?.text] || weatherImage['other']}
                            className="w-11 h-11"
                          />
                          <Text className="text-lg text-white  mt-1 text-center ">{dayName}</Text>
                          {/* Vérifier si maxtemp_c est défini avant de l'afficher */}
                          <Text className="text-lg text-white font-semibold text-center">
                            {day?.day?.maxtemp_c !== undefined ? `${day?.day?.maxtemp_c}°` : 'N/A'}
                          </Text>
                        </View>
                      )
                    }
                    )}
                  </ScrollView>

                </View>
                {/* today details  */}
                <View className=' space-y-2 mt-3  mb-3 '>
                  <View className='flex-row items-center mx-5 space-x-2 mb-2 '>
                    <CalendarDaysIcon size="24" color="white" />
                    <Text className='text-white font-medium ml-3 text-2xl '>About today</Text>
                  </View>
                  {
                    forecast?.forecastday?.map((day, index) => {

                      return (
                        <ScrollView 
                          key={index} horizontal contentContainerStyle={{ paddingHorizontal: 16 }}
                          showsHorizontalScrollIndicator={false}
                        >


                          {
                            day?.hour?.map((hour, i) => {
                              let dayExtract = hour?.time.split(" ")[0]
                              let day = new Date(dayExtract)
                              let options = { weekday: "long" };
                              let dayName = day.toLocaleDateString('en-US', options)

                              return (
                                <View key={i} className='justify-center flex  items-center w-24 rounded-3xl pl-2 pr-2RR space-y-1 mr-8'
                                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                                  <Image source={weatherImage[hour?.condition?.text] || weatherImage["other"]}
                                    className='w-11 h-11'
                                  />
                                  <Text className='text-white text-center text-xl '>{dayName}</Text>
                                  <Text className=' mt-1 text-center text-white text-lg '>{hour?.time.split(" ")[1]}</Text>
                                  <Text className='text-lg text-white font-semibold text-center  '>{hour?.temp_c}&#176;</Text>
                                </View>
                              )
                            })
                          }

                        </ScrollView>
                      )
                    })
                  }
                </View>
              </View>


            </SafeAreaView>
          )
        }

      </View>
    </ScrollView>
  );
};

export default HomePage;
