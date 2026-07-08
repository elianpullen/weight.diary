"use client";

import React, {useState} from "react";
import {DayPicker} from "react-day-picker";
import "react-day-picker/style.css";
import {createBodyWeight} from "@/lib/api/bodyWeight";

export default function MyDatePicker() {
    const [date, setDate] = useState<Date>();
    const [bodyweight, setBodyweight] = useState("");

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!date) {
            alert("Select a date.");
            return;
        }

        await createBodyWeight({
            date: date.toISOString().split("T")[0], // 2026-07-08
            weight: Number(bodyweight),
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 max-w-sm">
            <div>
                <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                />

                <p className="mt-2 text-sm text-gray-500">
                    {date
                        ? `Selected: ${date.toLocaleDateString()}`
                        : "Choose a date."}
                </p>
            </div>

            <div>
                <label
                    htmlFor="bodyweight"
                    className="block mb-2 font-medium">
                    Bodyweight (kg)
                </label>

                <input
                    id="bodyweight"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="500"
                    value={bodyweight}
                    onChange={(e) => setBodyweight(e.target.value)}
                    placeholder="88.8"
                    className="w-full rounded border px-3 py-2"
                    required
                />
            </div>

            <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Create
            </button>
        </form>
    );
}