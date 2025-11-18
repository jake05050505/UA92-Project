import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <header>
        <Link href="/">
          <p>Home</p>
        </Link><Link href="/about">
          <p>About</p>
        </Link>
      </header>
      <main>
        <input type="text" />
      </main>
    </>
  );
}
