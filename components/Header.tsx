import Link from "next/link";
import DevSwitch from "./DevSwitch";

export default function Header() {
    const dev: boolean = process.env.NODE_ENV === "development";

	return (
		<header>
			<span className="centered">
                <Link href="/">
                    Home
                </Link>
                <Link href="/about">
                    About
                </Link>
                {
                    // https://www.w3schools.com/react/react_conditional_rendering.asp#:~:text=Logical%20%26%26%20Operator
                    dev && // IF dev THEN: 
                    <DevSwitch id="devModeSwitch" style={{ marginLeft: "auto" }} />
                }
            </span>
		</header>
	);
}
