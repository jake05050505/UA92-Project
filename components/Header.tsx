import Link from "next/link";
import Switch from "@/components/ui/switch";

export default function Header() {
    return (
        <header>
            <Link href="/">
                <p>Home</p>
            </Link>
            <Link href="/about">
                <p>About</p>
            </Link>
            <Switch id="darkmode-toggle" />
        </header>
    )
}