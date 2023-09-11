'use client'
import { useState } from 'react';

interface Calculation {
  usd: number;
  eth: number;
  linq: number;
}

interface ApiData {
  hourlyCalculation: Calculation;
  dailyCalculation: Calculation;
  weeklyCalculation: Calculation;
  monthlyCalculation: Calculation;
  yearlyCalculation: Calculation;
}

interface ApiResponse {
  data: ApiData;
}

const initialData: ApiData = {
  hourlyCalculation: { usd: 0.00, eth: 0.00, linq: 0.00 },
  dailyCalculation: { usd: 0.00, eth: 0.00, linq: 0.00 },
  weeklyCalculation: { usd: 0.00, eth: 0.00, linq: 0.00 },
  monthlyCalculation: { usd: 0.00, eth: 0.00, linq: 0.00 },
  yearlyCalculation: { usd: 0.00, eth: 0.00, linq: 0.00 },
}

const calculateLpRevenue = async (lpTokenAmount: number, ethereumPrice: string) => {
  const res = await fetch(`/api/calculate/${lpTokenAmount}?ethereumPrice=${ethereumPrice}`, {
    next: { revalidate: 0 }
  });
  const { data }: ApiResponse = await res.json();
  return data;
};

function LPTokenCalculator() {
  const [linqLPValue, setLinqLPValue] = useState(0.00);
  const [data, setData] = useState(null);
  
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold">LP Token Calculator</h2>
      <p className="mt-2 text-gray-600">
        Calculate your estimated revenue from LINQ PROTOCOL LP TOKEN
      </p>
      
      <div className="mt-5">
        <label htmlFor="linqLPInput" className="block text-sm font-medium text-gray-700">
          Enter LINQ LP tokens:
        </label>
        <input
          id="linqLPInput"
          type="number"
          value={linqLPValue}
          onChange={e => setLinqLPValue(parseFloat(e.target.value))}
          className="mt-2 p-3 border border-gray-300 rounded-md"
        />
      </div>

      <div className="overflow-auto border border-zinc-700 mt-5 w-full">
        <table className="w-full">
          <thead className="border-b border-zinc-700">
            <tr className="flex">
              <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">Timeframe</th>
              <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">LINQ LP Revenue </th>
              <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">ETH Revenue</th>
              <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">USD Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-700">
            {data && (
              ['hourly', 'daily', 'weekly', 'monthly', 'yearly'].map(timeframe => (
                <tr className="flex" key={timeframe}>
                  <td className="flex w-1/4 flex-wrap items-center gap-x-4 p-4">{timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}</td>
                  <td className="flex w-1/4 flex-wrap items-center gap-x-4 p-4">{data[`${timeframe}Calculation`]} <span className="text-linq-lp font-bold">$LINQ LP</span></td>
                  <td className="flex w-1/4 flex-wrap items-center gap-x-4 p-4">{data[`${timeframe}Calculation`]} <span className="text-linq-lp font-bold">ETH</span></td>
                  <td className="flex w-1/4 flex-wrap items-center gap-x-4 p-4">{data[`${timeframe}Calculation`]}<span className="text-linq-lp font-bold">$</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



export default function Home() {
  const [selectedCalculator, setSelectedCalculator] = useState(''); // The selected calculator

  return (
    <div className="mt-10 flex-grow">
      <h1 className="text-4xl font-bold tracking-widest">LINQ Revenue Calculator</h1>
      <h3 className='text-xl uppercase'>Calculate your estimated revenue from <span className='font-bold'>LINQ PROTOCOL</span> at one place</h3>


      <div className="mt-10">
  <div className="flex space-x-4">
    {['LP TOKEN', 'Coming soon...', 'Coming soon...'].map((calculator) => (
      <button
        key={calculator}
        onClick={() => setSelectedCalculator(calculator)}
        className={`px-6 py-3 transition-colors ${
          selectedCalculator === calculator
            ? 'bg-sky-800 text-white'
            : calculator === 'Coming soon...'
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        disabled={calculator === 'Coming soon...'}
      >
        {calculator}
      </button>
    ))}
  </div>
</div>

<div className="mt-10">
        {selectedCalculator === 'LP TOKEN' && <LPTokenCalculator />}
      </div>



    </div>
  )
}
