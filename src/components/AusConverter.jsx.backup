"use client"
import React, { useState, useEffect } from 'react';

const AusConverter = () => {
  const [usdAmount, setUsdAmount] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [audAmount, setAudAmount] = useState(null);
  const [melbourneTime, setMelbourneTime] = useState(null);
  const [timezoneName, setTimezoneName] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [bulkResult, setBulkResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  /**
   * Converts USD to AUD and a timestamp to Melbourne time.
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
   * Processes bulk input to calculate total time and amount
   */
  const handleBulkProcess = async () => {
    if (!bulkInput.trim()) {
      setBulkResult("Please enter some data to process");
      return;
    }

    const lines = bulkInput.trim().split('\n');
    let totalHours = 0;
    let totalMinutes = 0;
    let totalUSD = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Process dollar amounts
      if (line.startsWith('$')) {
        const amount = parseFloat(line.substring(1).replace(',', ''));
        if (!isNaN(amount)) {
          totalUSD += amount;
        }
      }
      
      // Process time entries (format: "2h 45min" or "3h 0min")
      if (line.includes('h') && line.includes('min')) {
        const hourMatch = line.match(/(\d+)h/);
        const minuteMatch = line.match(/(\d+)min/);
        
        if (hourMatch && hourMatch[1]) {
          totalHours += parseInt(hourMatch[1]);
        }
        
        if (minuteMatch && minuteMatch[1]) {
          totalMinutes += parseInt(minuteMatch[1]);
        }
      }
    }

    // Convert excess minutes to hours
    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes = totalMinutes % 60;
    }

    // Convert USD to AUD
    let totalAUD = null;
    try {
      const exRate = await fetchExchangeRate();
      totalAUD = (totalUSD * exRate).toFixed(2);
    } catch (error) {
      console.error("Error converting currency:", error);
    }

    // Format result
    let result = `Total time: ${totalHours}h ${totalMinutes}min\n`;
    result += `Total amount (USD): $${totalUSD.toFixed(2)}\n`;
    
    if (totalAUD !== null) {
      result += `Total amount (AUD): $${totalAUD}`;
    } else {
      result += `Total amount (AUD): Error fetching exchange rate`;
    }

    setBulkResult(result);
  };

  /**
   * Fetches the latest exchange rate for USD to AUD.
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

  return (
    <div className={`min-h-screen w-full py-12 px-4 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className={`min-h-screen w-full fixed inset-0 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
        {/* Background blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-20 w-96 h-96 rounded-full ${darkMode ? 'bg-purple-600' : 'bg-purple-300'} opacity-30 blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-40 right-20 w-80 h-80 rounded-full ${darkMode ? 'bg-blue-600' : 'bg-blue-300'} opacity-30 blur-3xl animate-pulse`} style={{animationDelay: '1s'}}></div>
          <div className={`absolute top-1/2 left-1/3 w-64 h-64 rounded-full ${darkMode ? 'bg-pink-600' : 'bg-pink-300'} opacity-30 blur-3xl animate-pulse`} style={{animationDelay: '2s'}}></div>
          <div className={`absolute bottom-20 left-20 w-72 h-72 rounded-full ${darkMode ? 'bg-teal-600' : 'bg-teal-300'} opacity-30 blur-3xl animate-pulse`} style={{animationDelay: '3s'}}></div>
        </div>
      </div>

      {/* Dark mode toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={toggleDarkMode} 
          className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
            darkMode 
              ? 'bg-gray-800 text-yellow-400 shadow-lg shadow-yellow-400/20' 
              : 'bg-white text-gray-800 shadow-lg shadow-gray-400/30'
          }`}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main container */}
      <div className="max-w-4xl mx-auto relative z-10 pt-8">
        <h1 className={`text-3xl md:text-4xl font-bold text-center mb-8 transition-colors duration-300 ${
          darkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Aussie Currency & Time Converter
        </h1>

        {/* Glassmorphism card */}
        <div className={`backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 border
          ${darkMode 
            ? 'bg-gray-800/40 border-gray-700/50 shadow-black/50' 
            : 'bg-white/40 border-white/50 shadow-black/10'
          }`}>
          
          {/* Main converter section */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* USD to AUD Conversion */}
              <div className="w-full md:w-1/2">
                <label className={`block mb-2 font-medium transition-colors duration-300 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  USD Amount (Yankee dollars):
                </label>
                <input
                  type="number"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(e.target.value)}
                  placeholder="Pop in that USD amount"
                  className={`w-full p-3 rounded-lg backdrop-blur-sm transition-all duration-300 border focus:outline-none focus:ring-2
                    ${darkMode 
                      ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500' 
                      : 'bg-white/50 border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-400'
                    }`}
                />
                {audAmount !== null && (
                  <div className={`mt-3 p-3 rounded-lg backdrop-blur-sm transition-all duration-300 border
                    ${darkMode 
                      ? 'bg-green-900/40 border-green-700/50 text-green-300' 
                      : 'bg-green-50/70 border-green-200 text-green-800'
                    }`}>
                    <p className="font-medium">AUD: ${audAmount}</p>
                  </div>
                )}
              </div>

              {/* Timestamp to Melbourne Time */}
              <div className="w-full md:w-1/2">
                <label className={`block mb-2 font-medium transition-colors duration-300 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  UNIX Timestamp (milliseconds):
                </label>
                <input
                  type="text"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  placeholder="Enter timestamp (e.g., 1743413520776)"
                  className={`w-full p-3 rounded-lg backdrop-blur-sm transition-all duration-300 border focus:outline-none focus:ring-2
                    ${darkMode 
                      ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500' 
                      : 'bg-white/50 border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-400'
                    }`}
                />
                {melbourneTime && (
                  <div className={`mt-3 p-3 rounded-lg backdrop-blur-sm transition-all duration-300 border
                    ${darkMode 
                      ? 'bg-blue-900/40 border-blue-700/50' 
                      : 'bg-blue-50/70 border-blue-200'
                    }`}>
                    <p className={`${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>{melbourneTime}</p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{timezoneName}</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleConvert}
              className={`w-full p-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                ${darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                }`}
            >
              Give it a burl!
            </button>
          </div>

          {/* Divider */}
          <div className={`border-t transition-colors duration-300 ${
            darkMode ? 'border-gray-700/50' : 'border-gray-300/50'
          }`}></div>

          {/* Bulk processing section */}
          <div className="p-6 md:p-8">
            <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Bulk Time & Amount Calculator
            </h3>
            <div className="mb-6">
              <label className={`block mb-2 font-medium transition-colors duration-300 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Paste your data:
              </label>
              <textarea
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="Paste data in format like:
$125.13
2h 45min
Apr 30
$136.50
3h 0min
..."
                className={`w-full p-3 rounded-lg backdrop-blur-sm font-mono h-48 transition-all duration-300 border focus:outline-none focus:ring-2 resize-none
                  ${darkMode 
                    ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:ring-green-500' 
                    : 'bg-white/50 border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-green-400'
                  }`}
              />
            </div>
            <button
              onClick={handleBulkProcess}
              className={`w-full p-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                ${darkMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30' 
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
                }`}
            >
              Calculate Totals
            </button>
            {bulkResult && (
              <div className={`mt-6 p-4 rounded-lg backdrop-blur-sm transition-all duration-300 border
                ${darkMode 
                  ? 'bg-gray-900/50 border-gray-700/50' 
                  : 'bg-white/60 border-gray-300/50'
                }`}>
                <pre className={`whitespace-pre-wrap font-mono text-sm transition-colors duration-300 ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {bulkResult}
                </pre>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-8 text-center text-sm">
          <p className={`transition-colors duration-300 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            © {new Date().getFullYear()} Aussie Converter | Fair dinkum exchange rates
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AusConverter;