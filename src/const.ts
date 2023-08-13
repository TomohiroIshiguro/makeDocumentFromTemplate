var propService = PropertiesService.getScriptProperties();

// マスタファイル
// ----------------------------------------
const MASTER_FILE_ID = propService.getProperty("MASTER_FILE_ID");

const SHEET_NAME_README = "READ ME";
const SHEET_NAME_TEMPLATE = "templates";
const SHEET_NAME_REPORT = "result";
const SHEET_NAME_CONFIG = "config";

// コンフィグ シート
// ----------------------------------------
const ROW_TABLE_HEADING = 1; // 
const ROW_DATA_BEGIN = 2;

const COLUMN_ROOT_DIR = 1; // ("A"列) 成果物を保存するフォルダのデフォルト値の列
const COLUMN_TABLE_COLUMN_HEADERS = 4; // ("D"列) ユーザー情報マスタの列情報の列

// テンプレートの資料種別の列
const DOC_TYPE_DOCUMENT = "docs"; 
const DOC_TYPE_EMAIL = "email";
