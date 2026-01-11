import axios from "axios";

export interface CurrencyObj {
  country: string;
  currencyCode: string;
  amount: number; // USD -> local currency
}

/**
 * Convert USD to local currency based on user location
 * Uses CORS-friendly, free APIs for both IP detection and Currency conversion.
 */
export const convertUSDToLocal = async (usdAmount: number): Promise<CurrencyObj> => {
  const result: CurrencyObj = {
    country: "",
    currencyCode: "USD",
    amount: usdAmount,
  };

  try {
    // 1️⃣ Detect user country by IP
    // FIX: Switch to 'ipwho.is' which allows CORS and is free without a key
    axios.defaults.withCredentials=true;
    const ipRes = await axios.get("https://ipwho.is/");
    console.log(ipRes)
    
    // Check if the IP API succeeded (it returns success: false on failure)
    if (!ipRes.data.success) {
        console.warn("IP Location failed:", ipRes.data.message);
        return result; // Fallback to USD
    }

    result.country = ipRes.data.country || "";
    const countryCode = ipRes.data.country_code; // e.g., "NP"

    // 2️⃣ Get currency code for that country
    // (RestCountries usually works, but if it fails, we default to USD)
    const countryInfo = await axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    const currencyCode = Object.keys(countryInfo.data[0].currencies || {})[0] || "USD";
    result.currencyCode = currencyCode;

    // 3️⃣ Get exchange rate relative to USD
    // FIX: Use GitHub/CDN hosted API (No rate limit, No CORS, Always Free)
    const rateRes = await axios.get(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`
    );

    // FIX: This API uses LOWERCASE currency codes
    const targetCode = currencyCode.toLowerCase();
    
    // FIX: Access safely with optional chaining
    const rate = rateRes.data?.usd?.[targetCode] || 1;

    // 4️⃣ Convert USD to local currency
    result.amount = Number((usdAmount * rate).toFixed(2));

    return result;
  } catch (err) {
    // Log the error but don't crash the app
    console.error("Currency conversion error:", err);
    return result; // Safely return USD fallback
  }
};