import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { vi } from "vitest";

// A fresh client per test, without retries, so errors show up immediately.
export function renderWithQueryClient(ui: ReactElement) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

// Replaces fetch with a stub answering each API path with the given JSON body.
export function mockApi(routes: Record<string, unknown>, status = 200) {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
        const path = String(input).replace(/^\/api/, "");
        if (!(path in routes)) return new Response(null, { status: 404 });
        return new Response(JSON.stringify(routes[path]), { status });
    });
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
}
