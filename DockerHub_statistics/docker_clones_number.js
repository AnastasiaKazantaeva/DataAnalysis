function recordDockerImagePullCount() {
 images = ['IMAGE1', 'IMAGE2'];
 var row = [new Date()];
 
 images.forEach(function (image) {
	 var pull_count = get_image_pull_count(image);
	 row.push(pull_count);
   })
 
 var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Docker_pull");
 sheet.appendRow(row);
 count_pulls_per_day(images);
}

function get_image_pull_count(image) {

  var response = UrlFetchApp.fetch("https://hub.docker.com/v2/repositories/" + image);
  var imageStats = JSON.parse(response.getContentText());
  return imageStats['pull_count'];
}

function count_pulls_per_day(images){
//  From main sheet Docker_pull
  var sheet_main = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Docker_pull");
  var main_data = sheet_main.getDataRange().getValues();
  main_data.shift();
  var all_dates = sheet_main.getRange("A2:"+sheet_main.getLastRow()).getValues().map(firstOfArrayAndValue);
  
//  From sheet Pull_per_day
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Pull_per_day");
  var per_day_data = sheet.getDataRange().getValues();
  per_day_data.shift();
  var calculated_dates = sheet.getRange("A2:"+sheet_main.getLastRow()).getValues().map(firstOfArrayAndValue);

// Find all dates that missed in second sheet with Pulls per day  
  var missing_dates = missed(all_dates,calculated_dates)
  
//  Find i,j for the first missing dates and assume that all the next dates are below this one
  if (missing_dates.length === 0){
//    Nothing to add
    return;
  }
  var row_first_missing = -1
  for(var i=0;i<main_data.length;i++) {
    if (main_data[i][0].valueOf() === missing_dates[0]){
      row_first_missing = i;
    }}
  
  if (row_first_missing < 0){
//    Nothing to add
    return;
  }
  
  for(var i=row_first_missing;i<main_data.length;i++) {
//    Add date to row
    var row_to_add = []
    row_to_add.push(main_data[i][0]);
//    Calculate pulls per day
    var a = main_data[i].length;
    for(var j=1;j<images.length+1;j++){
      row_to_add.push(main_data[i][j] - main_data[i-1][j]);
    }
//    Add 0 if it is workday and 1 if week day
    if ((main_data[i][0].getDay() == 0) || (main_data[i][0].getDay() == 6)){
          row_to_add.push(1);
    }else {
      row_to_add.push(0);
    }
    
    row_to_add.push(main_data[i][0].getFullYear());
    row_to_add.push(main_data[i][0].getMonth()+1);

    sheet.appendRow(row_to_add);
  }}

function firstOfArrayAndValue(array) {
   return array[0].valueOf();
}

function missed(invited,attended){
  return invited.filter(function(e){return attended.indexOf(e) === -1});
}