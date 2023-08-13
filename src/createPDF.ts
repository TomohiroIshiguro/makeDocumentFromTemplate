function createPDF(fileId, fileName, user, properties, outputDir) {
  console.log("createPDF()");

  // 成果物を保存するフォルダ
  let destFolder = DriveApp.getFolderById(outputDir);
  if (!destFolder) return;

  // テンプレートファイル
  const templateFile = DriveApp.getFileById(fileId);
  if (!templateFile) return;

  // ファイルを複製する
  const document = templateFile.makeCopy(destFolder);
  const dateFormat = "yyyymmdd-HHMMSS"; // 日付を
  fileName = fileName
      .replace("name", user.name)
      .replace("timestamp", getTimestamp(dateFormat))
      .replace(" ","");

  const tempDocFile = DocumentApp.openById(document.getId());
  tempDocFile.setName(fileName);

  // プレースホルダを置換する
  const body = tempDocFile.getBody();
  properties.forEach(property => {
    body.replaceText(`{${property}}`, user[property]);
  });
  tempDocFile.saveAndClose();

  // ユーザー情報でプレースホルダを置換したファイルを PDF ファイル形式で保存する
  const pdfContentBlob = document.getAs(MimeType.PDF);
  const pdfFile = destFolder.createFile(pdfContentBlob).setName(fileName + ".pdf");

  // 成果物の情報を記録する
  recordResult(outputDir, pdfFile);
}

// 現在時刻のタイムスタンプを取得する
function getTimestamp(format) {
  if (!format) {
    format = "yyyymmdd";
  }
  const now = new Date();
  const month = now.getMonth() + 1;
  const today = format
      .replace("yyyy", now.getFullYear())
      .replace("mm", ("0" + month).slice(-2))
      .replace("dd", ("0" + now.getDate()).slice(-2))
      .replace("HH", ("0" + now.getHours()).slice(-2))
      .replace("MM", ("0" + now.getMinutes()).slice(-2))
      .replace("SS", ("0" + now.getSeconds()).slice(-2));
  return today;
}

function recordResult(outputDir, pdfFile) {
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