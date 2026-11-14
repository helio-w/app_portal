import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockApi, renderWithQueryClient } from "../../test/utils.tsx";
import AppList from "./AppList.tsx";

const app = (id: number, title: string) => ({
    id,
    title,
    url: `https://${title.toLowerCase()}.example`,
    icon: null,
    description: "",
    date_added: "2026-01-01T00:00:00Z",
    date_updated: "2026-01-01T00:00:00Z",
});

describe("AppList", () => {
    it("shows a loading message, then one card per app", async () => {
        mockApi({ "/applications/": [app(1, "Jellyfin"), app(2, "Nextcloud")] });
        renderWithQueryClient(<AppList />);

        expect(screen.getByText("Chargement des applications…")).toBeInTheDocument();
        expect(await screen.findByText("Jellyfin")).toBeInTheDocument();
        expect(screen.getByText("Nextcloud")).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });

    it("shows a message when there are no apps", async () => {
        mockApi({ "/applications/": [] });
        renderWithQueryClient(<AppList />);
        expect(await screen.findByText("Aucune application pour le moment.")).toBeInTheDocument();
    });

    it("shows an error when the API fails", async () => {
        mockApi({ "/applications/": {} }, 500);
        renderWithQueryClient(<AppList />);
        expect(await screen.findByText("Impossible de charger les applications.")).toBeInTheDocument();
    });
});
