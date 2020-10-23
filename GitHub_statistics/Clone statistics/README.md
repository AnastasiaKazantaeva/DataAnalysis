# Storing number of clones for GitHub repository

## Description
As GitHub doesn't store clones data more than 2 weeks, so this script helps to automate gathering a number of clones and unique clones of your GitHub repository. All data is collected in your Google Sheet via Google App Script.

## Details

This script is using Google App Script and GitHub API.

This script doesn't store data for the current day, because this day is not over, it stores only the previous days. 

If some day you had 0 clones GitHub API doesn't return this day at all. For example, if you have 1 Jan 12 clones, 2 Jan 0 clones, 3 Jan 0 clones, 4 Jan 5 clones, then API will return you: 1 Jan 12 clones, 4 Jan 5 clones. So this script checks missing days and adds dates with 0 clones and 0 unique clones.

Script checks what data you already have and doesn't insert duplicate dates.


## How to
1. Check that you have rights to see traffic of GitHub repo. Go to repository -> Insights -> Traffic. 
If you can see the 'Traffic' tab, you have admin rights and can get clones data via API. If not - request access from your repo's admin.
1. Get GitHub authorization token. Instruction: https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line
1. Create empty Google Sheet
1. Add header for three first columns: 'Date',	'Clones', 'Unique'
1. Go to Tools->Script Editor
1. Insert code of clones_stat.js file into script editor 
1. Select function 'recordGitClonesCount'
1. Modify script:
 1. Set your token from step 2 instead of 'YOUR_TOKEN_NUMBER'
 1. Set your repo instead of 'OWNER1/REPO1'
 1. If you have only one repo - remove array ', ['OWNER2/REPO2', 'GOOGLE_SHEET_NAME2']'. If not - set a second repository name. Put as many arrays as you have repositories.
 1. Set name of sheet instead of 'GOOGLE_SHEET_NAME1' where you are going to store data (Ex. 'Sheet1'). Create another sheet if you need to store more than 1 repository data.
1. Run script (but before Google App Script asks you for permission - need to agree). 
1. Check the result in your google sheet.
1. Set up trigger for daily updates of this table. Go to 'Current project's trigger' -> Add trigger -> Choose function (recordGitClonesCount), choose event source (time-driven), choose type (day timer), choose time (my table is updating between midnight to 1 am).