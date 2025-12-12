"use client"

import RegisterForm from "@/app/(auth)/register/register-form"

const RegisterPage = () => {
    return (
        <div>
            <h1 className="text-xl font-semibold text-center">Đăng Ký</h1><br />
            <div className="flex justify-center">
                <RegisterForm />
            </div>
        </div>
    )
}

export default RegisterPage