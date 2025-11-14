import z from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string()
})

const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT
})

if (!configProject.success) {
    console.error(configProject.error)
    throw new Error("Các giá trị cấu hình không hợp lệ")
}

const evnConfig = configProject.data
export default evnConfig