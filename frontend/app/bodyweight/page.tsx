import {getBodyWeights} from "@/lib/api/bodyWeight";

export default async function BodyWeightPage() {
    const data = await getBodyWeights();

    return (
        <div
            className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default">
            <table className="w-full text-sm text-left rtl:text-right text-body">
                <thead className="bg-neutral-secondary-soft border-b border-default">
                <tr>
                    <th scope="col" className="px-6 py-3 font-medium">ID</th>
                    <th scope="col" className="px-6 py-3 font-medium">Weight</th>
                    <th scope="col" className="px-6 py-3 font-medium">Date</th>
                    <th scope="col" className="px-6 py-3 font-medium">Action</th>
                </tr>
                </thead>
                <tbody>
                {data.map((bodyweight, b) => (
                    <tr key={b}
                        className="odd:bg-neutral-primary even:bg-neutral-secondary-soft border-b border-default">
                        <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                            {bodyweight.id}
                        </th>
                        <td className="px-6 py-4">{bodyweight.weight}</td>
                        <td className="px-6 py-4">{bodyweight.date}</td>
                        <td className="px-6 py-4"><a href="#"
                                                     className="font-medium text-fg-brand hover:underline">Edit</a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}