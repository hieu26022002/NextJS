
export const metadata = {
    title: "Giới thiệu"
}

async function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function About() {
    await wait(2000);
    return <p>Xin chào đến mới page</p>
}