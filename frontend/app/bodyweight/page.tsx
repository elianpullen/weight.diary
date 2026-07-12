import {getBodyWeights} from "@/lib/api/bodyWeight";
import Link from "next/link";

export default async function BodyWeightPage() {
    const data = await getBodyWeights();

    return (
        <div>
            <h1>Bodyweights in KG</h1>
            <div
                className="col-start-1 row-start-1 grid grid-cols-4 gap-4 rounded-lg text-center font-mono text-sm leading-6 font-bold text-white">

                {data.map((bodyweight, b) => (
                    // {bodyweight.date}
                    // {bodyweight.id}
                    <div key={b} className="rounded-lg bg-fuchsia-500 p-4">{bodyweight.weight}
                        <Link href={`/bodyweight/${bodyweight.id}/edit`}
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-[8px] leading-none font-bold px-1 rounded-sm">
                            E
                        </Link>

                        <Link href={`/bodyweight/${bodyweight.id}/delete`}
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-[8px] leading-none font-bold px-1 rounded-sm">
                            D
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}