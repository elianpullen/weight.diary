import Link from "next/link";

export default function HomePage() {
    return (
        <main>
            <h1>Home</h1>
            <nav>
                <ul>
                    <li>
                        <Link href="/bodyweight">BodyWeight Index</Link>
                    </li>
                    <li>
                        <Link href="/bodyweight/create">BodyWeight Create</Link>
                    </li>
                </ul>
            </nav>
        </main>
    );
}