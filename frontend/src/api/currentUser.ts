import { api } from "./client.ts";
import { useQuery } from "@tanstack/react-query";

// Mirrors apps.views.current_user
export type CurrentUser = {
    is_authenticated: boolean;
    is_staff: boolean;
    username: string | null;
};

export const useCurrentUser = () =>
    useQuery({
        queryKey: ["currentUser"],
        queryFn: () => api<CurrentUser>("/me/"),
    });
