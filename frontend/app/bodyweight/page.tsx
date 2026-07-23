import {getBodyWeights} from "@/lib/api/bodyWeight";
import Link from "next/link";
import WeightCell, {type BodyWeight} from "./components/WeightCell";

const DAYS = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

function getISOWeek(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getDayIndex(date: Date): number {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
}

export default async function BodyWeightPage() {
    const raw: BodyWeight[] = await getBodyWeights();
    const data = raw.filter((entry) => !isNaN(new Date(entry.date).getTime()));

    const sorted = [...data].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const latest = sorted[0];

    const weekMap = new Map<number, Map<number, BodyWeight>>();
    for (const entry of data) {
        const d = new Date(entry.date);
        const week = getISOWeek(d);
        const dayIdx = getDayIndex(d);
        if (!weekMap.has(week)) weekMap.set(week, new Map());
        weekMap.get(week)!.set(dayIdx, entry);
    }

    const weeks = Array.from(weekMap.keys()).sort((a, b) => a - b).slice(-2);

    const weekAverages = weeks.map((week) => {
        const entries = Array.from(weekMap.get(week)!.values());
        if (entries.length === 0) return null;
        const avg = entries.reduce((sum, e) => sum + e.weight, 0) / entries.length;
        return Math.round(avg * 10) / 10;
    });

    const diff =
        weekAverages.length === 2 && weekAverages[0] !== null && weekAverages[1] !== null
            ? Math.round((weekAverages[1]! - weekAverages[0]!) * 10) / 10
            : null;

    // grid-template-columns: label kolom + 1 kolom per week
    const gridCols = `80px repeat(${weeks.length}, 1fr)`;

    return (
        <div className="mx-auto max-w-md space-y-6 p-4">
            <h1 className="text-xl font-bold">Bodyweights in KG</h1>

            <div className="flex items-start gap-4">
                {latest ? (
                    <div
                        className="flex-1 space-y-2 rounded-lg border border-gray-300 p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-fuchsia-400 hover:shadow-md">
                        <div className="text-lg font-bold">{latest.weight} kg</div>
                        <div className="text-sm text-gray-500">
                            {new Date(latest.date).toLocaleDateString("nl-NL")}
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Link
                                href={`/bodyweight/${latest.id}/edit`}
                                className="rounded-sm bg-gray-300 px-2 py-1 text-xs font-bold text-gray-800 hover:bg-gray-400"
                            >
                                EDIT
                            </Link>
                            <Link
                                href={`/bodyweight/${latest.id}/delete`}
                                className="rounded-sm bg-gray-300 px-2 py-1 text-xs font-bold text-gray-800 hover:bg-gray-400"
                            >
                                DELETE
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-400">
                        Nog geen metingen
                    </div>
                )}

                <Link
                    href="/bodyweight/new"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-2xl font-bold"
                >
                    +
                </Link>
            </div>

            {/* Grid i.p.v. table, zodat popups niet door volgende rijen verborgen worden */}
            <div className="rounded-lg border border-gray-300 p-2">
                <div className="grid gap-y-1" style={{gridTemplateColumns: gridCols}}>
                    {/* Header */}
                    <div/>
                    {weeks.map((week) => (
                        <div key={week} className="p-2 text-center font-mono text-sm font-bold">
                            {week}
                        </div>
                    ))}

                    {/* Dag-rijen */}
                    {DAYS.map((label, dayIdx) => (
                        <div key={label} className="contents">
                            <div className="flex items-center p-2 font-mono text-sm font-bold">
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

                    {/* AVG-rij */}
                    <div className="flex items-center border-t-2 border-gray-300 p-2 font-mono text-sm font-bold">
                        AVG
                    </div>
                    {weekAverages.map((avg, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-center border-t-2 border-gray-300 p-2 font-mono text-sm font-bold"
                        >
                            {avg ?? "..."}
                        </div>
                    ))}

                    {/* DIFF-rij */}
                    <div className="flex items-center p-2 font-mono text-sm font-bold">DIFF</div>
                    {weeks.map((week, i) => (
                        <div key={week} className="flex items-center justify-center p-2 font-mono text-sm font-bold">
                            {i === weeks.length - 1
                                ? diff === null
                                    ? "..."
                                    : diff > 0
                                        ? `+${diff}`
                                        : diff
                                : ""}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}