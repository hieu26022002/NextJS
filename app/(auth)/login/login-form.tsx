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
import { LoginBody, LoginBodyType, RegisterBody, RegisterBodyType } from "@/schemaValidations/auth.schema"
import evnConfig from "@/lib/config"
import { effect } from "zod/v3"
import { use, useEffect } from "react"


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
            const result = await fetch(
                `${evnConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            }).then(async (res) => {
                const payload = await res.json()
                const data = {
                    status: res.status,
                    payload
                }
                if (!res.ok) {
                    throw data
                }
                return data
            })
            const resultFormNextServer = await fetch('/api/auth', {
                method: 'POST',
                body: JSON.stringify(result.payload),
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            console.log(resultFormNextServer)
        } catch (error: any) {
            const errors = error.payload.errors as {
                field: string,
                message: string
            }[]
            const status = error.status as number
            if (status === 422) {
                errors.forEach((error) => {
                    form.setError(error.field as 'email' | 'password', {
                        type: "server",
                        message: error.message
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
                                <Input placeholder="..." type="email "{...field} />
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