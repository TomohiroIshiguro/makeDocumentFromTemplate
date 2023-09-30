function replaceDocParameters(file, fileName, data, properties) {
  console.log("replaceDocParameters()");
  const tempDocFile = DocumentApp.openById(file.getId());

  const dateFormat = "yyyymmdd-HHMMSS";
  fileName = fileName.replace("{timestamp}", getTimestamp(dateFormat));
  tempDocFile.setName(fileName);

  // プレースホルダを置換する
  const body = tempDocFile.getBody();
  properties.forEach(property => {
    fileName = fileName.replace(`{${property}}`, data[property]).replace(/ /g,"").replace(/\./g,"");
    tempDocFile.setName(fileName);
    body.replaceText(`{${property}}`, data[property]);
  });
  tempDocFile.saveAndClose();
}

function createPDF(file, outputDir) {
  console.log("createPDF()");
  const tempDocFile = DocumentApp.openById(file.getId());
  let destFolder = DriveApp.getFolderById(outputDir);

  // ユーザー情報でプレースホルダを置換したファイルを PDF ファイル形式で保存する
  const pdfContentBlob = file.getAs(MimeType.PDF);
  const pdfFile = destFolder.createFile(pdfContentBlob).setName(tempDocFile.getName() + ".pdf");

  // 成果物の情報を記録する
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  const timestamp = `${year}-${month}-${date} ${hour}:${minute}:${second}`;

  const row = [];
  row.push(timestamp);
  row.push(pdfFile.getName());
  row.push(pdfFile.getId());
  row.push(pdfFile.getUrl());
  row.push(`https://drive.google.com/drive/folders/${outputDir}`);
  console.log(row);

  const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME_REPORT)
      .appendRow(row);
}