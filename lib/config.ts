import z from "zod";

const NEXT_PUBLIC_API_ENDPOINT="http://localhost:8082";

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string().url()
});

function sanitizeEndpoint(endpoint: string | undefined) {
    const fallback = endpoint && endpoint.trim().length > 0 ? endpoint : NEXT_PUBLIC_API_ENDPOINT;

    try {
        const url = new URL(
            fallback.startsWith("http://") || fallback.startsWith("https://")
                ? fallback
                : `http://${fallback}`
        );

        // Local dev servers normally do not have valid SSL certificates
        if (url.hostname === "localhost" && url.protocol === "https:") {
            url.protocol = "http:";
        }

        return url.origin;
    } catch (error) {
        console.error("Không thể phân tích URL cấu hình:", error);
        return NEXT_PUBLIC_API_ENDPOINT;
    }
}

const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: sanitizeEndpoint(process.env.NEXT_PUBLIC_API_ENDPOINT)
});

if (!configProject.success) {
    console.error(configProject.error);
    throw new Error("Các giá trị cấu hình không hợp lệ");
}

const envConfig = configProject.data;
export default envConfig;