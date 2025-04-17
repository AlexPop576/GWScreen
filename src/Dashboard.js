import React, { useState } from 'react';
import './Dashboard.css';

const data = [
  { label: 'Humidity', value: '60%', details: 'Humidity is at an optimal level for most crops.' },
  { label: 'Temperature', value: '22°C', details: 'Temperature is within the ideal range for tomatoes.' },
  { label: 'Nitrogen', value: '35 ppm', details: 'Nitrogen level is sufficient for growth.' },
  { label: 'Phosphorus', value: '15 ppm', details: 'Consider supplementing phosphorus slightly.' },
  { label: 'Potassium', value: '20 ppm', details: 'Potassium level is stable and healthy.' },
];

export default function Dashboard() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <h1 className="title">Sensor Data</h1>
        <div className="card-grid">
          {data.map((item, index) => (
            <div className="card" key={index} onClick={() => setSelected(item)}>
              <div className="label">{item.label}</div>
              <div className="value">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-in Panel (no overlay) */}
      <div className={`side-panel ${selected ? 'show' : ''}`}>
        {selected && (
          <>
            <button className="close-btn" onClick={() => setSelected(null)}>×</button>
            <h2>{selected.label}</h2>
            <p className="big-value">{selected.value}</p>
            <p>{selected.details}</p>
          </>
        )}
      </div>
    </div>
  );
}
