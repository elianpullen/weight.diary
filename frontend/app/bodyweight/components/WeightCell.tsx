"use client";

import {useState} from "react";
import Link from "next/link";
import {BodyWeight} from "@/models/bodyWeight";

export default function WeightCell({entry}: { entry: BodyWeight }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative flex items-center justify-center p-2">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="cursor-pointer rounded-md bg-fuchsia-500 px-3 py-2 font-mono text-sm text-white transition-colors hover:bg-fuchsia-600"
            >
                {entry.weight}
            </button>

            {open && (
                <>
                    {/* Onzichtbare backdrop: klik ernaast sluit de popup */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />

                    {/* Popup card */}
                    <div
                        className="absolute left-1/2 top-full z-50 mt-2 w-40 -translate-x-1/2 space-y-2 rounded-lg border border-gray-300 bg-white p-3 text-left shadow-lg">
                        <div className="text-base font-bold text-gray-900">
                            {entry.weight} kg
                        </div>
                        <div className="text-xs text-gray-500">
                            {new Date(entry.date).toLocaleDateString("nl-NL")}
                        </div>
                        <div className="flex gap-2 pt-1">
                            <Link
                                href={`/bodyweight/${entry.id}/edit`}
                                className="rounded-sm bg-gray-300 px-2 py-1 text-[10px] font-bold text-gray-800 hover:bg-gray-400"
                            >
                                EDIT
                            </Link>
                            <Link
                                href={`/bodyweight/${entry.id}/delete`}
                                className="rounded-sm bg-gray-300 px-2 py-1 text-[10px] font-bold text-gray-800 hover:bg-gray-400"
                            >
                                DELETE
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}