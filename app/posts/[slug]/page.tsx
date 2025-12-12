"use client"
import React from 'react'

export default async function page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const parmasNew = await params;

    console.log("PARMS+========", parmasNew?.slug);

    const { slug } = await params

    console.log("rouet============", slug);

    return (
        <div>page</div>
    )
}