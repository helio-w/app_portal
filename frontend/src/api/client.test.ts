import { describe, expect, it, vi } from "vitest";
import { api, ApiError } from "./client.ts";

function stubFetch(status = 200, body: unknown = {}) {
    const fetchMock = vi.fn(
        async () => new Response(status === 204 ? null : JSON.stringify(body), { status }),
    );
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
}

function sentHeaders(fetchMock: ReturnType<typeof stubFetch>) {
    const init = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    return init[1].headers as Record<string, string>;
}

describe("api", () => {
    it("prefixes the path with /api and returns the JSON body", async () => {
        const fetchMock = stubFetch(200, [{ id: 1 }]);
        await expect(api("/applications/")).resolves.toEqual([{ id: 1 }]);
        expect(fetchMock.mock.calls[0]).toContain("/api/applications/");
    });

    it("sends neither Content-Type nor CSRF token on a GET", async () => {
        document.cookie = "csrftoken=abc";
        const fetchMock = stubFetch();
        await api("/applications/");
        expect(sentHeaders(fetchMock)).toEqual({});
    });

    it("sends the CSRF token and JSON body on a POST", async () => {
        document.cookie = "csrftoken=abc";
        const fetchMock = stubFetch(201);
        await api("/applications/", { method: "POST", body: { title: "A" } });
        expect(sentHeaders(fetchMock)).toEqual({
            "Content-Type": "application/json",
            "X-CSRFToken": "abc",
        });
    });

    it("returns null on 204", async () => {
        stubFetch(204);
        await expect(api("/applications/1/", { method: "DELETE" })).resolves.toBeNull();
    });

    it("throws an ApiError carrying the status", async () => {
        stubFetch(403);
        const request = api("/applications/", { method: "POST", body: {} });
        await expect(request).rejects.toBeInstanceOf(ApiError);
        await expect(request).rejects.toHaveProperty("status", 403);
    });
});
