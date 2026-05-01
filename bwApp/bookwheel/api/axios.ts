import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 5000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");

  console.log("token:", token);

  if (token) {
    config.headers?.set("Authorization", `Bearer ${token}`);
  }

  console.log("Authorization:", config.headers?.get("Authorization"));

  return config;
});

export default api;
