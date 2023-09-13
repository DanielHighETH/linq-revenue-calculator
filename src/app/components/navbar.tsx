import Link from 'next/link';

export default function Navbar() {

    return (
        <nav className="flex items-center justify-between flex-wrap">
            <div className="flex items-center flex-shrink-0 text-white gap-5 font-bold text-lg uppercase font-header">
                <Link href="/">Home</Link>
                <Link href="https://dune.com/whale_hunter/linq-protocol" target='blank'>Data</Link>
                </div>
        </nav>
    );
}