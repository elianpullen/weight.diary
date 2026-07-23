import {DayPicker} from "react-day-picker";
import React, {useState} from "react";

type DayPickerFormProps = {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
};

export default function DateSelector({date, setDate}: DayPickerFormProps) {
    const today = new Date();
    const [month, setMonth] = useState(today);

    return (
        <div>
            <DayPicker
                month={month}
                onMonthChange={setMonth}
                showWeekNumber
                animate
                mode="single"
                selected={date}
                onSelect={setDate}
                timeZone="Europe/Amsterdam"
            />

            <button type="button" onClick={() => setMonth(today)}>
                Go to Today
            </button>

            <p className="mt-2 text-sm text-gray-500">
                {date
                    ? `Selected: ${date.toLocaleDateString()}`
                    : "Choose a date."}
            </p>
        </div>
    )
}