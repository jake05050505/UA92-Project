import Header from "@/components/Header"

export default function About(){
    return (
        <>
            <Header />
            <main>
                <div id="main-content" className="content">
                    <h1>About</h1>
                    <hr></hr>
                    <h2>The project</h2>

                    <hr></hr>
                    <h2>The research</h2>
                    <h3>Data collection</h3>
                    <h4>How data will be collected</h4>
                    <p>Usage data will be collected and stored in a SQL database during use. Data collection - or the application itself (potentially) - won&apos;t work without a SQL installation and database credential setup in the app.</p>
                    <h3>Withdrawal</h3>
                    <h4>Your right to withdrawal</h4>
                    <p>You may withdraw from the research at any time with no consequence or advance notice. You may do so silently or you can contact the researcher.</p>
                    <h5>How will your data be used if you decide to withdraw?</h5>
                    <p>If you wish to share the data which has been collected during your research, you will send the researcher the exported data from your local SQL database.</p>
                    <hr></hr>
                </div>
            </main>
        </>
    )
}