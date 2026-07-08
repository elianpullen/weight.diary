import {deleteBodyWeight} from "@/lib/api/bodyWeight";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function DeletePage({params}: Props) {
    const {id} = await params;

    await deleteBodyWeight(id);

    return;
}