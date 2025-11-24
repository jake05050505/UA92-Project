import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <div id="inputcontainer">
                    <Textarea className="centered" hidden={false} />
                </div>
            </main>
        </>
    );
}
