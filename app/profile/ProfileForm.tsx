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
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
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
                setAvatarPreview(resData.data?.avatar || null)
    
            } catch (err) {
                setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
            } finally {
                setLoading(false)
            }
        }
    
        fetchUserData()
    }, [router])
    
     const handleAvatarChange = (file: File | null) => {
        setAvatarFile(file)
        setAvatarPreview(file ? URL.createObjectURL(file) : user?.avatar || null)
    }

    const uploadAvatar = async (token: string) => {
        if (!avatarFile) return

        const formData = new FormData()
        formData.append("avatar", avatarFile)

        const res = await fetch("http://localhost:8082/api/auth/information/avatar", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        if (res.status === 401) {
            throw new Error("401")
        }

        if (!res.ok) {
            const resText = await res.text()
            throw new Error(`Lỗi: ${res.status} - ${resText || "Không rõ nguyên nhân"}`)
        }

        const resData = await res.json().catch(() => null)
        if (resData?.data) {
            setUser(resData.data)
            setAvatarPreview(resData.data.avatar || null)
            setAvatarFile(null)
        }
    }


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
                            // Upload avatar nếu có
                            await uploadAvatar(token)

                            // Cập nhật thông tin
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
                                setAvatarPreview(resData.data.avatar || avatarPreview)
                            }
                            alert("Cập nhật thành công")
                        } catch (err) {
                            if (err instanceof Error && err.message === "401") {
                                alert("Vui lòng đăng nhập lại")
                                localStorage.removeItem("access_token")
                                router.push("/login")
                                return
                            }
                            alert(err instanceof Error ? err.message : "Có lỗi xảy ra")
                        }
                    }}
                    className="space-y-4"
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="h-28 w-28 rounded-full bg-gray-200 overflow-hidden">
                            {avatarPreview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={avatarPreview}
                                    alt="avatar"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">
                                    No avatar
                                </div>
                            )}
                        </div>
                        <input
                            id="avatar-input"
                            type="file"
                            accept="image/*"
                            onChange={e => handleAvatarChange(e.target.files?.[0] || null)}
                            className="hidden"
                        />
                        <div className="flex gap-2 w-full items-center">
                            <label
                                htmlFor="avatar-input"
                                className="cursor-pointer flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-center text-sm font-medium transition"
                            >
                                Chọn ảnh
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email:</label>
                        <input
                            value={user.email}
                            disabled
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
