import { NextResponse } from 'next/server'
import numeral from 'numeral';
require('dotenv').config()
export const revalidate = 0;

interface ethereumPrice {
    ethereumPrice: number;
}

async function fetchEthereumPrice(): Promise<ethereumPrice> {
    try {
        const ethereumPriceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&time=${Date.now()}`, {
            next: { revalidate: 0 }
          });

          const ethereumPriceData = await ethereumPriceRes.json();
          const ethereumPrice = ethereumPriceData.ethereum.usd;
      
          return {
            ethereumPrice: ethereumPrice
          }
        } catch (error) {
            console.error(`Error: ${error}`)
            throw error
    }
}

export async function GET() {
    
}