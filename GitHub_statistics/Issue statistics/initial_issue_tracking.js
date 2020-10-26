function initial_issues_tracking() {
  // Clean data on sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('GOOGLE_SHEET_NAME');
  var num_rows = sheet.getLastRow();
  if (num_rows > 1){
    sheet.deleteRows(2, num_rows-1);
  }
  
  var repo = 'OWNER/REPO';
  var token = 'token YOUR_TOKEN_NUMBER';
  var options = {
    headers: {Authorization: token}
  }
  
  var page = 1;
  var per_page = 100;
  var github_url = 'https://api.github.com/';
  var not_full_url = github_url + 'search/issues?q=repo:' + repo + '+is:issue+sort:created-asc&per_page=' + per_page;
  
  var response = UrlFetchApp.fetch(not_full_url, options);
  var result = response.getContentText();
  var data = JSON.parse(result);
  var today = new Date().getTime();
    
  //  Calculate number of page
  var total_count = data['total_count'];
  var number_of_page = parseInt(total_count/per_page) + 1;
   
  // For every page collect all Issues 
  for (var p=1; p<=number_of_page; p++){
    var page_response = UrlFetchApp.fetch(not_full_url + '&page=' + p, options);
    var page_stats = JSON.parse(page_response.getContentText());
    var prev_date;
    for (var j=0;j<page_stats['items'].length;j++){
      var issue = page_stats['items'][j];
      var row = prepare_row_to_add(issue, github_url, repo, options);
      var created_date =  new Date(issue['created_at']);
      

      var assignees = issue['assignees'];
      var assignees_login = [];
      if (assignees){
        for (var a=0; a<assignees.length;a++){
          var log = assignees[a]['login'];
          assignees_login.push(log);
        }
        
      } 
      days_without_issue(issue, prev_date, sheet, j);
      sheet.appendRow(row);
      prev_date = created_date;
    }
  }
 
  // Write hyperlink
  var num_rows = sheet.getLastRow();
  for (var i=2;i<=num_rows;i++){
    var issue_range = sheet.getRange("J"+i);
    var issue_link = issue_range.getValue();
    var issue_number = issue_link.split('/').pop();
    issue_range.setFormula('=HYPERLINK("' + issue_link + '";' + '"' + issue_number + '")');
  }
}

function prepare_row_to_add(issue, github_url, repo, options){
  var created_date =  new Date(issue['created_at']);
  var closed_date = issue['closed_at'];
  if (closed_date){
    closed_date = new Date(closed_date);
  }
  
  var diff_days = "";
  
  if (closed_date){
    diff_days = closed_date.setHours(0,0,0,0) - created_date.setHours(0,0,0,0);
    diff_days = Math.floor((diff_days)/(24*3600*1000));
  }
  else{
    closed_date = "";
  }
  
  var user_login = issue['user']['login'];
  // Check if author is member of your repo  
  var check_member_url = github_url + 'orgs/' + repo.split('/').shift() + '/members/' + user_login;
  var isMember;
  try{
    var response_member = UrlFetchApp.fetch(check_member_url, options);
    isMember = true;
  } catch(err) {
    isMember = false;
    }
//  var result_member = response_member.getContentText();
//  var data_member = JSON.parse(result_member);
  
  var year = created_date.getFullYear();
  var month = 1 + created_date.getMonth();
  var day = created_date.getDate();
  var label_info = issue['labels'];
  var label_list = [];
  for (var l=0;l<label_info.length;l++){
    label_list.push(label_info[l]['name']);
  }
  
  var assignees = issue['assignees'];
  var assignees_login = [];
  if (assignees){
    for (var a=0; a<assignees.length;a++){
      var log = assignees[a]['login'];
      assignees_login.push(log);
    }
    
  } 
  
  var row = ([year + '/' + month + '/' + day, year, month, day, created_date, closed_date, diff_days, user_login, isMember, issue['html_url'], label_list.toString(), issue['state'], assignees_login.toString()]);
  return row;
}


function days_without_issue(issue, prev_date, sheet, j){
  // Find how many days between previous day of creted issue and current. If more than 1 - add empty line to Google Sheet
  var created_date =  new Date(issue['created_at']);
  var diff_days;
  if (j != 0){
    diff_days = Math.floor((created_date.setHours(0,0,0,0)-prev_date.setHours(0,0,0,0))/(24*3600*1000));
  }
  
  if (diff_days > 1){
    for(var i=1; i<diff_days; i++){
      var day_to_add = new Date(prev_date.getFullYear(), prev_date.getMonth(), prev_date.getDate()+i);
      var year_ = day_to_add.getFullYear();
      var month_ = 1 + day_to_add.getMonth();
      var day_ = day_to_add.getDate();
      sheet.appendRow([year_ + '/' + month_ + '/' + day_, year_, month_, day_]);
    }
  }
}
