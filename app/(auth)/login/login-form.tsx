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
async function loginExternal(values: LoginBodyType): Promise<{ status: number; payload: any }> {
    const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    })

    const payload = await res.json()
    const data = { status: res.status, payload }

    if (!res.ok) throw data
    return data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function postToNextAuth(payload: any) {
    const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    return res
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
            const result = await loginExternal(values)

            const resultFormNextServer = await postToNextAuth(result.payload)
            console.log(resultFormNextServer)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const errors = error.payload?.errors as {
                field: string,
                message: string
            }[] | undefined
            const status = error.status as number | undefined
            if (status === 422 && errors) {
                errors.forEach((err) => {
                    form.setError(err.field as 'email' | 'password', {
                        type: "server",
                        message: err.message
                    })
                })
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 max-w-[600px] flex-shrink-0 w-full" noValidate>


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