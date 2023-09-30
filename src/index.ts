function main() {
  const beginTimestamp = Date.now();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const showResultCell = ss.getSheetByName(SHEET_NAME_README).getRange(5,3);
  showResultCell.setValue("");

  const dateFormat = "@HH:MM on yyyy-mm-dd";

  // テンプレートファイル情報を取得する
  const files = getTemplates(ss);
  if (!files || files.length === 0) {
    showResultCell.setValue("テンプレートファイルが未選択のため、処理を中断します。" + getTimestamp(dateFormat));
    console.log("中断");
    return;
  }
  console.log(files.length);

  // 台帳 (シート) 一覧を取得する
  const masters = getMasterTables(ss);
  console.log(masters);

  //台帳のデータを読み込む
  let hasData = false;
  const tables = [];
  masters.forEach((master, index) => {
    const properties = getProperties(ss, COLUMN_TABLE_COLUMN_HEADERS + index);
    const rows = getMasterTable(ss, master, properties);
    console.log(rows.length + " row is checked on the '" + master + "' sheet.");
    if (rows && rows.length > 0) {
      hasData = true;
    }
    const table = {};
    table["properties"] = properties;
    table["data"] = rows;
    tables.push(table);
  });
  if (!hasData) {
    showResultCell.setValue("データが未選択のため、処理を中断します。" + getTimestamp(dateFormat));
    console.log("中断");
    return;
  }

  // テンプレートファイルのプレースホルダを置換して Document を作成する
  const sheet = ss.getSheetByName(SHEET_NAME_CONFIG);
  files.forEach(file => {
    // ファイルの保存先を取得する
    if (!file.output) {
      file.output = sheet
          .getRange(ROW_DATA_BEGIN, COLUMN_ROOT_DIR)
          .getValue();
    }

    let document;
    let address;
    if (file.type == DOC_TYPE_DOCUMENT
        || file.type == DOC_TYPE_EMAIL) {
      document = createTempFile(file.id, file.output);
    } else {
      console.log("中断");
      return;
    }

    // ファイルをデータで置換する
    tables.forEach(item => {
      if (!item) return;
      item.data.forEach(row => {
        if (file.type == DOC_TYPE_DOCUMENT) {
          replaceDocParameters(document, file.name, row, item.properties);
        } else if (file.type == DOC_TYPE_EMAIL) {
          const to = replaceEmailParameters(document, file.name, row, item.properties);
          if (!address || address.length == 0) {
            address = to;
          }
        }
        file.name = DocumentApp.openById(document.getId()).getName();
      });
    });

    if (file.type == DOC_TYPE_DOCUMENT) {
      createPDF(document, file.output);
    } else if (file.type == DOC_TYPE_EMAIL) {
      createEmailDraft(document, address);
    }
  });
  showResultCell.setValue("処理が完了しました。" + getTimestamp(dateFormat));
  const endTimestamp = Date.now();
  pastTime = endTimestamp - beginTimestamp;
  pastTimeMin = Math.floor(pastTime / 1000 / 60);
  pastTimeSec = Math.floor(pastTime / 1000 % 60);
  console.log("開始から " + pastTimeMin + " 分 " + pastTimeSec + " 秒経過");
}