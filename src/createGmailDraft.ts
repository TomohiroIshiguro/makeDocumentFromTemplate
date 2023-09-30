function replaceEmailParameters(file, fileName, data, properties) {
  console.log("replaceEmailProperties()");
  const tempDocFile = DocumentApp.openById(file.getId());

  const body = tempDocFile.getBody();
  properties.forEach(property => {
    fileName = fileName.replace(`{${property}}`, data[property]);
    tempDocFile.setName(fileName);
    body.replaceText(`{${property}}`, data[property]);
  });
  return data.to;
}

function createEmailDraft(file, address) {
  console.log("createEmailDraft()");
  const tempDocFile = DocumentApp.openById(file.getId());

  const recipient = address;
  const subject = tempDocFile.getName();
  const body = tempDocFile.getBody();

  const draft = GmailApp.createDraft(recipient, subject, body.getText());
}
