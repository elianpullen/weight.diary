import {getBodyWeights} from "@/lib/api/bodyWeight";
import Link from "next/link";
import {BodyWeight} from "@/models/bodyWeight";
import WeightCell from "./components/WeightCell";
import BodyWeightTable from "@/app/bodyweight/components/BodyWeightTable";
import {getDayIndex, getISOWeekKey} from "@/app/bodyweight/utils/dateUtils";

const DAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

export default async function BodyWeightPage() {
    const data = await getBodyWeights();

    const weekMap = new Map<string, Map<number, BodyWeight>>();
    for (const entry of data) {
        const date = entry.date;
        const week = getISOWeekKey(date);
        const dayIdx = getDayIndex(date);

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

                <BodyWeightTable data={data}/>
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