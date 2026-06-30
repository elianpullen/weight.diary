import { API_BASE_URL } from "./config";

export type WeatherForecast = {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string | null;
};

export async function getWeatherForecast(): Promise<WeatherForecast[]> {
    const res = await fetch(`${API_BASE_URL}/weatherforecast`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch weather forecast: ${res.status}`);
    }

    return res.json();
}