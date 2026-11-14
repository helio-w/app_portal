import { api } from "./client.ts";
import { useQuery } from "@tanstack/react-query";

// Mirrors apps.serializers.ApplicationSerializer
export type Application = {
    id: number;
    title: string;
    url: string;
    icon: string | null;
    description: string;
    date_added: string;
    date_updated: string;
};

export const useApplications = () =>
    useQuery({
        queryKey: ["applications"],
        queryFn: () => api<Application[]>("/applications/"),
    });
