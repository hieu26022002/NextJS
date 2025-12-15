"use client"

import { useState, useRef } from "react"

export default function UserMenu() {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    return (
        <div className="relative" ref={ref}>
            {/* Avatar button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 text-white hover:opacity-80"
            >
                <img
                    src="/avatar.png"
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">hiungc027</span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-[#1f1f1f] shadow-lg z-50">
                    <ul className="py-1 text-sm text-gray-200">
                        <li>
                            <a
                                href="/account"
                                className="block px-4 py-2 hover:bg-gray-700"
                            >
                                Tài khoản của tôi
                            </a>
                        </li>
                        <li>
                            <a
                                href="/orders"
                                className="block px-4 py-2 hover:bg-gray-700"
                            >
                                Đơn mua
                            </a>
                        </li>
                        <li className="border-t border-gray-600">
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-red-600"
                                onClick={() => {
                                    console.log("logout")
                                }}
                            >
                                Đăng xuất
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}
