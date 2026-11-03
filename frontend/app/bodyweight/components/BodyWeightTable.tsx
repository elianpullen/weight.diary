"use client";

import {useState} from "react";
import {BodyWeight} from "@/models/bodyWeight";
import {getISOWeekKey} from "@/app/bodyweight/utils/dateUtils";

const PAGE_SIZE = 10;

export default function BodyWeightTable({data}: {
    data: BodyWeight[];
}) {
    const [currentPage, setCurrentPage] = useState(1);

    const bodyweights = data.map(item => ({
        ...item,
        date: new Date(item.date)
    }));

    const totalPages = Math.ceil(data.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedData = bodyweights.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );
    
    return (
        <div>
            <table className="w-full text-sm text-left border-separate border-spacing-0">
                <thead>
                <tr>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wide text-neutral-500">
                        Date
                    </th>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wide text-neutral-500">
                        Week
                    </th>
                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wide text-neutral-500 text-right">
                        Weight
                    </th>
                </tr>
                </thead>

                <tbody>
                {paginatedData.map((bodyweight) => (
                    <tr key={bodyweight.id}>
                        <td className="border-t border-neutral-800 px-6 py-2.5 text-neutral-200 whitespace-nowrap">
                            {bodyweight.date.toLocaleDateString("nl-NL")}
                        </td>
                        <td className="border-t border-neutral-800 px-6 py-2.5 text-neutral-200 whitespace-nowrap">
                            {getISOWeekKey(bodyweight.date)}
                        </td>
                        <td className="border-t border-neutral-800 px-6 py-2.5 text-neutral-200 text-right whitespace-nowrap">
                            {bodyweight.weight} kg
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-neutral-500">
                    Showing {data.length === 0 ? 0 : startIndex + 1}-
                    {Math.min(startIndex + PAGE_SIZE, data.length)} of {data.length}
                </span>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm rounded-lg bg-neutral-800 text-neutral-200 disabled:opacity-30">
                        Previous
                    </button>

                    <span className="text-sm text-neutral-400">
                        {currentPage} / {totalPages || 1}
                    </span>

                    <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1.5 text-sm rounded-lg bg-neutral-800 text-neutral-200 disabled:opacity-30">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}