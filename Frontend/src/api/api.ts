import axios from "axios";

const API_URL = "http://localhost:8081/api/holidays";

export const fetchHolidays = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("Fetched holidays:", response.data); // ✅ Debugging log
    return response.data || [];
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return [];
  }
};

export const addHoliday = async (holiday: { date: string; title: string }) => {
  try {
    const response = await axios.post(API_URL, holiday, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Added holiday:", response.data); // ✅ Debugging log
    return response.data;
  } catch (error) {
    console.error("Error adding holiday:", error);
  }
};
