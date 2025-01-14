import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeData = async (key, value)=>{
    try {
        await AsyncStorage.setItem(key, value)
    } catch (error) {
        console.log("Failed to store data  : ", error)
    }
}

export const getData = async (key)=>{
    try {
    const data =  await AsyncStorage.getItem(key);
    return data;
    } catch (error) {
        console.log("Error while getting data ", error)
    }
}