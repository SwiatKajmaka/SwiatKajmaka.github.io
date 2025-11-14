function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const dateParam = e.parameter.date;
  if (!dateParam) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Missing 'date' parameter" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === dateParam) {
      const row = data[i];
      let response = {};

      for (let j = 0; j < headers.length; j++) {
        response[headers[j]] = row[j];
      }

      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ error: "No data for this date" }))
    .setMimeType(ContentService.MimeType.JSON);
}
