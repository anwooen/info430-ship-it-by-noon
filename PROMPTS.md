# What I asked the AI

Summary of my requests and the checks made while building the app.

| What I asked (paste or summarize) | What happened | What I had to fix or check |
| --- | --- | --- |
| Check whether this repository can be used for the assignment and explain what to do next. | The AI reviewed the starter files and explained the required screenshots, app files, and repository submission. | The app files were not built yet, and IDEA.md and this log needed to be filled in. |
| Help connect this folder to my own GitHub repository. | The Git remote was changed to https://github.com/anwooen/info430-ship-it-by-noon.git. | The AI verified that both fetch and push point to my repository. |
| Use study sessions as my app idea. | IDEA.md was filled in with a user story about comparing study time by course and date range. | The app should show session details and total study minutes for each course. |
| Set up the environment using my NetID, and check whether the database password was saved. | The AI installed the required packages, configured andr3wn_myapp, created the database, and ran the connection check. I entered the password locally in .env. | The initial restricted connection failed; the connection succeeded after network access was allowed. I took the successful npm run check screenshot. |
| Build the study-session tracker for me. | The AI created the HTML page, Express API, SQL schema, data loader, and query worksheet. It loaded 5 sample courses and 25 sample study sessions into my database. | The AI checked totals, course and date filters, empty results, invalid dates, and SQL-injection input. It also verified that the page displayed database rows in Safari. |
| Help fix the npm run check error: Cannot find module 'dotenv'. | The error showed that I was running the command in Desktop/info430-ship-it-by-noon instead of Desktop/ship-it-by-noon, where the dependencies and app were set up. | The AI explained how to switch to the correct folder and rerun the check. |
| Explain what to submit and fill in PROMPTS.md. | The AI listed the two screenshots and my GitHub repository link, then summarized this conversation in this log. | Before submitting, I still need to ensure the screenshots are ready and the completed files are committed and pushed, with no .env file or password included. |
