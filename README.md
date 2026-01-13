# AI Credibility Analyser
## Background (contemporary issue)
There is a lot of misinformation online, and determining what is and isn't misinformation is a lengthy process

## The project
### Outline
This project aims to deliver software which provides a quicker solution to verifying online information, using deep-learning - a large language model with web search capabilities - to analyse data from multiple sources, and summarise what has been found, as well as provide statistics on the information found such as which sources were analysed, and how accurate a query or claim is.

### Technologies
In the current version, this project uses the following technologies:
- Express.js
- TailwindCSS
- OpenAI ChatGPT (gpt-5-mini)

and node packages:
- cross-env
- dotenv
- ejs
- nodemon

## Setup
### Installation
- This project uses node.js. You can install node.js here: https://nodejs.org/
1. Clone the repository into a directory of your choice.
2. Open the cloned repository in your terminal with `$ cd path/to/cloned_repo`.
3. Enter the command `$ npm i` to install required dependencies.
Now that the project is installed, you'll need to setup your API key.

### Environment
- First, you'll need an API key from OpenAI. You can do this by logging in with your OpenAI account at https://openai.com/api/, clicking the "Dashboard" link (top right), then API keys (sidebar, under Manage). Create a new API key (recommended) or use an existing one.
1. In the `project/` folder, create a new file called `.env`.
2. Open the `.env` file in your text editor, and add the line `OPENAI_API_KEY=your_api_key`.

If you don't want to create a `.env` file, and would prefer to use a system environment variable, you can do so by setting it in your shell. This hasn't been tested and may not work as expected.

```PowerShell
$env:OPENAI_API_KEY="Your_API_Key"
```

### Running the server
1. Open the cloned repository in your terminal.
2. Enter the command `$ npm run start` to start the server.
3. You should get an output saying: `Server running on http://localhost:3000`, go to this URL in your web browser.
- To stop the server process, press CTRL+C `^C` in the terminal where you started the server.


## Drawbacks
### Specific
- This project uses presently-available data and analyses on a certain subject, and summarises all data it finds into a digestible message, and score. This means it may not work on novel misinformation (new misinformation, with no existing research/validation).
- If the majority of available data represents an opinion which is incorrect or unfavourable, the response will reflect in-favor of the incorrect take. An incorrect, yet outspoken claim may erroneously be labelled as correct.
- AI can, and will make mistakes, double-check responses against validated information.
- Messages cost approx. $0.10/message depending on many factors such as how many sites were crawled and length of input/output message.
### Non-specific
- This project doesn't follow latest security practices. For this reason, it won't be hosted. Critical security practices (such as not exposing API keys - .env file and `dotenv` npm module) will be followed.

## TODO:
- Message history with sessions (will disappear after session expires)
- SQL database? (ammended: mongodb server)
    - Logins, message history
        - multiple chats?
