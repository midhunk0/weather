/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useState, useEffect } from "react";

const apiKey = process.env.REACT_APP_API_KEY;

const WeatherApp = () => {
    const [city, setCity] = useState("trivandrum");
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
                onClick={() => setUnitCallback(unit)}
                style={{ background: selectedUnit === unit ? "red" : "white", color: selectedUnit === unit ? "white" : "black", marginLeft:"10px", border:"1px solid black", borderRadius:"4px", padding:"10px"}}
            >
                {unit}
            </button>
        ))
    );

    useEffect(() => {
        if (city) {
            fetchForecast();
        }
    },[city]);

    const fetchForecast = async () => {
        setLoading(true);
        setError(null)
        try{
            const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`);
            const weatherData = await res.json();
            if(res.ok){
                setData(weatherData);
                console.log(weatherData);
            }
        }
        catch(error){
            setError("An error occured while fetching the forecast data");
        }
        finally{
            setLoading(false);
        }
    }

    const openUnits=()=>{
        setOpen(!open)
    }

    return (
<div className="weather-app">
    <h1>Weather App</h1>
    <div className="offcanvas-container">
        <input type="text" placeholder="Enter city name" value={city} onChange={(e) => setCity(e.target.value)} />
        <button className={`toggle-button ${open ? 'open' : ''}`} onClick={openUnits} >Open Units</button>
        <div className={`offcanvas-menu ${open ? 'open' : ''}`} onClick={openUnits} >
            <div className="offcanvas-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={openUnits}>Close Units</button>
                <ul>
                    <li>Temperature: {setUnit(['°C', '°F'], tempUnit, setTempUnit)}</li>
                    <li>Speed: {setUnit(['kph', 'mph'], speedUnit, setSpeedUnit)}</li>
                    <li>Pressure: {setUnit(['mb', 'in'], pressureUnit, setPressureUnit)}</li>
                    <li>Precipitation:{' '}{setUnit(['mm', 'in'], precipitationUnit, setPrecipitationUnit)}</li>
                    <li>Distance: {setUnit(['km', 'miles'], distanceUnit, setDistanceUnit)}</li>
                </ul>
            </div>
        </div>
    </div>



        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {data && (
            <div>
                <h2>Details of {data.location.name}, {data.location.region}, {data.location.country}</h2>
                <div className="current-div">                            
                    <div className="mid-div">
                        <img src={data.current.condition.icon} alt="weather-img" style={{margin:"0 40px", width:"100px", height:"100px"}}/>
                        <p>{data.current.condition.text}</p>
                        {tempUnit === "°C" 
                            ? (
                                <>
                                    <p>{data.current.temp_c}°C</p>
                                    <p>Feels {data.current.feelslike_c}°C</p>
                                </>
                            ) 
                            : (
                                <>
                                    <p>{data.current.temp_f}°F</p>
                                    <p>Feels {data.current.feelslike_f}°F</p>
                                </>
                            )
                        }
                    </div>
                    <div className="mid-div">
                        {speedUnit === "kph" 
                            ? <p>Wind Speed: {data.current.wind_kph}kph</p>
                            : <p>Wind Speed: {data.current.wind_mph}mph</p>
                        }
                        <p>Wind Direction: {data.current.wind_degree} {data.current.wind_dir}</p>
                    </div>
                    <div className="mid-div">
                        <p>Latitudes: {data.location.lat}</p>
                        <p>Logitudes: {data.location.lon}</p>
                        <p>Humidity: {data.current.humidity}</p>
                        <p>Clouds: {data.current.cloud}</p>
                        <p>UV: {data.current.uv}</p>
                    </div>
                    <div className="main-sub-div">
                        <div className="sub-div">
                            {pressureUnit === "mb" 
                                ? <p>Pressure: {data.current.pressure_mb}mb</p>
                                : <p>Pressure: {data.current.pressure_in}in</p>
                            }
                            {precipitationUnit === "mm" 
                                ? <p>Precipitation: {data.current.precip_mm}mm</p>
                                : <p>Precipitation: {data.current.precip_in}in</p>
                            }
                        </div>
                        <div className="sub-div">
                            {distanceUnit === "km" 
                                ? <p>Visual clarity: {data.current.vis_km}km</p> 
                                : <p>Visual clarity: {data.current.vis_miles}miles</p>
                            }
                            {speedUnit === "kph" 
                                ? <p>Gust Speed: {data.current.gust_kph}kph</p>
                                : <p>Gust Speed: {data.current.gust_mph}mph</p>
                            }
                        </div>
                    </div>
                </div>
                <h3>7 Day Forecast</h3>
                {data && data.forecast && data.forecast.forecastday && (
                    <div style={{display:"flex", overflowX:"auto", gap:"10px"}}>
                        {data.forecast.forecastday.slice(0, 7).map((day, index) => (
                        <div key={index} style={{display:"flex",flexDirection:"column", alignItems:"center", justifyContent:"center",gap:"10px", border:"1px solid black", borderRadius:"16px", padding:"10px", minWidth:"300px"}}>
                            <p>{day.date}</p>
                            <p>{day.day.condition.text}</p>
                            <img src={day.day.condition.icon} alt={day.day.condition.text} />
                            {tempUnit === "°C" 
                                ? (
                                    <>
                                        <p>Maximum Temperature: {day.day.maxtemp_c}°C</p>
                                        <p>Minimum Temperature: {day.day.mintemp_c}°C</p>
                                        <p>Average Temperature: {day.day.avgtemp_c}°C</p>
                                    </>
                                ) 
                                : (
                                    <>
                                        <p>Maximum Temperature: {day.day.maxtemp_f}°F</p>
                                        <p>Minimum Temperature: {day.day.mintemp_f}°F</p>
                                        <p>Average Temperature: {day.day.avgtemp_f}°F</p>
                                    </>
                                )
                            }
                            {speedUnit === "kph" 
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
                            <p>Moon Illumination: {day.astro.moon_illumination}</p>
                        </div>
                        ))}
                    </div>
                )}
                <h3>Hourly Forecast</h3>
                {data && data.forecast && data.forecast.forecastday && (
                    <div style={{display:"flex", overflowX:"auto", gap:"10px"}}>
                        {data.forecast.forecastday[0].hour.map((hour, index) => (
                            <div key={index} style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",gap:"10px", border:"1px solid black", borderRadius:"16px", padding:"10px", minWidth:"300px"}}>
                                <p>Time: {hour.time.split(' ')[1]}</p>
                                <p>{hour.condition.text}</p>
                                <img src={hour.condition.icon} alt={hour.condition.text}/>
                                {tempUnit === "°C" 
                                    ? (
                                        <>
                                            <p>Temperature: {hour.temp_c}°C</p>
                                            <p>Feels Like: {hour.feelslike_c}°C</p>
                                            <p>Wind Chill: {hour.windchill_c}°C</p>
                                            <p>Heat Index: {hour.heatindex_c}°C</p>
                                            <p>Dew Point: {hour.dewpoint_c}°C</p>
                                        </>
                                    ) 
                                    : (
                                        <>
                                            <p>Temperature: {hour.temp_f}°F</p>
                                            <p>Feels Like: {hour.feelslike_f}°F</p>
                                            <p>Wind Chill: {hour.windchill_f}°F</p>
                                            <p>Heat Index: {hour.heatindex_f}°F</p>
                                            <p>Dew Point: {hour.dewpoint_f}°F</p>                                                
                                        </>
                                    )
                                }
                                {speedUnit === "kph" 
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
                                <p>UV: {hour.uv}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

)}
</div>
    );
};

export default WeatherApp;


