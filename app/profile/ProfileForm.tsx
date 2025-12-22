"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
    id: number
    email: string
    name: string
    avatar?: string
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("access_token")
    
            if (!token) {
                alert("Vui lòng đăng nhập lại")
                setLoading(false)
                router.push("/login")
                return
            }
    
            try {
                const res = await fetch("http://localhost:8082/api/auth/information", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
    
                if (res.status === 401) {
                    alert("Vui lòng đăng nhập lại")
                    localStorage.removeItem("access_token")
                    router.push("/login")
                    return
                }
    
                if (!res.ok) {
                    throw new Error(`Lỗi: ${res.status}`)
                }
    
                const resData = await res.json()
                console.log("User data:", resData)
                setUser(resData.data)
    
            } catch (err) {
                setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
            } finally {
                setLoading(false)
            }
        }
    
        fetchUserData()
    }, [router])
    

    const handleLogout = () => {
        localStorage.removeItem("access_token")
        document.cookie = "access_token=; path=/; max-age=0"
        router.push("/login")
    }

    if (loading) return <p className="text-center mt-10">Đang tải...</p>
    if (error) return <p className="text-center mt-10 text-red-600">{error}</p>
    if (!user) return <p className="text-center mt-10">Không có dữ liệu</p>

    return (
        <div>
            <button
                type="button"
                onClick={handleLogout}
                className="fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-lg transition"
            >
                Đăng xuất
            </button>

            <div className="max-w-xl mx-auto mt-10 p-6 rounded shadow border">
                <h1 className="text-2xl text-center font-semibold mb-6">
                    Thông tin cá nhân
                </h1>

                <form
                    onSubmit={async e => {
                        e.preventDefault()
                        if (!user) {
                            alert("Không tìm thấy thông tin người dùng")
                            return
                        }
                        const token = localStorage.getItem("access_token")
                        if (!token) {
                            alert("Token không tồn tại. Vui lòng đăng nhập lại")
                            return
                        }

                        try {
                            const res = await fetch("http://localhost:8082/api/auth/information", {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ name: user.name, email: user.email }),
                            })

                            if (res.status === 401) {
                                alert("Vui lòng đăng nhập lại")
                                localStorage.removeItem("access_token")
                                router.push("/login")
                                return
                            }

                            if (!res.ok) {
                                const resText = await res.text()
                                throw new Error(`Lỗi: ${res.status} - ${resText || "Không rõ nguyên nhân"}`)
                            }

                            const resData = await res.json().catch(() => null)
                            if (resData?.data) {
                                setUser(resData.data)
                            }
                            alert("Cập nhật thành công")
                        } catch (err) {
                            alert(err instanceof Error ? err.message : "Có lỗi xảy ra")
                        }
                    }}
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium mb-1">Email:</label>
                        <input
                            value={user.email}
                            onChange={e =>
                                setUser({ ...user, email: e.target.value })
                            }
                            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Tên người dùng:</label>
                        <input
                            value={user.name}
                            onChange={e =>
                                setUser({ ...user, name: e.target.value })
                            }
                            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full font-medium transition"
                    >
                        Lưu
                    </button>
                </form>
            </div>
        </div>
    )
}
