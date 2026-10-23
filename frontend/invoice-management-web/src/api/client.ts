const API_URL = import.meta.env.VITE_API_URL;

export type ApiError = {
    status: number;
    message: string;
};

export async function apiRequest<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(
        `${API_URL}${path}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
        }
    );

    if (!response.ok) {
        const data = await response
            .json()
            .catch(() => null);

        const error: ApiError = {
            status: response.status,

            message:
                data?.message ??
                "Ocurrió un error al comunicarse con el servidor.",
        };

        throw error;
    }

    return response.json() as Promise<T>;
}