import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between border-b p-4">
            <h1 className="text-xl font-bold">Weight Diary</h1>

            <div className="flex gap-6">
                <Link href="/">Home</Link>
                <Link href="/bodyweight">Bodyweight Index</Link>
                <Link href="/bodyweight/create">Bodyweight Create</Link>
            </div>
        </nav>
    );
}