import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AppCard from "./AppCard.tsx";

describe("AppCard", () => {
    it("links to the app in a new tab", () => {
        render(<AppCard title="Jellyfin" url="https://jellyfin.example" />);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "https://jellyfin.example");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("shows the description, or a default one", () => {
        const { rerender } = render(<AppCard title="Jellyfin" url="#" description="Films" />);
        expect(screen.getByText("Films")).toBeInTheDocument();

        rerender(<AppCard title="Jellyfin" url="#" />);
        expect(screen.getByText("Aucune description")).toBeInTheDocument();
    });

    it("shows the icon when there is one, the first letter otherwise", () => {
        const { container, rerender } = render(<AppCard title="Jellyfin" url="#" iconUrl="/media/j.png" />);
        expect(container.querySelector("img")).toHaveAttribute("src", "/media/j.png");

        rerender(<AppCard title="Jellyfin" url="#" />);
        expect(container.querySelector("img")).toBeNull();
        expect(screen.getByText("J")).toBeInTheDocument();
    });
});
