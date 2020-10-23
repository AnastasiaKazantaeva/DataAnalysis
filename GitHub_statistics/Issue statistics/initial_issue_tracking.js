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
