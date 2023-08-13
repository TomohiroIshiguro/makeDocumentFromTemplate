// テンプレートファイル情報を取得する
function getTemplates(ss) {
  console.log("getTemplates()");
  const files = ss
      .getSheetByName(SHEET_NAME_TEMPLATE)
      .getDataRange()
      .getValues();
  const array = [];
  files.forEach((item, index) => {
    if (index === 0) return; // 列ヘッダの行はスキップ
    if (!item[0]) return; // チェックなしの行はスキップ
    if (!item[1] || !item[2] || !item[3]) return; // 必須データなしの行はスキップ
    const file = {
      name: item[1],
      id: item[2],
      type: item[3],
      output: item[4],
    };
    array.push(file);
  });
  return array;
}