const API_KEY = "9f6f8a59c54232bab4c8bca47ef0b4dc";

export async function fetchWeatherData(city: string) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
    );
    const data = await res.json();
    if (data?.cod === "400") throw data;
    return data;
  } catch (err) {
    // console.log(err);
    return null;
  }
}
