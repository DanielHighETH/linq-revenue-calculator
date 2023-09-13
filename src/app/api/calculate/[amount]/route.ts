import { NextResponse } from "next/server";
import numeral from 'numeral';
require('dotenv').config()


export const revalidate = 0;

export async function GET(request: Request){
    const url = new URL(request.url);
    const amount: number = Number(url.pathname.split("/").pop());
    const params = new URLSearchParams(request.url.slice(request.url.indexOf('?')))
    const ethereumPrice = Number(params.get('ethereumPrice'));

  const duneRes = await fetch(`https://api.dune.com/api/v1/query/2966109/results?api_key=${process.env.DUNE_API_KEY}&time=${Date.now()}`, {
    next: { revalidate: 0 }
 } )
  const duneData = await duneRes.json()

  const annualizedTaxAPR = duneData.result.rows[0].annualizedTaxAPR
  const weeklyTaxAPR = duneData.result.rows[0].weeklyTaxAPR
  const dailyTaxAPR = duneData.result.rows[0].dailyTaxAPR
  const linqLpPrice = duneData.result.rows[0].lpTokenPriceUSD

  const yearlyCalculation = (linqLpPrice * amount) * (annualizedTaxAPR / 100)
  const monthlyCalculation = (linqLpPrice * amount) * (annualizedTaxAPR / 100) / 12
  const weeklyCalculation = (linqLpPrice * amount) * (weeklyTaxAPR / 100)
  const dailyCalculation = (linqLpPrice * amount) * (dailyTaxAPR / 100)
  const hourlyCalculation = (linqLpPrice * amount) * (dailyTaxAPR / 100) / 24

  const data = {
    hourlyCalculation: {
      usd: numeral(hourlyCalculation).format('0,0.00000'),
      eth: numeral(hourlyCalculation / ethereumPrice).format('0,0.00000'),
      linqLp: numeral(hourlyCalculation / linqLpPrice).format('0,0.00000')
    },
    dailyCalculation: {
      usd: numeral(dailyCalculation).format('0,0.00'),
      eth: numeral(dailyCalculation / ethereumPrice).format('0,0.00000'),
      linqLp: numeral(dailyCalculation / linqLpPrice).format('0,0.00000')
    },
    weeklyCalculation: {
      usd: numeral(weeklyCalculation).format('0,0.00'),
      eth: numeral(weeklyCalculation / ethereumPrice).format('0,0.00000'),
      linqLp: numeral(weeklyCalculation / linqLpPrice).format('0,0.00000')
    },
    monthlyCalculation: {
      usd: numeral(monthlyCalculation).format('0,0.00'),
      eth: numeral(monthlyCalculation / ethereumPrice).format('0,0.00000'),
      linqLp: numeral(monthlyCalculation / linqLpPrice).format('0,0.00000')
    },
    yearlyCalculation: {
      usd: numeral(yearlyCalculation).format('0,0.00'),
      eth: numeral(yearlyCalculation / ethereumPrice).format('0,0.00000'),
      linqLp: numeral(yearlyCalculation / linqLpPrice).format('0,0.00000')
  }
}

  return NextResponse.json({ data })

}