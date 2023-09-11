/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const apiKey = process.env.REACT_APP_API_KEY;

const Weather = () => {
    const [city, setCity] = useState(localStorage.getItem("selectedCity") || "malappuram");
    const [tempUnit, setTempUnit] = useState(localStorage.getItem("selectedTemp") || "°C");
    const [speedUnit, setSpeedUnit] = useState(localStorage.getItem("selectedSpeed") || "kph");
    const [pressureUnit, setPressureUnit] = useState(localStorage.getItem("selectedPressure") || "mb");
    const [precipitationUnit, setPrecipitationUnit] = useState(localStorage.getItem("selectedPrecip") || "mm");
    const [distanceUnit, setDistanceUnit] = useState(localStorage.getItem("selectedDist") || "km");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

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
        localStorage.setItem("selectedTemp", tempUnit);
        localStorage.setItem("selectedSpeed", speedUnit);
        localStorage.setItem("selectedPressure", pressureUnit);
        localStorage.setItem("selectedPrecip", precipitationUnit);
        localStorage.setItem("selectedDist", distanceUnit);
    },[city, tempUnit, speedUnit, pressureUnit, precipitationUnit, distanceUnit]);      

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
                                                <p className="normal-text">Feels like {data.current.feelslike_c}°C</p>
                                            </>
                                        ) 
                                        : (
                                            <>
                                                <p className="current-temp">{data.current.temp_f}°F</p>
                                                <p className="normal-text">Feels like {data.current.feelslike_f}°F</p>
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
                                    ? <p className="normal-text">Wind Speed: {data.current.wind_kph}kph</p>
                                    : <p className="normal-text">Wind Speed: {data.current.wind_mph}mph</p>
                                }
                                <p className="normal-text">Wind Direction: {data.current.wind_degree} {data.current.wind_dir}</p>
                                <p className="normal-text">Humidity: {data.current.humidity}</p>
                                <p className="normal-text">Clouds: {data.current.cloud}</p>
                                <p className="normal-text">UV: {data.current.uv}</p>
                            </div>
                            <div className="current22">
                                {pressureUnit === "mb" 
                                    ? <p className="normal-text">Pressure: {data.current.pressure_mb}mb</p>
                                    : <p className="normal-text">Pressure: {data.current.pressure_in}in</p>
                                }
                                {precipitationUnit === "mm" 
                                    ? <p className="normal-text">Precipitation: {data.current.precip_mm}mm</p>
                                    : <p className="normal-text">Precipitation: {data.current.precip_in}in</p>
                                }
                                {distanceUnit === "km" 
                                    ? <p className="normal-text">Visual clarity: {data.current.vis_km}km</p> 
                                    : <p className="normal-text">Visual clarity: {data.current.vis_miles}miles</p>
                                }
                                {speedUnit === "kph" 
                                    ? <p className="normal-text">Gust Speed: {data.current.gust_kph}kph</p>
                                    : <p className="normal-text">Gust Speed: {data.current.gust_mph}mph</p>
                                }
                                <p className="normal-text">Lat: {data.location.lat}, Lat: {data.location.lon}</p>
                            </div>
                        </div>
                    </div>

                    <h3>7 Day Forecast</h3>
                    <div className="day">
                        {data.forecast.forecastday.slice(0, 7).map((day, index) => (
                        <div key={index} className="one-day">
                            <p className="normal-text">{day.date}</p>
                            <p className="normal-text">{day.day.condition.text}</p>
                            <img src={day.day.condition.icon} alt={day.day.condition.text}/>
                            {tempUnit === "°C" 
                                ? <p className="normal-text">Average Temperature: {day.day.avgtemp_c}°C</p>
                                : <p className="normal-text">Average Temperature: {day.day.avgtemp_f}°F</p>
                            }
                            <button className="more-button" onClick={()=>
                                navigate("/day", {
                                    state: {
                                        selectedDay: day,
                                        data,
                                        tempUnit: tempUnit,
                                        speedUnit: speedUnit,
                                        distanceUnit: distanceUnit,
                                        pressureUnit: pressureUnit,
                                        precipitationUnit: precipitationUnit,
                                    }
                                })
                            }>
                                Show More
                            </button>
                        </div>
                        ))}
                    </div>


                    <h3>Hourly Forecast</h3>
                    <div className="hour">
                        {data.forecast.forecastday[0].hour.map((hour, index) => (
                            <div key={index} className="one-hour">
                                <p className="normal-text">Time: {hour.time.split(' ')[1]}</p>
                                <p className="normal-text">{hour.condition.text}</p>
                                <img src={hour.condition.icon} alt={hour.condition.text}/>
                                {tempUnit === "°C" 
                                    ? <p className="normal-text">Temperature: {hour.temp_c}°C</p>
                                    : <p className="normal-text">Temperature: {hour.temp_f}°F</p>
                                }
                                <button className="more-button" onClick={()=>
                                    navigate("/hour", {
                                        state: {
                                            selectedHour: hour, 
                                            data, 
                                            tempUnit: tempUnit,
                                            speedUnit: speedUnit,
                                            distanceUnit: distanceUnit,
                                            pressureUnit: pressureUnit,
                                            precipitationUnit: precipitationUnit,
                                        }
                                    })
                                }>
                                    Show More
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
export  default Weather;



