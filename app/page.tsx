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
    const lorem_ipsum = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, "

    return (
        <>
            <Header />
            <main>
                <div id="main-content" className="content">
                    <div id="response">
                        <div id="stats"></div>
                        <div id="sources"></div>
                        <div id="message"><p>{lorem_ipsum}</p></div>
                    </div>
                    <div id="request" className="centered content">
                        <Textarea
                            id="query"
                            placeholder={placeholder_text}
                            className="resize-none"
                            hidden={false}
                        />
                        <div id="disclaimer">
                            <p>Built with Next.js, uses ChatGPT; AI can make mistakes, double-check important info.</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
