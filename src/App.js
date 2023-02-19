import React  from "react";
import { useState } from "react";
import "./App.css"
function App(){
    const apiKey='faaea469f097f09e6653b752c108dbd7';
    const [weatherData,setWeatherData]=useState([{}])
    const [city,setCity]=useState("")
    const getWeather=(event)=>{
        if(event.key==="Enter"){
            fetch('https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${apikey}') 
            .then(response=>response.json())
            .then(data=>{setWeatherData(data)})
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
        </div>
    )
}
export default App;