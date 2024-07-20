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
    console.log('New risk score: ', newRiskScore, typeof(newRiskScore))
    setSelectedRiskScore(newRiskScore)
  }

  return (
    <div>
      <h1>Stocks App</h1>

      <button onClick={() => console.log(selectedRiskStockData, selectedRiskScore, stocksData)}>test me bro</button>

      <label htmlFor="riskScore">Risk Score</label>
      <select id='riskScore' value={selectedRiskScore} onChange={(e) => handleChangeRiskScore(e)}>
        <option value={0}>0</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
      </select>      

      {selectedRiskStockData !== undefined && Object.keys(selectedRiskStockData).map(key => {

        if (key === "riskScore" || key === "_id") return;

        const title = stockKeyNameMappings.find(mapping => mapping.key === key)?.name
        const value = selectedRiskStockData[key]

        return (
          <h4>{title}: {value}%</h4>
        )
      
      
      })}


    </div>
  );
};
export default App;
