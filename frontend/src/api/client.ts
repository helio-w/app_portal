type ApiOptions = {
    method?: string;
    body?: unknown;
};

export class ApiError extends Error {
    readonly status: number;

    constructor(status: number) {
        super(`Request failed : ${status}`);
        this.name = "ApiError";
        this.status = status;
    }
}

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

function getCookie(name: string): string | undefined {
    const cookie = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : undefined;
}

export async function api<T = unknown>(path: string, { method = "GET", body }: ApiOptions = {}): Promise<T> {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";

    // Django rejects unsafe requests from a logged-in session without this header.
    if (!SAFE_METHODS.includes(method.toUpperCase())) {
        const csrfToken = getCookie("csrftoken");
        if (csrfToken) headers["X-CSRFToken"] = csrfToken;
    }

    const res = await fetch(`/api${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new ApiError(res.status);
    return res.status === 204 ? (null as T) : res.json();
}
