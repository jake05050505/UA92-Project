import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { randomInt } from "crypto";

// function ChatResponse(res: object | null){
//     message, statistics, origin = res

//     return (
//         <div id="response">
//             {res}
//         </div>
//     )
// }

export default function Home() {
    // Random placeholder text
    const placeholder_texts_array = [
        "Is it true that...",
        "Is this news true?",
        "Did [...] really happen?",
        "I heard that...",
        "Someone told me...",
    ]
    const placeholder_text = placeholder_texts_array[randomInt(placeholder_texts_array.length)]


    return (
        <>
            <Header />
            <main>
                <div id="main-content" className="content">
                    <div id="response">
                        <div className="origin"></div>
                        <div className="stats"></div>
                        <div className="sources"></div>
                        <div className="message"></div>
                    </div>
                    <div id="request" className="content centered">
                        <Textarea
                            id="query"
                            placeholder={placeholder_text}
                            className="resize-none"
                            hidden={false}
                        />
                    </div>
                    <div id="disclaimer">
                        <p>Built with Next.js, uses ChatGPT; AI can make mistakes, double-check important info.</p>
                    </div>
                </div>
            </main>
        </>
    );
}
