# Automatic email notification of all open issues on GitHub by some label

## Description
This help you to better communicate with your customers and provide them answer very quickly.

## Details

This script is using Google App Script and GitHub API.

This script send you or all your team an email with all open issues with specified label. If no open issue you'll get an email 'It seems that you have done for today'.
Set up triger for this script to execute it every day or once per week, it will help to stay you up-to-date with all current open issues.

## How to
1. Get GitHub authorization token. Instruction: https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line
1. Create empty Google Sheet
1. Go to Tools->Script Editor
1. Insert code of GitHub_email_notification_for_issues.jsfile into script editor 
1. Select function 'get_issues'
1. Modify script:
 1. Set your token from step 2 instead of 'YOUR_TOKEN_NUMBER'
 1. Set your repo instead of 'OWNER/REPO'
 1. Set your label instead of LABEL
 1. Set your email instead of MY_EMAIL
1. Run script (but before Google App Script asks you for permission - need to agree). 
1. Set up trigger for daily updates of this table. Go to 'Current project's trigger' -> Add trigger -> Choose function (get_issues), choose event source (time-driven), choose type (day timer), choose time.