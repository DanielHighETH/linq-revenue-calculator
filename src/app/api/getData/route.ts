import { NextResponse } from 'next/server'
import numeral from 'numeral';
require('dotenv').config()
export const revalidate = 0;





async function fetchEthereumPrice() {
    try {
        const ethereumPriceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&time=${Date.now()}`, {
            next: { revalidate: 0 }
          });

          const ethereumPriceData = await ethereumPriceRes.json();
          const ethereumPrice = ethereumPriceData.ethereum.usd;
      
          return ethereumPrice;
        } catch (error) {
            console.error(`Error: ${error}`)
            throw error
    }
}

export async function GET() {
  try {
    const duneRes = await fetch(`https://api.dune.com/api/v1/query/2966109/results?api_key=${process.env.DUNE_API_KEY}&time=${Date.now()}`, {
      next: { revalidate: 0 }
    })

    const duneRes2 = await fetch(`https://api.dune.com/api/v1/query/2963647/results?api_key=${process.env.DUNE_API_KEY}&time=${Date.now()}`, {
      next: { revalidate: 0 }
    })

    /*const duneRes3 = await fetch(`https://api.dune.com/api/v1/query/2963777/results?api_key=${process.env.DUNE_API_KEY}&time=${Date.now()}`, {
      next: { revalidate: 0 }
    })*/

    const duneRes4 = await fetch(`https://api.dune.com/api/v1/query/2957275/results?api_key=${process.env.DUNE_API_KEY}&time=${Date.now()}`, {
      next: { revalidate: 0 }
    })


    const duneData = await duneRes.json() //ok
    const duneData2 = await duneRes2.json() //25k
   // const duneData3 = await duneRes3.json() //100k
    const duneData4 = await duneRes4.json() //30k

    const ethereumPrice = await fetchEthereumPrice();

    const data = { 
      annualizedTaxAPR: numeral(duneData.result.rows[0].annualizedTaxAPR).format('0,0.00'),
      lpTokenPriceUSD: numeral(duneData.result.rows[0].lpTokenPriceUSD).format('0,0.00'),
      totalNumberOfHoldersLP: numeral(duneData4.result.rows[0].totalNumberOfHolders).format('0,0'),
      totalLPTokenMcapUSD: numeral(duneData4.result.rows[0].totalLPTokenMcapUSD).format('0,0'),
      lifetimeTotalTaxRevenueETH: numeral(duneData.result.rows[0].lifetimeTotalTaxRevenueETH).format('0,0.00'),
      closePriceUSD: numeral(duneData2.result.rows[0].closePriceUSD).format('0,0.00000'), //linq token
      mcapUSD: numeral(duneData2.result.rows[0].mcapUSD).format('0,0'), //linq token mcap
      //totalNumberOfHolders: numeral(duneData3.result.rows[0].totalNumberOfHolders).format('0,0'), //linq holders
      totalNumberOfHolders: "NaN", 
      totalLiquidityUSD: numeral(duneData2.result.rows[0].totalLiquidityUSD).format('0,0'), //linq token
      ethereumPrice: ethereumPrice,
      ethereumPriceString: numeral(ethereumPrice).format('0,0.00')
    }


    return NextResponse.json({ data })

  } catch (error) {
    console.error(`Error: ${error}`)
    throw error
  }
}