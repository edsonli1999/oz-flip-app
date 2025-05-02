"use client"
import React, { useState } from 'react';

const AusConverter = () => {
  const [usdAmount, setUsdAmount] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [audAmount, setAudAmount] = useState(null);
  const [melbourneTime, setMelbourneTime] = useState(null);
  const [timezoneName, setTimezoneName] = useState('');
  const [calculationResult, setCalculationResult] = useState(null);

  /**
   * Converts USD to AUD and a timestamp to Melbourne time.
   * A beaut function, this one handles currency and time conversion
   * while ensuring results are fair dinkum for Oz.
   */
  const handleConvert = async () => {
    if (usdAmount) {
      const exRate = await fetchExchangeRate();
      console.log(`Stoked, currently 1 USD = ${exRate} AUD`);
      const audValue = parseFloat(usdAmount) * exRate;
      setAudAmount(audValue.toFixed(2));
    }

    // Convert timestamp to Melbourne time
    if (timestamp) {
      try {
        const timestampNum = parseInt(timestamp);
        if (!isNaN(timestampNum)) {
          const date = new Date(timestampNum);
          const melbourneTimeStr = new Intl.DateTimeFormat('en-AU', {
            timeZone: 'Australia/Melbourne',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }).format(date);

          // Determine if it's AEDT or AEST
          const offsetMinutes = new Date(date).toLocaleString('en-AU', {
            timeZone: 'Australia/Melbourne',
            timeZoneName: 'short'
          });

          // Check if it's AEDT (UTC+11) or AEST (UTC+10)
          const isDST = offsetMinutes.includes('AEDT');
          const timeZone = isDST ? 'AEDT: UTC+11' : 'AEST: UTC+10';

          setMelbourneTime(melbourneTimeStr);
          setTimezoneName(timeZone);
        }
      } catch (error) {
        console.error("Oh no, mate! Error converting timestamp:", error);
        setMelbourneTime("Bit of a dodgy timestamp");
        setTimezoneName("");
      }
    }
  };

  const calculateTotals = async (inputString) => {
    // Split the input into lines
    const lines = inputString.split('\n').filter(line => line.trim() !== '');

    let totalHours = 0, totalMinutes = 0, totalUsd = 0;

    // Parse each line
    for (const line of lines) {
      if (line.startsWith('$')) {
        totalUsd += parseFloat(line.substring(1));
      } else if (line.includes('h') && line.includes('min')) {
        const [hours, minutes] = line.split(' ');
        totalHours += parseInt(hours);
        totalMinutes += parseInt(minutes.replace('min', ''));
      }
    }

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;

    const exRate = await fetchExchangeRate();
    const totalAud = (totalUsd * exRate).toFixed(2);

    setCalculationResult({
      totalTime: `${totalHours}h ${totalMinutes}min`,
      totalUsd: totalUsd.toFixed(2),
      totalAud
    });
  };



  /**
   * Fetches the latest exchange rate for USD to AUD.
   * A real beaut - pulls the latest rate
   * so your mates will know the right amount of dollarydoos.
   * 
   * @returns {Promise<number>} The current exchange rate for 1 USD to AUD
   * @throws Will throw an error if fetching the rate fails
   */
  const fetchExchangeRate = async () => {
    const targetCurrency = 'AUD';
    
    // Note: Since this is API key is free and doesn't reveal much sensitive info
    // I'll decide to just host on github despite it technically being bad practice
    const appId = 'b90b688b584a4915a811adf3379dc9fe';
    const url = `https://openexchangerates.org/api/latest.json?app_id=${appId}&symbols=${targetCurrency}&prettyprint=false`;


    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Struth! HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.rates && data.rates[targetCurrency]) {
        return data.rates[targetCurrency];
      } else {
        throw new Error(`Crikey! Exchange rate for ${targetCurrency} not found`);
      }
    } catch (error) {
      console.error('Strewth, mate! Error fetching exchange rate:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Aussie Currency & Time Converter</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* USD to AUD Conversion */}
        <div className="w-full md:w-1/2">
          <label className="block mb-2 font-medium">USD Amount (Yankee dollars):</label>
          <input
            type="number"
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            placeholder="Pop in that USD amount"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {audAmount !== null && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
              <p className="text-black">AUD: ${audAmount}</p>
            </div>
          )}
        </div>

        {/* Timestamp to Melbourne Time */}
        <div className="w-full md:w-1/2">
          <label className="block mb-2 font-medium">UNIX Timestamp (milliseconds):</label>
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="Enter timestamp (e.g., 1743413520776)"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {melbourneTime && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
              <p className="text-black">{melbourneTime}</p>
              <p className="text-sm text-black">{timezoneName}</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleConvert}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
      >
        Give it a burl!
      </button>

      {/* Textarea for input string and a button for calculating totals */}
      <textarea
        rows="6"
        className="w-full p-2 mt-4 border border-gray-300 rounded"
        placeholder="Enter the details here..."
        id="detailsInput"
      ></textarea>
      <button
        onClick={() => calculateTotals(document.getElementById('detailsInput').value)}
        className="w-full bg-green-500 mt-4 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
      >
        Calculate Totals
      </button>

      {calculationResult && (
        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-black">Total time: {calculationResult.totalTime}</p>
          <p className="text-black">Total amount (USD): ${calculationResult.totalUsd}</p>
          <p className="text-black">Total amount (AUD): ${calculationResult.totalAud}</p>
        </div>
      )}
    </div>
  );
};

export default AusConverter;