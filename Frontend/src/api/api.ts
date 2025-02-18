import axios from "axios";

const API_URL = "https://holiday-calender-production.up.railway.app/api/holidays";

export const fetchHolidays = async () => {
  try {
    const response = await axios.get(API_URL, {
      withCredentials: true, // Send credentials (cookies/sessions)
    });
    console.log("Fetched holidays:", response.data);
    return response.data || [];
  } catch (error: any) {
    console.error("Error fetching holidays:", error.response ? error.response.data : error.message);
    return [];
  }
};

export const addHoliday = async (holiday: { date: string; title: string }) => {
  try {
    const response = await axios.post(API_URL, holiday, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // Send credentials
    });
    console.log("Added holiday:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding holiday:", error);
  }
};
