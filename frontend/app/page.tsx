import Link from "next/link";

export default function HomePage() {
  return (
      <main>
        <h1>Home</h1>
        <nav>
          <ul>
            <li>
              <Link href="/bodyweight">BodyWeight</Link>
            </li>
          </ul>
        </nav>
      </main>
  );
}