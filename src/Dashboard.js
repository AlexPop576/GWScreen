import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

import logo from './assets/logo.png';
import tempIcon from './assets/soilTemperature.png';
import humidityIcon from './assets/soilHumidity.png';
import nitrogenIcon from './assets/NitroIco.png';
import phosphorusIcon from './assets/PhospIco.png';
import potassiumIcon from './assets/PotasIco.png';

const plantRanges = {
  Tomato: {
    temperature: [10.0, 30.0],
    humidity: [50.0, 80.0],
    nitrogen: [40.0, 60.0],
    phosphorus: [30.0, 50.0],
    potassium: [40.0, 70.0],
  },
  Cucumber: {
    temperature: [10.0, 30.0],
    humidity: [50.0, 80.0],
    nitrogen: [40.0, 60.0],
    phosphorus: [30.0, 50.0],
    potassium: [40.0, 70.0],
  },
  Carrots: {
    temperature: [10.0, 30.0],
    humidity: [50.0, 80.0],
    nitrogen: [40.0, 60.0],
    phosphorus: [30.0, 50.0],
    potassium: [40.0, 70.0],
  },
  Potatoes: {
    temperature: [10.0, 30.0],
    humidity: [50.0, 80.0],
    nitrogen: [40.0, 60.0],
    phosphorus: [30.0, 50.0],
    potassium: [40.0, 70.0],
  },
};

const icons = {
  Temperature: tempIcon,
  Humidity: humidityIcon,
  Nitrogen: nitrogenIcon,
  Phosphorus: phosphorusIcon,
  Potassium: potassiumIcon,
};

export default function Dashboard() {
  const [sensorData, setSensorData] = useState([]);
  const [sensorName, setSensorName] = useState('SensorName');
  const [plantType, setPlantType] = useState('PlantType');

  const getMid = ([min, max]) => (min + max) / 2;

  useEffect(() => {
    const fetchData = () => {
      fetch('http://localhost:8000/sensors/gTsSy0/')
        .then((res) => res.json())
        .then((sensor) => {
          const plant = sensor.plant || 'Tomato';
          const rec = plantRanges[plant] || plantRanges['Tomato'];

          setSensorName(sensor.name || 'SensorName');
          setPlantType(sensor.plant || 'PlantType');


          const data = [
            {
              label: 'Temperature',
              value: sensor.temperature,
              unit: '°C',
              recommended: getMid(rec.temperature),
            },
            {
              label: 'Humidity',
              value: sensor.humidity === true || sensor.humidity === false ? sensor.humidity : null,
              unit: '%',
              recommended: getMid(rec.humidity),
            },
            {
              label: 'Nitrogen',
              value: sensor.nitrogen,
              unit: 'mg/kg',
              recommended: getMid(rec.nitrogen),
            },
            {
              label: 'Phosphorus',
              value: sensor.phosphorus,
              unit: 'mg/kg',
              recommended: getMid(rec.phosphorus),
            },
            {
              label: 'Potassium',
              value: sensor.potassium,
              unit: 'mg/kg',
              recommended: getMid(rec.potassium),
            },
          ];

          setSensorData(data);
        })
        .catch((error) => {
          console.error('Error fetching sensor data:', error);
        });
    };


    fetchData();

    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId); 
  }, []);
  

  const getPosition = (label, value, recommended) => {
    if (value === null || value === undefined) return 0;
  
    if (label === "Humidity") {
      return value === true ? 50 : 10;
    }
  
    const plant = plantType || 'Tomato';
    const range = plantRanges[plant][label.toLowerCase()];
    if (!range) return 50;
  
    const [min, max] = range;
    const mid = (min + max) / 2;
  
    if (value < min) {
      // Map [min-10%, min) to [10%, 40%]
      const clamped = Math.max(min - 10, value); // assume 10 units under max deviation
      return 15 + ((clamped - (min - 10)) / 10) * 30; // 30% span
    }
  
    if (value > max) {
      // Map (max, max+10] to [60%, 90%]
      const clamped = Math.min(max + 10, value);
      return 60 + ((clamped - max) / 10) * 30;
    }
  
    // Value is in range → map [min, max] to [40%, 60%]
    return 40 + ((value - min) / (max - min)) * 20;
  };
  
  
  
  
  
  
  

  // const getBarColor = (value, recommended) => {
  //   const diff = Math.abs(value - recommended);
  //   const maxDiff = recommended;
  //   const percent = Math.min(diff / maxDiff, 1);
  //   const r = Math.round(255 * percent);
  //   const g = Math.round(200 * (1 - percent) + 55);
  //   return `rgb(${r}, ${g}, 100)`;
  // };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <div className="logo-container">
          <img src={logo} alt="Growwise" className="logo" />
        </div>
        <h2>{sensorName}</h2>
        <p className="plant-type">Type: {plantType}</p>
      </div>

      <div className="dashboard-bars">
        {sensorData.map((item, index) => (
          <div key={index} className="sensor-bar">
           <div className="sensor-icon">
  <img 
    src={icons[item.label]} 
    alt={item.label} 
    className={item.label === 'Humidity' || item.label === 'Temperature'
      ? 'resize-icon-small'
      : item.label === 'Nitrogen' || item.label === 'Phosphorus' || item.label === 'Potassium'
        ? 'resize-icon-large'
        : 'default-icon'} 
  />
</div>

            <div className="sensor-info">
            <span className="sensor-value">
  {item.label === "Humidity"
    ? (item.value === true ? "Optimal" : "Dry")
    : item.value !== null && item.value !== undefined
      ? `${item.value} ${item.unit}`
      : `N/A ${item.unit}`}
</span>
              <div className="bar-track">
                <div className="bar-gradient"></div>
                <div className="bar-zones">
                  <div className="zone-line" style={{ left: '40%' }}></div>
                  <div className="zone-line" style={{ left: '60%' }}></div>
                </div>
                <div className="bar-indicator"
                    style={{ left: `${getPosition(item.label, item.value, item.recommended)}%` }}
                ></div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}