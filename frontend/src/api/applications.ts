import { api } from "./client.ts";
import {useQuery} from "@tanstack/react-query";

export type Applications = {
    id: number,
    title: string,
    
}

export const useApplications = () =>
    useQuery({queryKey: ["applications"], queryFn: () => api("/applications/")});