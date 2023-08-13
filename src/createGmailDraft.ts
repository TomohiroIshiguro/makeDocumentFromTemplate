function createEmailDraft(fileId, fileName, user, properties, outputDir) {
  console.log("createEmailDraft()");

  // 成果物を保存するフォルダ
  let destFolder = DriveApp.getFolderById(outputDir);
  if (!destFolder) return;

  // テンプレートファイル
  const templateFile = DriveApp.getFileById(fileId);
  if (!templateFile) return;

  // ファイルを複製する
  const document = templateFile.makeCopy(destFolder);
  fileName = fileName
      .replace("name", user.name);

  const tempDocFile = DocumentApp.openById(document.getId());
  tempDocFile.setName(fileName);

  const body = tempDocFile.getBody();
  properties.forEach(property => {
    body.replaceText(`{${property}}`, user[property]);
  });

  const recipient = user.to;
  const subject = fileName;
  
  const draft = GmailApp.createDraft(recipient, subject, body.getText());
}
