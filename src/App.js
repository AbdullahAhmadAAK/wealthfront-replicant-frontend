import React, { useState, useEffect } from 'react';
import axios from 'axios';
require('dotenv').config()

const App = () => {
  const [stocksData, setStocksData] = useState([])
  const [selectedRiskStockData, setSelectedRiskStockData] = useState({})
  const [selectedRiskScore, setSelectedRiskScore] = useState(0.0)
  const [stockKeyNameMappings, setStockKeyNameMappings] = useState([])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/stockNames`)
      .then(response => {
        setStockKeyNameMappings(response.data)
      })
      .catch(error => console.error(error));
  }, [])

  useEffect(() => {
    // Fetch data from the Express server
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/stocks`)
      .then(response => {
        setStocksData(response.data)
      })
      .catch(error => console.error(error));
  }, [stockKeyNameMappings]);

  useEffect(() => {
    const selectedData = stocksData.find(stockData => stockData.riskScore === selectedRiskScore)
    setSelectedRiskStockData(selectedData)
  }, [stocksData, selectedRiskScore])

  const handleChangeRiskScore = (e) => {
    const newRiskScore = parseFloat(e.target.value)
    setSelectedRiskScore(newRiskScore)
  }

  return (
    <div className='bg-light-blue-to-light-orange pt-200px'>

      <div className='data-section'>
        <div className='left-section'>
          
          <div className="slider-container">
            <div style={{ display: 'flex', justifyContent: "space-between"}}>
              <span id="risk-score">Risk Score: {selectedRiskScore.toFixed(1)}</span>
              <span>Example Portfolio</span>
            </div>
            
            <input
              type="range"
              id="risk-slider"
              min="0"
              max="10"
              value={selectedRiskScore}
              onChange={(e) => handleChangeRiskScore(e)}
            />
            
          </div>

          <div className='nonzero-stocks-section'>
            {selectedRiskStockData !== undefined && (

              Object.keys(selectedRiskStockData).map(key => {

                if (key === "riskScore" || key === "_id") return;

                const value = selectedRiskStockData[key]
                if (value === 0.0) return;

                const title = stockKeyNameMappings.find(mapping => mapping.key === key)?.name
                const bgColor = stockKeyNameMappings.find(mapping => mapping.key === key)?.bgColor

                return (
                  <div className='text-white flex text-18px'>
                    <p className='percentage-bar-label margin-0'>{title}</p>

                    <div style={{ width: `${value * 1500}px`, backgroundColor: bgColor }} className='percentage-bar'>
                      {(value * 100).toFixed(0)} %
                    </div>
                  </div>
                )
              })

            )}
          </div>

          <div className='zero-stocks-section'>
            {selectedRiskStockData !== undefined && (

              Object.keys(selectedRiskStockData).map(key => {

                if (key === "riskScore" || key === "_id") return;

                const value = selectedRiskStockData[key]
                if (value !== 0.0) return;

                const title = stockKeyNameMappings.find(mapping => mapping.key === key)?.name

                return (
                  <div className='zero-stock-text'>
                    <span>{title}</span>
                    <span>{value}%</span>
                  </div>
                )
              })

            )}
          </div>


        </div>

        <div className='right-section'>

          <div className='right-section-info'>
            <h4 className='text-40 margin-0'>Smarter investing, brilliantly personalized.</h4>
            <p>Just answer a few questions, and we’ll build you a personalized portfolio of low-cost index funds from up to 17 global asset classes. Our software handles all the trading, rebalancing, and other busywork to help grow your wealth for the long term.</p>
            <button className='get-started-btn'>Get Started</button>
          </div>
          
        </div>

      </div>

    </div>
  );
};
export default App;
