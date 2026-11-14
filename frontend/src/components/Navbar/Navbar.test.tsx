import { act, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockApi, renderWithQueryClient } from "../../test/utils.tsx";
import Navbar from "./Navbar.tsx";

const ADMIN = "Panneau d'administration";
const LOGIN = "Se connecter";

describe("Navbar", () => {
    it("shows the login link to anonymous users", async () => {
        mockApi({ "/me/": { is_authenticated: false, is_staff: false, username: null } });
        renderWithQueryClient(<Navbar />);

        expect(await screen.findByText(LOGIN)).toHaveAttribute("href", "/admin/login/?next=/");
        expect(screen.queryByText(ADMIN)).not.toBeInTheDocument();
    });

    it("shows the admin link to staff users", async () => {
        mockApi({ "/me/": { is_authenticated: true, is_staff: true, username: "admin" } });
        renderWithQueryClient(<Navbar />);

        expect(await screen.findByText(ADMIN)).toHaveAttribute("href", "/admin/");
        expect(screen.queryByText(LOGIN)).not.toBeInTheDocument();
    });

    it("shows neither link to logged-in non-staff users", async () => {
        const fetchMock = mockApi({ "/me/": { is_authenticated: true, is_staff: false, username: "bob" } });
        renderWithQueryClient(<Navbar />);

        // Nothing visible changes for this user, so wait for the response to be processed.
        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        await act(() => fetchMock.mock.results[0].value);
        expect(screen.queryByText(ADMIN)).not.toBeInTheDocument();
        expect(screen.queryByText(LOGIN)).not.toBeInTheDocument();
    });
});
