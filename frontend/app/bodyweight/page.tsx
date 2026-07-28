import {getBodyWeights} from "@/lib/api/bodyWeight";
import Link from "next/link";
import {BodyWeight} from "@/models/bodyWeight";
import WeightCell from "./components/WeightCell";

const DAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

function getISOWeekKey(date: Date): string {
    const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ));

    const dayNumber = utcDate.getUTCDay() || 7;

    utcDate.setUTCDate(
        utcDate.getUTCDate() + 4 - dayNumber
    );

    const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));

    const week = Math.ceil(
        (((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7
    );

    return `${utcDate.getUTCFullYear()}-${week}`;
}

function getDayIndex(date: Date): number {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
}

export default async function BodyWeightPage() {
    const data = await getBodyWeights();

    const weekMap = new Map<string, Map<number, BodyWeight>>();
    for (const entry of data) {
        const day = entry.date.substring(0, 2);
        const month = entry.date.substring(3, 5);
        const year = entry.date.substring(6, 10);

        const d = new Date(Number(year), Number(month) - 1, Number(day));
        const week = getISOWeekKey(d);
        const dayIdx = getDayIndex(d);

        if (!weekMap.has(week)) weekMap.set(week, new Map());
        weekMap.get(week)!.set(dayIdx, entry);
    }

    const weeks = Array.from(weekMap.entries())
        .map(([week]) => week)
        .sort();

    const weekAverages = weeks.map((week) => {
        const entries = Array.from(weekMap.get(week)!.values());
        if (entries.length === 0) return null;
        return entries.reduce((sum, e) => sum + e.weight, 0) / entries.length;
    });

    const weekDiffs = weekAverages.map((avg, index) => {
        if (
            index === 0 ||
            avg === null ||
            weekAverages[index - 1] === null
        ) {
            return null;
        }

        const diff = avg - weekAverages[index - 1]!;
        return (Math.round(diff * 100) / 100).toFixed(2);
    });

    // grid-template-columns: label kolom + 1 kolom per week
    const gridCols = `80px repeat(${weeks.length}, 1fr)`;

    return (
        <div className="mx-auto max-w-md space-y-6 p-4">
            <div className="bg-neutral-900 block max-w-sm p-6 border border-default rounded-xl shadow-xs">

                <div className="flex items-center gap-3 tracking-tight text-heading leading-8">
                    <h1 className="text-xl font-semibold">List of all bodyweights</h1>

                    <Link
                        href="/bodyweight/new"
                        className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-2xl font-bold bg-green-600 hover:bg-green-700">
                        +
                    </Link>
                </div>

                <table className="w-full text-sm text-left border-separate border-spacing-0">
                    <thead>
                    <tr>
                        <th scope="col"
                            className="px-6 py-3 font-medium text-xs uppercase tracking-wide text-neutral-500">Date
                        </th>
                        <th scope="col"
                            className="px-6 py-3 font-medium text-xs uppercase tracking-wide text-neutral-500">Device
                        </th>
                        <th scope="col"
                            className="px-6 py-3 font-medium text-xs uppercase tracking-wide text-neutral-500 text-right">Weight
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {data.map((bodyweight, b) => (
                        <tr key={b}>
                            <td className="border-t border-neutral-800 px-6 py-2.5 text-neutral-200 whitespace-nowrap">
                                {bodyweight.date}
                            </td>
                            <td className="border-t border-neutral-800 px-6 py-2.5 text-neutral-200">
                                ...
                            </td>
                            <td className="border-t border-neutral-800 px-6 py-2.5 text-neutral-200 text-right whitespace-nowrap">
                                {bodyweight.weight} kg
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div
                className="bg-neutral-900 block max-w-sm p-6 border border-default rounded-xl shadow-xs overflow-scroll">
                <div className="rounded-lg p-2">
                    <div className="grid gap-y-1" style={{gridTemplateColumns: gridCols}}>
                        <div/>
                        {weeks.map((week) => (
                            <div key={week} className="p-2 text-center font-mono text-sm text-neutral-500 font-bold">
                                {week}
                            </div>
                        ))}

                        {DAYS.map((label, dayIdx) => (
                            <div key={label} className="contents">
                                <div
                                    className="flex items-center p-2 font-mono text-sm uppercase text-neutral-500 font-bold">
                                    {label}
                                </div>
                                {weeks.map((week) => {
                                    const entry = weekMap.get(week)?.get(dayIdx);
                                    return entry ? (
                                        <WeightCell key={week} entry={entry}/>
                                    ) : (
                                        <div key={week} className="flex items-center justify-center p-2">
                                            <span className="font-mono text-sm text-gray-400">...</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        <div
                            className="flex items-center border-t-4 border-neutral-800 p-2 font-mono text-sm text-neutral-500 font-bold">AVG
                        </div>
                        {weekAverages.map((avg, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-center border-t-4 border-neutral-800 p-2 font-mono text-sm text-neutral-500 font-bold">
                                {avg !== null ? avg.toFixed(2) : "..."}
                            </div>
                        ))}

                        <div className="flex items-center p-2 font-mono text-sm text-neutral-500 font-bold">
                            DIFF
                        </div>
                        {weekDiffs.map((diff, i) => (
                            <div
                                key={weeks[i]}
                                className="flex items-center justify-center p-2 font-mono text-sm text-neutral-500 font-bold">
                                {diff === null
                                    ? ""
                                    : Number(diff) > 0
                                        ? `+${diff}`
                                        : diff}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}