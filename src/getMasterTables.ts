// config シートから台帳のシート名を取得する
function getMasterTables(ss) {
  console.log("getMasterTables()");
  const sheet = ss.getSheetByName(SHEET_NAME_CONFIG);
  const columnLength = sheet
      .getRange(ROW_TABLE_HEADING, COLUMN_TABLE_COLUMN_HEADERS)
      .getNextDataCell(SpreadsheetApp.Direction.NEXT)
      .getColumn()
      + 1 - COLUMN_TABLE_COLUMN_HEADERS; // 起点までの列数を調整する
  const data = sheet
      .getRange(ROW_TABLE_HEADING, COLUMN_TABLE_COLUMN_HEADERS, ROW_TABLE_HEADING, columnLength)
      .getValues();
  return (data.length > 0)? data[0] : [];
}