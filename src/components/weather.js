/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useState, useEffect } from "react";

const apiKey = process.env.REACT_APP_API_KEY;

const WeatherApp = () => {
    const [city, setCity] = useState(localStorage.getItem("selectedCity") || "malappuram");
    const [tempUnit, setTempUnit] = useState("°C");
    const [speedUnit, setSpeedUnit] = useState("kph");
    const [pressureUnit, setPressureUnit] = useState("mb");
    const [precipitationUnit, setPrecipitationUnit] =useState("mm");
    const [distanceUnit, setDistanceUnit] = useState("km");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [open, setOpen] = useState(false);

    const setUnit = (unitOptions, selectedUnit, setUnitCallback) => (
        unitOptions.map(unit => (
            <button
                key={unit}
                onClick={(e) =>{
                    e.stopPropagation();
                    setUnitCallback(unit)
                }}
                className={`unit-button ${selectedUnit === unit ? 'selected' : ''}`}
            >
                {unit}
            </button>
        ))
    );

    useEffect(() => {
        if (city) {
            const fetchData = async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`);
                    const weatherData = await res.json();
                    if (res.ok) {
                        setData(weatherData);
                        console.log(weatherData);
                    } 
                    else {
                        setError("An error occurred while fetching the forecast data");
                    }
                } 
                catch (error) {
                    setError("An error occurred while fetching the forecast data");
                } 
                finally {
                    setLoading(false);
                }
            };
        
            fetchData();
        }
    }, [city]);
      
    useEffect(() => {
        localStorage.setItem("selectedCity", city);
    },[city]);      

    const openUnits=()=>{
        setOpen(!open) 
    }

    return (
        <div className="weather-app">
            <h1>Weather App</h1>
            <div className="topbar">
                <input type="text" placeholder="Enter city name" value={city} onChange={(e) => setCity(e.target.value)}/>
                <button className="open-button" onClick={openUnits}>Open Units</button>
                <div className={`offcanvas-menu ${open ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <button className="close-button" onClick={openUnits}>Close Units</button>
                    <ul>
                        Temperature<li>{setUnit(['°C', '°F'], tempUnit, setTempUnit)}</li>
                        Speed<li>{setUnit(['kph', 'mph'], speedUnit, setSpeedUnit)}</li>
                        Pressure<li>{setUnit(['mb', 'in'], pressureUnit, setPressureUnit)}</li>
                        Precipitation<li>{setUnit(['mm', 'in'], precipitationUnit, setPrecipitationUnit)}</li>
                        Distance<li>{setUnit(['km', 'miles'], distanceUnit, setDistanceUnit)}</li>
                    </ul>
                </div>
            </div>


            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {data && data.forecast && data.forecast.forecastday &&(
                <div>
                    <div className="current-weather">                            
                        <div className="current1">
                            <h2>Details of {data.location.name}, {data.location.region}, {data.location.country}</h2>
                            <div className="current11">
                                <div className="current111">
                                    <p className="current-condition">{data.current.condition.text}</p>
                                    {tempUnit === "°C" 
                                        ? (
                                            <>
                                                <p className="current-temp">{data.current.temp_c}°C</p>
                                                <p className="current-feel">Feels like {data.current.feelslike_c}°C</p>
                                            </>
                                        ) 
                                        : (
                                            <>
                                                <p className="current-temp">{data.current.temp_f}°F</p>
                                                <p className="current-feel">Feels like {data.current.feelslike_f}°F</p>
                                            </>
                                        )
                                    }
                                </div>
                                <img src={data.current.condition.icon} alt="weather-img"/>
                            </div>
                        </div>
                        <div className="current2">
                            <div className="current21">
                                {speedUnit === "kph" 
                                    ? <p>Wind Speed: {data.current.wind_kph}kph</p>
                                    : <p>Wind Speed: {data.current.wind_mph}mph</p>
                                }
                                <p>Wind Direction: {data.current.wind_degree} {data.current.wind_dir}</p>
                                <p>Humidity: {data.current.humidity}</p>
                                <p>Clouds: {data.current.cloud}</p>
                                <p>UV: {data.current.uv}</p>
                            </div>
                            <div className="current22">
                                {pressureUnit === "mb" 
                                    ? <p>Pressure: {data.current.pressure_mb}mb</p>
                                    : <p>Pressure: {data.current.pressure_in}in</p>
                                }
                                {precipitationUnit === "mm" 
                                    ? <p>Precipitation: {data.current.precip_mm}mm</p>
                                    : <p>Precipitation: {data.current.precip_in}in</p>
                                }
                                {distanceUnit === "km" 
                                    ? <p>Visual clarity: {data.current.vis_km}km</p> 
                                    : <p>Visual clarity: {data.current.vis_miles}miles</p>
                                }
                                {speedUnit === "kph" 
                                    ? <p>Gust Speed: {data.current.gust_kph}kph</p>
                                    : <p>Gust Speed: {data.current.gust_mph}mph</p>
                                }
                                <p>Lat: {data.location.lat}, Lat: {data.location.lon}</p>
                            </div>
                        </div>
                    </div>

                    <h3>7 Day Forecast</h3>
                    <div className="day">
                        {data.forecast.forecastday.slice(0, 7).map((day, index) => (
                        <div key={index} className="one-day">
                            <p>{day.date}</p>
                            <p>{day.day.condition.text}</p>
                            <img src={day.day.condition.icon} alt={day.day.condition.text}/>
                            {tempUnit === "°C" 
                                ? (
                                    <>
                                        {/* <p>Maximum Temperature: {day.day.maxtemp_c}°C</p>
                                        <p>Minimum Temperature: {day.day.mintemp_c}°C</p> */}
                                        <p>Average Temperature: {day.day.avgtemp_c}°C</p>
                                    </>
                                ) 
                                : (
                                    <>
                                        {/* <p>Maximum Temperature: {day.day.maxtemp_f}°F</p>
                                        <p>Minimum Temperature: {day.day.mintemp_f}°F</p> */}
                                        <p>Average Temperature: {day.day.avgtemp_f}°F</p>
                                    </>
                                )
                            }
                            {/* {speedUnit === "kph" 
                                ? <p>Maximum Wind Speed: {day.day.maxwind_kph}kph</p>
                                : <p>Maximum Wind Speed: {day.day.maxwind_mph}mph</p>
                            }
                            {precipitationUnit === "mm" 
                                ? <p>Total Precipitation: {day.day.totalprecip_mm}mm</p>
                                : <p>Total Precipitation: {day.day.totalprecip_in}in</p>
                            }
                            <p>Total Snow: {day.day.totalsnow_cm}cm</p>
                            {distanceUnit === "km" 
                                ? <p>Average Visual Clarity: {day.day.avgvis_km}km</p>
                                : <p>Average Visual Clarity: {day.day.avgvis_miles}miles</p>
                            }
                            <p>Average Humidity: {day.day.avghumidity}</p>
                            <p>Chance of rain: {day.day.daily_chance_of_rain}</p>
                            <p>Chance of snow: {day.day.daily_chance_of_snow}</p>
                            <p>UV: {day.day.uv}</p>
                            <p>Sunrise and Sunset: {day.astro.sunrise} and {day.astro.sunset}</p>
                            <p>Moonrise and Moonset: {day.astro.sunrise} and {day.astro.sunset}</p>
                            <p>Moon Phase: {day.astro.moon_phase}</p>
                            <p>Moon Illumination: {day.astro.moon_illumination}</p> */}
                        </div>
                        ))}
                    </div>


                    <h3>Hourly Forecast</h3>
                    <div className="hour">
                        {data.forecast.forecastday[0].hour.map((hour, index) => (
                            <div key={index} className="one-hour">
                                <p>Time: {hour.time.split(' ')[1]}</p>
                                <p>{hour.condition.text}</p>
                                <img src={hour.condition.icon} alt={hour.condition.text}/>
                                {tempUnit === "°C" 
                                    ? (
                                        <>
                                            <p>Temperature: {hour.temp_c}°C</p>
                                            {/* <p>Feels Like: {hour.feelslike_c}°C</p>
                                            <p>Wind Chill: {hour.windchill_c}°C</p>
                                            <p>Heat Index: {hour.heatindex_c}°C</p>
                                            <p>Dew Point: {hour.dewpoint_c}°C</p> */}
                                        </>
                                    ) 
                                    : (
                                        <>
                                            <p>Temperature: {hour.temp_f}°F</p>
                                            {/* <p>Feels Like: {hour.feelslike_f}°F</p>
                                            <p>Wind Chill: {hour.windchill_f}°F</p>
                                            <p>Heat Index: {hour.heatindex_f}°F</p>
                                            <p>Dew Point: {hour.dewpoint_f}°F</p> */}
                                        </>
                                    )
                                }
                                {/* {speedUnit === "kph" 
                                    ? <p>Wind Speed: {hour.wind_kph}kph</p>
                                    : <p>Wind Speed: {hour.wind_mph}mph</p>
                                }
                                <p>Wind Degree: {hour.wind_degree}</p>
                                <p>Wind Direction: {hour.wind_dir}</p>
                                {pressureUnit === "mb" 
                                    ? <p>Pressure: {hour.pressure_mb}mb</p>
                                    : <p>Pressure: {hour.pressure_in}in</p>
                                }
                                {precipitationUnit === "mm" 
                                    ? <p>Precipitation: {hour.precip_mm}mm</p>
                                    : <p>Precipitation: {hour.precip_in}in</p>
                                }
                                <p>Humidity: {hour.humidity}</p>
                                <p>Clouds: {hour.cloud}</p>
                                <p>Chance of rain: {hour.chance_of_rain}</p>
                                <p>Chance of snow: {hour.chance_of_snow}</p>
                                {distanceUnit === "km" 
                                    ? <p>Visual Clarity: {hour.vis_km}km</p>
                                    : <p>Visual Clarity: {hour.vis_miles}miles</p>
                                }
                                {speedUnit === "kph" 
                                    ? <p>Gust Speed: {hour.gust_kph}kph</p>
                                    : <p>Gust Speed: {hour.gust_mph}mph</p>
                                }
                                <p>UV: {hour.uv}</p> */}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherApp;


