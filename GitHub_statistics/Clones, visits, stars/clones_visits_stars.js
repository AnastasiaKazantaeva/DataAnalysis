function recordGitClonesCount() {
	//  repos: [user/repo, name of list in Google Sheet]
	repo = 'OWNER/REPO';
	var row = [];

	var clone_count = get_repos_clones_count(repo);
	var correct_clone_count = check_clones_dates(clone_count);
	get_per_day_clones(correct_clone_count, 'clones');

	var views_count = get_repos_visitors_count(repo);
	var correct_views_count = check_clones_dates(views_count);
	get_per_day_clones(correct_views_count, 'visitors');

	get_repo_stars(repo, 'stars');
}

function get_repos_clones_count(repo) {
  var API_URL = 'https://api.github.com/repos/' + repo + '/traffic/clones';
  var token = 'token YOUR_TOKEN_NUMBER';
  var options = {
    headers: {Authorization: token}
  }

  var response = UrlFetchApp.fetch(API_URL, options);
  var repoStats = JSON.parse(response.getContentText());
  return repoStats['clones'];
}

function get_repos_visitors_count(repo) {
  var API_URL = 'https://api.github.com/repos/' + repo + '/traffic/views';
  var token = 'token YOUR_TOKEN_NUMBER';
  var options = {
    headers: {Authorization: token}
  }

  var response = UrlFetchApp.fetch(API_URL, options);
  var repoStats = JSON.parse(response.getContentText());
  return repoStats['views'];
}

function get_repo_stars(repo, list_name) {
  var API_URL = 'https://api.github.com/repos/' + repo;
  var token = 'token YOUR_TOKEN_NUMBER';
  var options = {
    headers: {Authorization: token}
  }

  var response = UrlFetchApp.fetch(API_URL, options);
  var repoStats = JSON.parse(response.getContentText());
  var date = new Date();
  var row_to_add = [date, repoStats['stargazers_count']];
  //    Add 0 if it is workday and 1 if week day
  if ((date.getDay() == 0) || (date.getDay() == 6)){
    row_to_add.push(1);
  }else {
    row_to_add.push(0);
  }
  
  // Add year and month of the date:
  row_to_add.push(date.getFullYear());
  row_to_add.push(date.getMonth()+1);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(list_name);
  sheet.appendRow(row_to_add); 
}


function check_clones_dates(clones){
//  This function check if all clones dates are one by one, no one missing days
//  Missind days happened if both total clones and unique clones are 0 for this date
  var len = clones.length;
  // Len = 15 only if clones information are full
  if (len == 15){
    return clones;
  }

  var correct_clones = []
  for(var i=0;i<(len-1);i++){
    correct_clones.push(clones[i]);
    var first_date = new Date(clones[i]['timestamp']).getTime();
    var second_date = new Date(clones[i+1]['timestamp']).getTime();
    var diff_in_time = second_date - first_date;
    var diff_in_days = diff_in_time/ (1000 * 3600 * 24);
    if (diff_in_days > 1){
//      Add as many days as difference between dates
      var following_day = first_date + 86400000;
      for(var j=1;j<diff_in_days;j++){
        correct_clones.push({'timestamp': new Date(following_day), 'count':0, 'uniques':0});
        following_day = following_day + 86400000;
      }}}
  correct_clones.push(clones[len-1]);
  return correct_clones;
}

function get_per_day_clones(clones, list_name){
  var avaliable_dates  = clones.map(get_date_of_avaliables_clones_info);
  if (avaliable_dates.slice(-1) == new Date().setHours(0,0,0,0)){
    //  Remove last element, because it includes current date, but current date has statistic for current time, not for the end of the day
    avaliable_dates.pop();
  }
  
  // All dates already added to Google Sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(list_name);

  var calculated_dates = []
  // If getLastRow == 1 it means that this list consist of header only
  if (sheet.getLastRow() != 1){
    calculated_dates = sheet.getRange("A2:"+ sheet.getLastRow()).getValues().map(firstOfArrayAndValue);
  }
  
  // Find all dates that missed in second sheet with Pulls per day  
  var missing_dates = missed(avaliable_dates, calculated_dates)
  
  if (missing_dates.length === 0){
    // Nothing to add
    return;
  }
  
  // Find index of missing day in avaliable_dates in json and assume that all next dates are missing instead of the last one (current date)
  var row_first_missing = -1
  for(var i=0;i<clones.length;i++) {
    if (new Date(clones[i]['timestamp']).setHours(0,0,0,0) === missing_dates[0]){
      row_first_missing = i;
    }}
  
  if (row_first_missing < 0){
    // Nothing to add
    return;
  }
  
  for(var i=row_first_missing;i<row_first_missing+missing_dates.length;i++) {
    var row_to_add = [];
    // SetHours as clones has all time 3 hours   
    var timestamp = new Date(clones[i]['timestamp']).setHours(0, 0, 0, 0);
    var date = new Date(timestamp);
    row_to_add.push(date, clones[i]['count'], clones[i]['uniques']);
    
    //    Add 0 if it is workday and 1 if week day
    if ((date.getDay() == 0) || (date.getDay() == 6)){
          row_to_add.push(1);
    }else {
      row_to_add.push(0);
    }
    
    // Add year and month of the date:
    row_to_add.push(date.getFullYear());
    row_to_add.push(date.getMonth()+1);
    sheet.appendRow(row_to_add);
  }
}

function get_date_of_avaliables_clones_info(array) {
   return new Date(array['timestamp']).setHours(0,0,0,0);
}

function firstOfArrayAndValue(array) {
   return array[0].setHours(0,0,0,0);
}

function missed(invited,attended){
  return invited.filter(function(e){return attended.indexOf(e) === -1});
}