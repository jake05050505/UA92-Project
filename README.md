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

### Installing


## Drawbacks
### Specific
- This project uses presently-available data and analyses on a certain subject, and summarises all data it finds into a digestible message, and score. This means it probably won't work on novel misinformation (with no research/existing validation).
- If the majority of available data represents an opinion which is incorrect or unfavourable, the response will reflect in-favor of the incorrect take. An incorrect, yet outspoken claim may erroneously be labelled as correct.
- AI can, and will make mistakes occasionally, double-check responses against validated information.
### Non-specific
- This project doesn't follow latest security practices. For this reason, it won't be hosted. Critical security practices (such as not exposing API keys - .env file and `dotenv` npm module) will be followed.

## TODO:
- Implement loading indicator on form submission or loading skeleton structure
- Implement SQL database if required