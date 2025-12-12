import Profile from "@/app/component/Profile";
import { User } from "@/app/component/User";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-5 p-5">
      <section className="text-center space-y-3">
        <h1 className="text-2xl font-bold tracking-tight">Chào mừng bạn đến với nước hoa Minh Béo</h1>
        <p className="text-sm text-gray-500">
          Chúng tôi cung cấp các loại nước hoa chính hãng với giá cả hợp lý và dịch vụ khách hàng tuyệt vời.
        </p>

        <div className="flex gap-3 justify-center">
          <Button size="lg">Bắt đầu</Button>
          <Button size="lg">Kết thúc</Button>
          <ModeToggle />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
            <CardDescription>Quản lý người dùng</CardDescription>
          </CardHeader>
          <CardContent>
            <p> Bài viết đơn giản với Next.JS</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <CardDescription>Quản lý sản phẩm</CardDescription>
          </CardHeader>
          <CardContent>
            <p> Bài viết đơn giản với Next.JS</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách đánh giá</CardTitle>
            <CardDescription>Quản lý bài viết</CardDescription>
          </CardHeader>
          <CardContent>
            <p> Bài viết đơn giản với Next.JS</p>
          </CardContent>
        </Card>
      </div>
    </div >
  );
}
