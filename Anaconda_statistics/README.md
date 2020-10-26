# Storing number of downloads for Anaconda packages

## Description
Anaconda keep number of total clones per image. If you want to collect this data per day for further analysis use this script.

## Details

This script is using Google App Script. Anaconda doesn't provide any API to collect this data, so it is possible to gather number of clones by parsing html page.

## How to
1. Create empty Google Sheet with sheet, add header 'Date', 'NAME OF YOUR PACKAGE'
1. The first 'Docker_pull'. Add header: 'Date',	'IMAGE1' (add as many images you have to different column). Here will be stored the total number of clones at date.
1. The second sheet: duplicate the first one, but rename it to 'Pull_per_day'. Here will be stored the difference between number of clones at date.
1. Go to Tools->Script Editor
1. Insert code of anaconda_package_stat.js file into script editor 
1. Select function 'recordAnacondaDownloadsCount'
1. Modify script:
 1. Insert your sheet name instead of <YOUR SHEET NAME>
 1. Insert your anaconda package name instead of <YOUR ANACONDA PACKAGE PATH>
 1. In function 'get_downloads_number' change <YOUR FIRST PACKAGE NAME> to unique name of your package name.
 1. If you have only one repo - remove array <YOUR SECOND PACKAGE NAME> and clear regexp. If you have two or more put as many package names as you have (<YOUR SECOND PACKAGE NAME> with regexp)
1. Run script (but before Google App Script asks you for permission - need to agree). 
1. Check the result in your google sheet.
1. Set up trigger for daily updates of this table. Go to 'Current project's trigger' -> Add trigger -> Choose function (recordAnacondaDownloadsCount), choose event source (time-driven), choose type (day timer), choose time (my table is updating between midnight to 1 am).