import { getBodyWeights } from "@/lib/api/bodyWeight";

export default async function BodyWeightPage() {
    const data = await getBodyWeights();

    return (
        <main>
            <h1>BodyWeights Overview</h1>
            <ul>
                {data.map((bodyweight, b) => (
                    <li key={b}>
                        {bodyweight.date} — {bodyweight.weight}
                    </li>
                ))}
            </ul>
        </main>
    );
}