// 台帳のデータを読み込む
function getMasterTable(ss, sheetName, properties) {
  console.log("getMasterData()");
  const users = ss
    .getSheetByName(sheetName)
    .getDataRange()
    .getValues();
  const array = [];
  users.forEach((item, index) => {
    if (index === 0) return; // 列ヘッダの行はスキップ
    if (!item[0]) return; // チェックなしの行はスキップ
    if (!item[1]) return; // データ行の先頭が空欄の場合はスキップ
    const user = {};
    properties.forEach((prop, index) => {
      user[prop] = item[index];
    });
    array.push(user);
  });
  return array;
}

// config シートから台帳のプロパティ名 (列名) を取得する
// *列名がテンプレートファイル内のプレースホルダのキーワード
function getProperties(ss, sheetColumn) {
  const sheet = ss.getSheetByName(SHEET_NAME_CONFIG);
  // 任意の列のデータの個数を取得する
  const rowLength = sheet
      .getRange(ROW_DATA_BEGIN, sheetColumn)
      .getNextDataCell(SpreadsheetApp.Direction.DOWN)
      .getRow()
      + 1 - ROW_DATA_BEGIN; // 起点までの行数を調整する
  // 任意の列のデータを取得する
  return sheet
      .getRange(ROW_DATA_BEGIN, sheetColumn, rowLength)
      .getValues();
}