import Link from 'next/link';

export default function Footer() {

    return (
        <footer>
            <div className='text-center mt-10 text-lg'>
                <p>Created by <a href='https://twitter.com/dhigh_eth' target='blank' className='text-sky-500 hover:text-sky-400 hover:underline'>@DanielHigh</a></p>
                <p>You can check the source code on <a href='https://github.com/DanielHighETH/linq-revenue-calculator' target='blank' className='text-sky-500 hover:text-sky-400 hover:underline'>GitHub</a></p>
            </div>
        </footer>
    );
}