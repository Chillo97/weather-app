"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { cities } from "./Cities";
import { fetchWeatherData } from "./Backend/Api";
import Image from "next/image";

function shuffleArray(array: any) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array; // Gib das gemischte Array zurück
}

// Mische die Städte auf dem Client
shuffleArray(cities);

const fahrenheitToCelsius = (fahrenheit: number) => {
  return (((fahrenheit - 32) * 5) / 9).toFixed(2);
};

export default function Home() {
  const [visibleCityIndex, setVisibleCityIndex] = useState(0);
  const [weatherData, setWeatherData] = useState<any>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleCityIndex < cities.length - 1) {
        setVisibleCityIndex(visibleCityIndex + 1);
        setWeatherData({}); // Zurücksetzen der Wetterdaten, wenn die Stadt gewechselt wird
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [visibleCityIndex]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('https://littlevisuals.co/images/downtown.jpg')",
        backgroundSize: "cover",
      }}
    >
      <CardWithInput
        initialCity={cities[visibleCityIndex]}
        weatherData={weatherData}
        setWeatherData={setWeatherData}
      />
    </div>
  );
}

function CardWithInput({
  initialCity,
  weatherData,
  setWeatherData,
}: {
  initialCity: string;
  weatherData: any;
  setWeatherData: any;
}) {
  const [inputValue, setInputValue] = useState(initialCity);
  const [icon, setIcon] = useState(""); // Hinzugefügt, um das Icon zu speichern

  useEffect(() => {
    setInputValue(initialCity); // Update inputValue when initialCity changes
  }, [initialCity]);

  //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setInputValue(e.target.value);
  //   };

  useEffect(() => {
    async function getWeather() {
      if (!weatherData[initialCity]) {
        const data = await fetchWeatherData(initialCity);

        if (data) {
          console.log("Erhaltene Daten:", data);

          if (data.weather && data.weather.length > 0) {
            const currentIcon = data.weather[0].icon;
            // Führe hier weitere Aktionen mit "icon" durch
            setIcon(currentIcon); // Icon setzen
            console.log("Erhaltene icon:", icon);
          } else {
            // Hier kannst du auf den Fall reagieren, in dem weatherData.weather nicht korrekt definiert ist
            console.log("weatherData.weather ist nicht definiert oder leer.");
          }
          setWeatherData({ ...weatherData, [initialCity]: data });
        }
      }
    }
    getWeather();
  }, [initialCity, weatherData, setWeatherData, icon]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-6">
          <h5 className="card-title">Weather for {initialCity}</h5>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={inputValue}
              // onChange={handleInputChange}
              // placeholder=" "
            />
          </div>
        </div>
        <div className="w-100 d-lg-none"></div>{" "}
        {/* Spaltenumbruch auf kleinen Bildschirmen */}
        <div className="col-12 col-lg-6 d-flex flex-column">
          {weatherData[initialCity] &&
          Object.keys(weatherData[initialCity]).length !== 0 &&
          weatherData[initialCity].weather[0] ? (
            <>
              <div className="d-flex align-items-center mb-2">
                <p className="ml-2">
                  Weather in {weatherData[initialCity].name}:{" "}
                  {weatherData[initialCity].weather[0].description}
                </p>
                <Image
                  src={`http://openweathermap.org/img/wn/${icon}.png`}
                  alt="/"
                  width={100}
                  height={100}
                />
              </div>
              <div>
                <p>
                  Currently{" "}
                  {fahrenheitToCelsius(weatherData[initialCity].main.temp)}{" "}
                  &deg; C
                </p>
                {/* <p>
              Temperature: {weatherData[initialCity].main.temp}
              &deg; F
            </p> */}
                <p>Humidity: {weatherData[initialCity].main.humidity}%</p>
                <p>
                  Wind Direction: {weatherData[initialCity].wind.deg} Degrees
                </p>
                {/* Weitere Wetterinformationen */}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
