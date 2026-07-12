"use client";

import React, {useEffect, useState} from "react";
import {DayPicker} from "react-day-picker";
import "react-day-picker/style.css";

import {getBodyWeight, updateBodyWeight} from "@/lib/api/bodyWeight";

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

        if (!date) return;

        const {id} = await params;

        await updateBodyWeight(Number(id), {
            date: date.toISOString().split("T")[0],
            weight: Number(bodyweight),
        });

        alert("Bodyweight updated!");
    }

    if (loading) return <p>Loading ...</p>;

    return (
        <form
            onSubmit={handleSubmit}
            className="flex max-w-sm flex-col gap-6">
            <DayPicker
                mode="single"
                selected={date}
                onSelect={setDate}
                timeZone={"Europe/Amsterdam"}
            />

            <input
                type="number"
                step="0.1"
                value={bodyweight}
                onChange={(e) => setBodyweight(e.target.value)}
                className="rounded border px-3 py-2"/>

            <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white">
                Save
            </button>
        </form>
    );
}