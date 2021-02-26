# ******************************************************************************
# Copyright 2021 Anastasia Kazantaeva
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ******************************************************************************

function get_issues() {
  //Skip week-end
  var day = new Date();
  if (day.getDay()>5 || day.getDay()==0) {
    return;
  }
 
  var repo = 'OWNER/REPO';
  var token = 'token YOUR_TOKEN_NUMBER';
  var options = {
    headers: {Authorization: token}
  }
       
  var page = 1;
  var per_page = 100;
  var github_url = 'https://api.github.com/';
       
  // Collect issues with label 'LABEL':
  var label_name = 'LABEL';
  var url = github_url + 'search/issues?q=repo:' + repo + '+is:issue+is:open+label:' + label_name + '&per_page=' + per_page + '&sort=created'; 
  var response = UrlFetchApp.fetch(url, options);
  var result = response.getContentText();
  var data = JSON.parse(result);
    
  //  Calculate number of page
  var total_count = data['total_count'];
  var number_of_page = parseInt(total_count/per_page) + 1;
  
  var issue_list = {};
  // For every page collect all issues 
  for (var p=1; p<=number_of_page; p++){
    var page_response = UrlFetchApp.fetch(url + '&page=' + p, options);
    var page_stats = JSON.parse(page_response.getContentText());
    for (var j=0;j<page_stats['items'].length;j++){
      var issue = page_stats['items'][j];
      var issue_nb = issue['number'];
      var assignee = issue['assignee'];
      var created_date_str = new Date(issue['created_at']).getFullYear() + "/" + (new Date(issue['created_at']).getMonth() + 1) + "/" + new Date(issue['created_at']).getDate();
      var updated_date_str = new Date(issue['updated_at']).getFullYear() + "/" + (new Date(issue['updated_at']).getMonth() + 1) + "/" + new Date(issue['updated_at']).getDate();
      var assignees = issue['assignees'];
      var assignees_login = [];
      if (assignees){
        for (var a=0; a<assignees.length;a++){
          var log = assignees[a]['login'];
          assignees_login.push(log);
        }
      } 
      issue_list[issue['html_url']] = [issue['title'], created_date_str, updated_date_str, assignees_login];
    }
  }

  // Creating html message for general email
  var header_general = '<p>Hi all,</p> <p>This is list of open issues with label "LABEL". </p>';
  var message_general = building_html(header_general, issue_list);                                                                                          
  
  //  Send general message
	MailApp.sendEmail({to:'MY_EMAIL', subject:'Issues with label LABEL from MY_REPO', htmlBody:message_general});
}

function get_html_text(intro_text, issues_list){
  var html_text = "";
  var end = '</tbody></table>';
  var i = 1;
  for (var key in issues_list){
    var text = '<tr><td>&nbsp;' + i + '</td><td>&nbsp;<a href=' + key + '>' + issues_list[key][0] + '</a>&nbsp;</td><td>&nbsp;' + issues_list[key][1] + '</td><td>&nbsp;' + issues_list[key][2] + '</td><td>&nbsp;' + issues_list[key][3] + '</td></tr>'
    html_text = html_text.concat(text);
    i++;
  }
  var result_text;
  if (html_text.lenght !== 0){
    result_text = intro_text + html_text;
    result_text = result_text + end;
  }
  return result_text;
}

function building_html(header, issue_list){
  var text_for_issues = "";
  if (Object.keys(issue_list).length > 0){
    var intro_text_for_issues = '<table><tbody><tr><th>Number</th><th>Title</th><th>Created date</th><th>Updated date</th><th>Assignee</th></tr>';
    text_for_issues = get_html_text(intro_text_for_issues, issue_list);
  }
  
  var finish = '<p>&nbsp;</p><p>This is automatically generated message, if you want to unsubsribe contact me.</p><p></p><p>Best regards,</p><p>YOUR NAME</p>';
  var message;
  if (Object.keys(issue_list).length == 0){
    header = '<p>Hi ' + login + ',</p> <p>It seems that you have done for today. No open issues with "LABEL" label. Have a good day!</p>';
    message = header + finish; 
  }
  else {
    message = header + text_for_issues + finish; 
  }
  return message;
}