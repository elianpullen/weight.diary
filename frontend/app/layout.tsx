import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Script from "next/script";
import React from "react";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Weight Diary",
    description: "Created by Elian Pullen",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col p-6">
        <Navbar/>
        {children}
        </body>
        <Script src={"https://cdn.jsdelivr.net/npm/flowbite@4.0.1/dist/flowbite.min.js"}></Script>
        </html>
    );
}