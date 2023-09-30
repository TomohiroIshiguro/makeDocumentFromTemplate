// テンプレートファイルを処理実行の度に個別に複製する
function createTempFile(fileId, outputDir) {
  console.log("createTempFile()");

  // 成果物を保存するフォルダ
  let destFolder = DriveApp.getFolderById(outputDir);
  if (!destFolder) return;

  // テンプレートファイル
  const templateFile = DriveApp.getFileById(fileId);
  if (!templateFile) return;

  // ファイルを複製する
  const file = templateFile.makeCopy(destFolder);

  return file;
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