import React, { useState } from 'react';
import './Dashboard.css';

const data = [
  { label: 'Humidity', value: 60, unit: '%', recommended: 65, details: 'Humidity is at an optimal level for most crops.' },
  { label: 'Temperature', value: 22, unit: '°C', recommended: 24, details: 'Temperature is within the ideal range for tomatoes.' },
  { label: 'Nitrogen', value: 35, unit: 'ppm', recommended: 40, details: 'Nitrogen level is sufficient for growth.' },
  { label: 'Phosphorus', value: 15, unit: 'ppm', recommended: 18, details: 'Consider supplementing phosphorus slightly.' },
  { label: 'Potassium', value: 20, unit: 'ppm', recommended: 25, details: 'Potassium level is stable and healthy.' },
  { label: 'Luminosity', value: 750, unit: 'lx', recommended: 1000, details: 'Light levels are adequate for photosynthesis.' },
];

export default function Dashboard() {
  const [selected, setSelected] = useState(null);

  const getPosition = (value, recommended) => {
    const diff = (value - recommended) / recommended;
    return Math.max(0, Math.min(100, 50 + diff * 50));
  };

  const getBarColor = (value, recommended) => {
    const diff = Math.abs(value - recommended);
    const maxDiff = recommended;
    const percent = Math.min(diff / maxDiff, 1);
    const r = Math.round(255 * percent);
    const g = Math.round(200 * (1 - percent) + 55);
    return `rgb(${r}, ${g}, 100)`;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <h1 className="title">Sensor Data</h1>
        <div className="card-grid">
          {data.map((item, index) => (
            <div className="card" key={index} onClick={() => setSelected(item)}>
              <div className="label">{item.label}</div>
              <div className="value">{item.value} {item.unit}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`side-panel ${selected ? 'show' : ''}`}>
        {selected && (
          <div className="sidebar-content">
            <button className="close-btn" onClick={() => setSelected(null)}>×</button>

            <div className="top-section">
              <h2>{selected.label}</h2>
              <p className="big-value">{selected.value} {selected.unit}</p>
              <p>{selected.details}</p>
            </div>

            <div className="bottom-section">
              <label>Recommended: {selected.recommended} {selected.unit}</label>
              <div className="progress-bar-wrapper">
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{
                      backgroundColor: getBarColor(selected.value, selected.recommended),
                    }}
                  ></div>

                  <div className="marker center" title="Recommended"></div>
                  <div
                    className="marker"
                    style={{
                      left: `${getPosition(selected.value, selected.recommended)}%`,
                    }}
                    title="Current value"
                  ></div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
