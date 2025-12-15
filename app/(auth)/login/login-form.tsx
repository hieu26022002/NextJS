"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema"
import envConfig from "@/lib/config"

// Service helpers (tách nhưng vẫn trong cùng file)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function login(values: LoginBodyType): Promise<{ status: number; payload: any }> {
    const url = `http://localhost:8082/api/auth/login`
    console.log("Đang gọi API:", url)


    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        })

        let payload
        const contentType = res.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
            try {
                payload = await res.json()
            } catch (jsonError) {
                payload = { message: "Lỗi khi parse JSON response" }
            }
        } else {
            const text = await res.text()
            payload = { message: text || "Lỗi không xác định" }
        }

        const data = { status: res.status, payload }

        if (!res.ok) {
            console.error("API Error:", res.status, payload)
            throw data
        }
        return data
    } catch (error: any) {
        // Xử lý lỗi network hoặc lỗi khác
        if (error.status) {
            // Đã được xử lý ở trên
            throw error
        }
        console.error("Network Error:", error)
        throw {
            status: 0,
            payload: {
                message: error.message || "Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.",
                errors: []
            }
        }
    }
}


const LoginForm = () => {

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: LoginBodyType) {

        try {
            const result = await login(values)

            console.log("Login successful:", result)
        } catch (error: any) {
            const errors = error.payload?.errors as {
                field: string,
                message: string
            }[] | undefined
            const status = error.status as number | undefined

            // Xử lý lỗi 404 hoặc network error
            if (status === 404 || status === 0) {
                form.setError("root", {
                    type: "server",
                    message: error.payload?.message || "Không tìm thấy API endpoint. Vui lòng kiểm tra backend có đang chạy tại " + envConfig.NEXT_PUBLIC_API_ENDPOINT
                })
                return
            }

            if (status === 422 && errors) {
                errors.forEach((err) => {
                    form.setError(err.field as 'email' | 'password', {
                        type: "server",
                        message: err.message
                    })
                })
            } else {
                // Hiển thị lỗi chung cho các lỗi khác
                form.setError("root", {
                    type: "server",
                    message: error.payload?.message || `Lỗi ${status || "không xác định"}`
                })
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 max-w-[600px] flex-shrink-0 w-full" noValidate>

                {form.formState.errors.root && (
                    <div className="text-destructive text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="..." type="email" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="..." type="password" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="!mt-8 w-full">Đăng nhập</Button>
            </form>
        </Form>
    )
}

export default LoginForm