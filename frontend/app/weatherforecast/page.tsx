import { getWeatherForecast } from "@/lib/api/weatherForecast";

export default async function WeatherForecastPage() {
    const data = await getWeatherForecast();

    return (
        <main>
            <h1>Weather Forecasts Overview</h1>
            <ul>
                {data.map((item, i) => (
                    <li key={i}>
                        {item.date} — {item.temperatureC}°C — {item.summary}
                    </li>
                ))}
            </ul>
        </main>
    );
}