import {API_BASE_URL} from "./config";
import {redirect} from "next/navigation";

export type BodyWeight = {
    id: number;
    date: string;
    weight: string;
};

async function handleApiError(res: Response) {
    const error = await res.json().catch(() => null);

    if (error?.error) {
        throw new Error(error.error);
    }

    throw new Error(`API error: ${res.status}`);
}

export async function getBodyWeights(): Promise<BodyWeight[]> {
    const res = await fetch(`${API_BASE_URL}/api/bodyweights`, {
        cache: "no-store",
    });

    if (!res.ok) {
        await handleApiError(res);
    }

    const data = await res.json();

    return data.map((item: BodyWeight) => ({
        id: item.id,
        weight: item.weight,
        date: new Date(item.date).toLocaleDateString("nl-NL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
    }));
}

export async function createBodyWeight(bodyWeight: { date: string; weight: number }): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/bodyweights`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyWeight),
    });

    if (!res.ok) {
        await handleApiError(res);
    }

    return redirect('/bodyweight');
}

export async function getBodyWeight(id: number) {
    const res = await fetch(`${API_BASE_URL}/api/bodyweights/${id}`);
    return res.json();
}

export async function updateBodyWeight(
    id: number,
    bodyWeight: { date: string; weight: number }
) {
    const res = await fetch(`${API_BASE_URL}/api/bodyweights/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyWeight),
    });

    if (!res.ok) {
        await handleApiError(res);
    }

    return redirect('/bodyweight');
}

export async function deleteBodyWeight(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/bodyweights/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        await handleApiError(res);
    }

    return redirect('/bodyweight');
}