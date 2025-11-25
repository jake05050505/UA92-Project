"use client"

import { usePathname } from 'next/navigation';
import Link from "next/link";

export default function Nav() {
    const pathname = usePathname()

    return (
        <nav>
            <Link href="/" style={pathname === "/" ? { color: "var(--muted)"} : undefined}>
                Home
            </Link>
            <Link href="/about" style={pathname === "/about" ? { color: "var(--muted)"} : undefined}>
                About
            </Link>
            <a target="_blank" href="https://github.com/jake05050505/UA92-Project">
                Github Repository
            </a>
        </nav>
    );
}