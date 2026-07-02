import { API_BASE_URL } from "./config";

export type BodyWeight = {
    date: string;
    weight: string;
};

export async function getBodyWeights(): Promise<BodyWeight[]> {
    const res = await fetch(`${API_BASE_URL}/api/bodyweights`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch bodyweights: ${res.status}`);
    }

    const data = await res.json();

    return data.map((item: BodyWeight) => ({
        date: new Date(item.date).toLocaleDateString("nl-NL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
        weight: item.weight,
    }));
}