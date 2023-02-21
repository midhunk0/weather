import React  from "react";
import { useState } from "react";
import "./App.css"
function App(){
    const [weatherData,setWeatherData]=useState([{}])
    const [city,setCity]=useState("")
    const apiKey=process.env.API_KEY;
    const apiUrl=`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    const getWeather=(event)=>{
        if(event.key==="Enter"){
            fetch(apiUrl)
            .then(response=>response.json())
            .then(data=>{
                setWeatherData(data) 
                setCity("")
            })
        }
    }
    return(
        <div className="container">
            <input 
                className="input" 
                placeholder="Enter a city..."
                onChange={e=>setCity(e.target.value)}
                value={city}
                onKeyPress={getWeather}
            />
            {typeof weatherData.main==='undefined'?(
                <div>
                    <p>Welcome to Weather App! Enter in a city to get the weather of. </p>
                </div>
            ):(
                <div className="weather-data">
                    <p className="city">{weatherData.name}</p>
                    <p className="temp">{Math.round(weatherData.main.temp)}oF</p>
                    <p className="weather">{weatherData.weather[0].main}</p>
                </div>
            )}
            {weatherData.cod==="404"?(
                <p>city not found</p>
            ):(
                <></>
            )}
        </div>
    )
}
export default App;