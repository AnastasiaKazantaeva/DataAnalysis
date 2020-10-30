# Storing issues and issue details to Google Sheet

## Description
This help to store GitHub issue information for further analysis. All data is collected in your Google Sheet via Google App Script.

## Details

This script is using Google App Script and GitHub API.

This script doesn't store data for the current day, because this day is not over, it stores only for previous days. 
Not everyday you have some issues, so at this day you will have an empty line: Date, Year, Month, Day. The rest colums will be empty. It was implemented in order to build per day chart, where you can see trend day over day, calculate average number of issues per day.


## How to
1. Get GitHub authorization token. Instruction: https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line
1. Create empty Google Sheet
1. Add header: 'Date', 'Year', 'Month', 'Day', 'Exact date', 'Closed date', 'Case age, days', 'Author',	'IsAMember', 'Link', 'Labels', 'Status', 'Assignee'
1. Go to Tools->Script Editor
1. Insert code of initial_issue_tracking.js file into script editor 
1. Select function 'initial_issues_tracking'
1. Modify script:
 1. Set your token from step 2 instead of 'YOUR_TOKEN_NUMBER'
 1. Set your repo instead of 'OWNER/REPO'
 1. Set name of sheet instead of 'GOOGLE_SHEET_NAME' where you are going to store data (Ex. 'Sheet1')
1. Run script (but before Google App Script asks you for permission - need to agree). 
1. Check the result in your google sheet.
1. Set up trigger for daily updates of this table. Go to 'Current project's trigger' -> Add trigger -> Choose function (initial_issues_tracking), choose event source (time-driven), choose type (day timer), choose time (my table is updating between midnight to 1 am).