import LoginForm from "@/app/(auth)/login/login-form"


const LoginPage = () => {
    return (
        <div>
            <h1 className="text xl font-semibold text-center">Đăng Nhập</h1><br />
            <div className="flex justify-center">
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage