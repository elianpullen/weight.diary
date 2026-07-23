"use client";

import React, {useEffect, useState} from "react";
import "react-day-picker/style.css";
import {getBodyWeight, updateBodyWeight} from "@/lib/api/bodyWeight";
import DateSelector from "@/app/bodyweight/components/DateSelector";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default function EditPage({params}: Props) {
    const [date, setDate] = useState<Date>();
    const [bodyweight, setBodyweight] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const {id} = await params;
                const {date, weight} = await getBodyWeight(Number(id));

                setDate(new Date(date));
                setBodyweight(weight.toString());
            } catch (error) {
                console.error(error);
                alert("Failed to load bodyweight.");
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, [params]);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!date) {
            alert("Select a date.");
            return;
        }

        const {id} = await params;

        await updateBodyWeight(Number(id), {
            date: date.toISOString().split("T")[0], // year-month-day
            weight: Number(bodyweight),
        });
    }

    if (loading) return <p>Loading ...</p>;

    return (
        <div className="mx-auto max-w-md space-y-6 p-4">

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 max-w-sm">

                <DateSelector date={date} setDate={setDate}/>

                <input
                    id="bodyweight"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="500"
                    value={bodyweight}
                    onChange={(e) => setBodyweight(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                    required
                />
                
                <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Update
                </button>
            </form>
        </div>
    );
}