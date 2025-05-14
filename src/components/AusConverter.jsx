"use client"
import React, { useState } from 'react';

const AusConverter = () => {
  const [usdAmount, setUsdAmount] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [audAmount, setAudAmount] = useState(null);
  const [melbourneTime, setMelbourneTime] = useState(null);
  const [timezoneName, setTimezoneName] = useState('');
  const [inputString, setInputString] = useState('');
  const [summary, setSummary] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  /**
   * Converts USD to AUD and a timestamp to Melbourne time.
   * A beaut function, this one handles currency and time conversion
   * while ensuring results are fair dinkum for Oz.
   */
  const handleConvert = async () => {
    // Convert USD to AUD
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

          // Format date to Melbourne time
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

  /**
   * Processes the input string to calculate total time and amount in USD and AUD.
   */
  const handleSummary = async () => {
    if (!inputString) {
      setSummary(null);
      return;
    }

    const lines = inputString.split('\n').filter(line => line.trim());
    let totalMinutes = 0;
    let totalUsd = 0;

    lines.forEach(line => {
      // Parse USD amounts
      if (line.startsWith('$')) {
        const usdValue = parseFloat(line.replace('$', ''));
        if (!isNaN(usdValue)) {
          totalUsd += usdValue;
        }
      }
      // Parse time (hours and minutes)
      if (line.includes('h')) {
        const parts = line.split(' ');
        const hours = parseInt(parts[0].replace('h', ''));
        let minutes = 0;
        if (parts[1] && parts[1].includes('min')) {
          minutes = parseInt(parts[1].replace('min', ''));
        }
        if (!isNaN(hours)) {
          totalMinutes += hours * 60 + minutes;
        }
      }
    });

    // Convert total time to hours and minutes
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    // Convert USD to AUD
    const exRate = await fetchExchangeRate();
    const totalAud = (totalUsd * exRate).toFixed(2);

    setSummary({
      time: `${totalHours}h ${remainingMinutes}min`,
      usd: totalUsd.toFixed(2),
      aud: totalAud
    });
  };

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Dynamic classes based on theme
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const containerBg = isDarkMode ? 'bg-black/40 border-black/20' : 'bg-white/30 border-white/20';
  const inputBg = isDarkMode ? 'bg-gray-800/30 border-gray-700/30' : 'bg-white/20 border-white/30'; // Changed dark mode input shade
  const resultBgGreen = isDarkMode ? 'bg-green-900/20 border-green-700/30' : 'bg-green-100/20 border-green-200/30';
  const resultBgBlue = isDarkMode ? 'bg-blue-900/20 border-blue-700/30' : 'bg-blue-100/20 border-blue-200/30';
  const resultBgPurple = isDarkMode ? 'bg-purple-900/20 border-purple-700/30' : 'bg-purple-100/20 border-purple-200/30';
  const placeholderColor = isDarkMode ? 'placeholder-gray-300' : 'placeholder-gray-600';
  const focusRing = isDarkMode ? 'focus:ring-gray-400/50' : 'focus:ring-white/50';
  const bgOverlay = isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)';

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundColor: bgOverlay,
        backdropFilter: "blur(10px)"
      }}
    >
      {/* Blurry Color Blobs Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-purple-500/40 rounded-full filter blur-3xl"></div> {/* Moved closer */}
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/40 rounded-full filter blur-3xl"></div> {/* Moved closer */}
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-pink-500/40 rounded-full filter blur-3xl"></div> {/* Moved closer */}
        <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-green-500/40 rounded-full filter blur-3xl"></div> {/* Moved closer */}
      </div>

      <div className={`max-w-lg mx-auto p-6 backdrop-blur-lg ${containerBg} border rounded-xl shadow-lg relative z-10`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${textColor} drop-shadow-md`}>Aussie Currency & Time Converter</h2>
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-lg backdrop-blur-md ${isDarkMode ? 'bg-gray-700/30 hover:bg-gray-600/40' : 'bg-gray-200/30 hover:bg-gray-300/40'} border ${isDarkMode ? 'border-gray-600/50' : 'border-gray-300/50'} ${textColor} transition duration-200`}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* USD to AUD Conversion */}
          <div className="w-full md:w-1/2">
            <label className={`block mb-2 font-medium ${textColor} drop-shadow-sm`}>USD Amount (Yankee dollars):</label>
            <input
              type="number"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              placeholder="Pop in that USD amount"
              className={`w-full p-2 backdrop-blur-md ${inputBg} rounded-lg ${textColor} ${placeholderColor} focus:outline-none focus:ring-2 ${focusRing}`}
            />
            {audAmount !== null && (
              <div className={`mt-2 p-2 backdrop-blur-md ${resultBgGreen} rounded-lg`}>
                <p className={`${textColor} drop-shadow-sm`}>AUD: ${audAmount}</p>
              </div>
            )}
          </div>

          {/* Timestamp to Melbourne Time */}
          <div className="w-full md:w-1/2">
            <label className={`block mb-2 font-medium ${textColor} drop-shadow-sm`}>UNIX Timestamp (milliseconds):</label>
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="Enter timestamp (e.g., 1743413520776)"
              className={`w-full p-2 backdrop-blur-md ${inputBg} rounded-lg ${textColor} ${placeholderColor} focus:outline-none focus:ring-2 ${focusRing}`}
            />
            {melbourneTime && (
              <div className={`mt-2 p-2 backdrop-blur-md ${resultBgBlue} rounded-lg`}>
                <p className={`${textColor} drop-shadow-sm`}>{melbourneTime}</p>
                <p className={`text-sm ${textColor} drop-shadow-sm`}>{timezoneName}</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleConvert}
          className={`w-full backdrop-blur-md ${isDarkMode ? 'bg-blue-700/30 hover:bg-blue-600/40' : 'bg-blue-500/30 hover:bg-blue-600/40'} ${textColor} font-medium py-2 px-4 rounded-lg border ${isDarkMode ? 'border-blue-600/50' : 'border-blue-300/50'} transition duration-200 focus:outline-none focus:ring-2 ${focusRing} mb-6`}
        >
          Give it a burl!
        </button>

        {/* Section for String Input Summary */}
        <div className="mb-6">
          <label className={`block mb-2 font-medium ${textColor} drop-shadow-sm`}>Input String (Earnings & Time):</label>
          <textarea
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            placeholder="Paste string with USD amounts and time (e.g., $125.13, 2h 45min)"
            className={`w-full p-2 backdrop-blur-md ${inputBg} rounded-lg ${textColor} ${placeholderColor} focus:outline-none focus:ring-2 ${focusRing} min-h-[150px]`}
          />
          <button
            onClick={handleSummary}
            className={`w-full backdrop-blur-md ${isDarkMode ? 'bg-purple-700/30 hover:bg-purple-600/40' : 'bg-purple-500/30 hover:bg-purple-600/40'} ${textColor} font-medium py-2 px-4 rounded-lg border ${isDarkMode ? 'border-purple-600/50' : 'border-purple-300/50'} transition duration-200 focus:outline-none focus:ring-2 ${focusRing} mt-2`}
          >
            Calculate Summary
          </button>
          {summary && (
            <div className={`mt-2 p-2 backdrop-blur-md ${resultBgPurple} rounded-lg`}>
              <p className={`${textColor} drop-shadow-sm`}>Total Time: {summary.time}</p>
              <p className={`${textColor} drop-shadow-sm`}>Total Amount (USD): ${summary.usd}</p>
              <p className={`${textColor} drop-shadow-sm`}>Total Amount (AUD): ${summary.aud}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AusConverter;