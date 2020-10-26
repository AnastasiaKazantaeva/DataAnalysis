function recordAnacondaDownloadsCount() {
	var date =  new Date();

	var row = [date];
	var data = get_downloads_number();
	row = row.concat(data);
	row = add_to_row_additional_info(row, date);

	var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("YOUR SHEET NAME");
	sheet.appendRow(row);
}

function get_downloads_number() {
  var url_site = "https://anaconda.org/<YOUR ANACONDA PACKAGE PATH>/files"; 
  var page = UrlFetchApp.fetch(url_site).getContentText();
  
  var regExp = page.match(/\/YOUR FIRST PACKAGE NAME.*[^]+.*\<strong\>(\d+)\<\/strong\>[^]+tr\>[^]+.*\/YOUR SECOND PACKAGE NAME.*[^]+.*\<strong\>(\d+)\<\/strong\>[^]+tr\>/);
  var first_package = regExp[1];
  var second_package = regExp[2];
  
  var row = [first_package, second_package];
  
  return row;
}

function add_to_row_additional_info(row, date){
  var week_day = 1;
  //    Add 0 if it is workday and 1 if week day
  if ((date.getDay() == 0) || (date.getDay() == 6)){
    week_day = 1;
  }else {
    week_day = 0;
  }
  row.push(week_day);
  // Add year and month of the date:
  row.push(date.getFullYear());
  row.push(date.getMonth()+1);
  return row;
}