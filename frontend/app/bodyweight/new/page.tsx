"use client";

import React, {useState} from "react";
import "react-day-picker/style.css";
import {createBodyWeight} from "@/lib/api/bodyWeight";
import DateSelector from "@/app/bodyweight/components/DateSelector";

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
            date: date.toISOString().split("T")[0], // year-month-day
            weight: Number(bodyweight),
        });
    }

    return (
        <div className="mx-auto max-w-md space-y-6 p-4">

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 max-w-sm">

                <DateSelector date={date} setDate={setDate}/>

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
        </div>
    );
}