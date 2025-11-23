import Link from "next/link";

export default function Header() {
    return (
        <header>
            <Link href="/">
                <p>Home</p>
            </Link>
            <Link href="/about">
                <p>About</p>
            </Link>
        </header>
    )
}