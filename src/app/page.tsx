'use client'
import { useState, useEffect } from 'react';

interface Calculation {
  usd: number;
  eth: number;
  linqLp: number;
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

interface StatisticsData {
  annualizedTaxAPR: string;
  lpTokenPriceUSD: string;
  totalNumberOfHoldersLP: string;
  totalLPTokenMcapUSD: string;
  lifetimeTotalTaxRevenueETH: string;
  closePriceUSD: string;
  mcapUSD: string;
  totalNumberOfHolders: string;
  totalLiquidityUSD: string;
  ethereumPrice: string;
  ethereumPriceString: string;
}


type Timeframe = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';

const timeframes: Timeframe[] = ['hourly', 'daily', 'weekly', 'monthly', 'yearly'];

const initialData: ApiData = {
  hourlyCalculation: { usd: 0.00, eth: 0.00, linqLp: 0.00 },
  dailyCalculation: { usd: 0.00, eth: 0.00, linqLp: 0.00 },
  weeklyCalculation: { usd: 0.00, eth: 0.00, linqLp: 0.00 },
  monthlyCalculation: { usd: 0.00, eth: 0.00, linqLp: 0.00 },
  yearlyCalculation: { usd: 0.00, eth: 0.00, linqLp: 0.00 },
}

const calculateLpRevenue = async (lpTokenAmount: number, ethereumPrice: string) => {
  const res = await fetch(`/api/calculate/${lpTokenAmount}?ethereumPrice=${ethereumPrice}`, {
    next: { revalidate: 0 }
  });
  const { data }: ApiResponse = await res.json();
  return data;
};

const getData = async (): Promise<StatisticsData> => {
  const res = await fetch('/api/getData', {
    next: { revalidate: 0 }
  });
  const { data }: { data: StatisticsData } = await res.json();
  return data;
};


function LPTokenCalculator({ ethereumPrice }: { ethereumPrice: string }) {
  const [linqLPValue, setLinqLPValue] = useState(0.00);
  const [data, setData] = useState(initialData);


  useEffect(() => {
    if (linqLPValue >= 3 && ethereumPrice) {
      calculateLpRevenue(linqLPValue, ethereumPrice)
        .then(fetchedData => {
          setData(fetchedData);
        })
        .catch(error => {
          console.error("Failed to fetch revenue data", error);
        });
    } else {
      setData(initialData);
    }
  }, [linqLPValue]);


  return (
    <div className="mt-10">
      <h1 className='text-4xl font-header'>LP Token Calculator</h1>

      <div className="mt-5">
        <label htmlFor="linqLPInput" className="block text-sm font-header2">
          Enter LINQ LP token amount:
        </label>
        <input
          id="linqLPInput"
          type="number"
          placeholder='93.12'
          onChange={e => setLinqLPValue(parseFloat(e.target.value))}
          className='border-2 border-zinc-600 bg-transparent w-30 px-2 py-1'
        />
      </div>

      <div className="overflow-auto border border-zinc-700 mt-5 w-full font-header2">
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
              timeframes.map((timeframe: Timeframe) => {
                const key = `${timeframe}Calculation` as keyof ApiData;
                return (
                  <tr className="flex" key={timeframe}>
                    <td className="flex w-1/4 flex-wrap items-center gap-x-4 p-4">{timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}</td>
                    <td className="flex w-1/4 flex-wrap items-center gap-x-4 p-4">{data[key].linqLp} <span className="text-linq-lp font-bold">$LINQ LP</span></td>
                    <td className="flex w-1/4 flex-wrap items-center gap-x-4 p-4">{data[key].eth} <span className="text-linq-lp font-bold">ETH</span></td>
                    <td className="flex w-1/4 flex-wrap items-center gap-x-4 p-4">{data[key].usd}<span className="text-linq-lp font-bold">$</span></td>
                  </tr>
                );
              })
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}



export default function Home() {
  const [selectedCalculator, setSelectedCalculator] = useState('LP TOKEN');
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [ethereumPrice, setEthereumPrice] = useState('0.00');

  useEffect(() => {
    getData().then(data => {
        setStatistics(data);
        setEthereumPrice(data.ethereumPrice);
    });
}, []);


  return (
    <div className="mt-10 flex-grow">
      <h1 className="text-4xl font-bold tracking-widest">LINQ Revenue Calculator</h1>
      <h3 className='text-xl uppercase'>Calculate your estimated revenue from <span className='font-bold'>LINQ PROTOCOL</span> at one place</h3>


      <div className="mt-10">
        <div className="flex space-x-4 font-header">
          {['LP TOKEN', 'Coming soon...', 'Coming soon... '].map((calculator) => (
            <button
              key={calculator}
              onClick={() => setSelectedCalculator(calculator)}
              className={`px-6 py-3 transition-colors ${selectedCalculator === calculator
                  ? 'bg-gray-500 text-white'
                  : calculator === 'Coming soon...'
                    ? 'bg-gray-300 text-gray-800 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-300'
                }`}
              disabled={calculator === 'Coming soon...'}
            >
              {calculator}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        {selectedCalculator === 'LP TOKEN' && <LPTokenCalculator ethereumPrice={ethereumPrice} />}
      </div>

      <div className="mt-10">
      <div className='mt-10 flex flex-col'>
  <h1 className='text-4xl font-header'>
    Live LINQ Statistics
  </h1>

  {statistics && (
    <>
      <div className='flex flex-col md:flex-row gap-5 mt-5'>
        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>LP Token APR</h1>
          <p className='text-2xl font-bold'>{statistics.annualizedTaxAPR} %</p>
        </div>

        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>LP Token Price</h1>
          <p className='text-2xl font-bold'>{statistics.lpTokenPriceUSD} $</p>
        </div>

        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>LP Token Holders</h1>
          <p className='text-2xl font-bold'>{statistics.totalNumberOfHoldersLP} ETH</p>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-5 mt-5'>
        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>Linq Price</h1>
          <p className='text-2xl font-bold'>{statistics.closePriceUSD} $</p>
        </div>

        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>Linq Market Cap</h1>
          <p className='text-2xl font-bold'>{statistics.mcapUSD} $</p>
        </div>

        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>Linq Holders</h1>
          <p className='text-2xl font-bold'>{statistics.totalNumberOfHolders}</p>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-5 mt-5'>
        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>Ethereum Price</h1>
          <p className='text-2xl font-bold'>{statistics.ethereumPriceString} $</p>
        </div>

        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>Lifetime Tax Fees</h1>
          <p className='text-2xl font-bold'>{statistics.lifetimeTotalTaxRevenueETH} ETH</p>
        </div>

        <div className='flex flex-col w-full bg-zinc-800 p-5 rounded-lg'>
          <h1 className='text-xl font-bold'>Linq Liquidity</h1>
          <p className='text-2xl font-bold'>{statistics.totalLiquidityUSD} $</p>
        </div>
      </div>
    </>
  )}
</div>
      </div>

    </div>
  )
}
