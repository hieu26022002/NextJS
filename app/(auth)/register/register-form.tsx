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
import { RegisterBody, RegisterBodyType } from "@/schemaValidations/auth.schema"
import envConfig from "@/lib/config"
import { useEffect } from "react"

// Service helpers (tách nhưng vẫn trong cùng file)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ApiResult = { status: number; payload: any }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function registerExternal(values: RegisterBodyType): Promise<ApiResult> {
    const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    })

    const payload = await res.json()
    const data = { status: res.status, payload }

    if (!res.ok) throw data
    return data
}

const RegisterForm = () => {
    useEffect(() => {
        console.log(envConfig.NEXT_PUBLIC_API_ENDPOINT)
    }, [])

    const form = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: RegisterBodyType) {
        try {
            const result = await registerExternal(values)
            console.log(result)
            // xử lý tiếp theo khi đăng ký thành công (redirect / hiển thị thông báo ...)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errors = error.payload?.errors as { field: string; message: string }[] | undefined
            const status = error.status as number | undefined
            if (status === 422 && errors) {
                errors.forEach((err) => {
                    form.setError(err.field as "email" | "name" | "password" | "confirmPassword", {
                        type: "server",
                        message: err.message,
                    })
                })
            } else {
                // log hoặc hiển thị lỗi khác
                console.error(error)
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 max-w-[600px] flex-shrink-0 w-full" noValidate>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên</FormLabel>
                            <FormControl>
                                <Input placeholder="..." {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

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

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input placeholder="..." type="password" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="!mt-8 w-full">Đăng ký</Button>
            </form>
        </Form>
    )
}

export default RegisterForm