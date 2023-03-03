import "./App.css";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import { useState, useEffect } from "react";
import Forecast from "./components/forecast/forecast";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (authenticated) {
      const fetchData = async () => {
        const defaultCity = "Colombo";
        const defaultLat = 6.927079;
        const defaultLon = 79.861244;

        const currentWeatherFetch = fetch(
          `${WEATHER_API_URL}/weather?lat=${defaultLat}&lon=${defaultLon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const forecastFetch = fetch(
          `${WEATHER_API_URL}/forecast?lat=${defaultLat}&lon=${defaultLon}&appid=${WEATHER_API_KEY}&units=metric`
        );

        Promise.all([currentWeatherFetch, forecastFetch])
          .then(async (responses) => {
            const [currentWeatherResponse, forecastResponse] =
              await Promise.all(responses.map((response) => response.json()));

            //use the spread operater to create a new object as well
            setCurrentWeather({ city: defaultCity, ...currentWeatherResponse });
            setForecast({ city: defaultCity, ...forecastResponse });
          })
          .catch((err) => console.log(err));
      };

      fetchData();
    }
  }, [authenticated]);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" "); //values are lattitude & longitude(location)

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    //asynchronuse operation
    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        //use the spread operater to create a new object as well
        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })
      .catch((err) => console.log(err));
  };

  console.log(currentWeather);
  console.log(forecast);

  const handleLogin = (e) => {
    e.preventDefault();
    // perform the authentication logic here
    if (username === "mishan" && password === "mishan.123") {
      setAuthenticated(true);
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="container">
      {authenticated ? (
        <>
          <Search onSearchChange={handleOnSearchChange} />
          {currentWeather && <CurrentWeather data={currentWeather} />}
          {forecast && <Forecast data={forecast} />}
        </>
      ) : (
        <div className="login">
          <form onSubmit={handleLogin}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit">Login</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
