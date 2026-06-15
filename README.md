# Date Enhance for Illustrator

<video src="screecapture.mov" autoplay loop muted playsinline width="100%"></video>

Date Enhance 是一個給活動海報、展演視覺、課程與場次資訊設計流程使用的 Adobe Illustrator CEP panel 外掛。

它的核心目標是讓設計師先在 Illustrator 裡把日期排版做好，再把「月」、「日」、「時間」、「星期」這些文字物件綁定成可更新欄位。之後只要透過外掛選擇日期時間，就能快速更新同一份文件中的活動日期，不需要反覆選取文字、手動輸入、確認格式。

目前狀態：MVP / 開發版。

## 功能特色

- 將已設計好的 Illustrator 文字物件綁定為日期欄位。
- 支援欄位：`月`、`日`、`時間`、`星期`。
- 支援同一份文件中建立多組日期，例如 `main`、`earlybird`、`tour-1`。
- 日期選擇與時間選擇分離，時間分鐘固定為 5 分鐘單位。
- 可自動依日期計算星期。
- 星期格式可切換：
  - 中文：`星期一` / `一`
  - 英文：`mon` / `monday`
- 可選擇月、日是否補 0，例如 `06` 或 `6`。
- 更新日期時只改文字內容，不改變原本的字型、大小、顏色、位置、旋轉與其他樣式。
- 「目前綁定」區塊可摺疊，方便把主要操作集中在 date picker 與套用按鈕。

## 安裝

### macOS 開發版安裝

1. 關閉 Illustrator。
2. 在專案根目錄執行：

```bash
bash scripts/install-dev-macos.sh
```

3. 重新啟動 Illustrator。
4. 從 Illustrator 選單開啟：

```text
Window > Extensions > Date Enhance
```

這個腳本會建立 CEP extension symlink，並開啟常見 CSXS 版本的 debug mode，讓未簽名的開發版外掛可以載入。

### 手動安裝

將整個專案資料夾複製或建立捷徑到 CEP extensions 目錄，資料夾名稱建議使用：

```text
com.dateenhance.illustrator
```

macOS：

```text
~/Library/Application Support/Adobe/CEP/extensions/com.dateenhance.illustrator
```

Windows：

```text
%AppData%\Adobe\CEP\extensions\com.dateenhance.illustrator
```

接著開啟 debug mode。

macOS Terminal：

```bash
defaults write com.adobe.CSXS.11 PlayerDebugMode 1
defaults write com.adobe.CSXS.12 PlayerDebugMode 1
defaults write com.adobe.CSXS.13 PlayerDebugMode 1
defaults write com.adobe.CSXS.14 PlayerDebugMode 1
```

Windows PowerShell：

```powershell
reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.11 /v PlayerDebugMode /t REG_SZ /d 1 /f
reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.12 /v PlayerDebugMode /t REG_SZ /d 1 /f
reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.13 /v PlayerDebugMode /t REG_SZ /d 1 /f
reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.14 /v PlayerDebugMode /t REG_SZ /d 1 /f
```

如果 Illustrator 版本較新但面板沒有出現，可以再補上該版本對應的 `CSXS.x` debug key。

## 基本使用流程

1. 在 Illustrator 文件中建立日期相關文字物件。
   例如分開建立「月」、「日」、「時間」、「星期」四個文字物件。
2. 先把每個文字物件的字型、大小、顏色、位置、旋轉、字距等樣式設計完成。
3. 開啟 `Window > Extensions > Date Enhance`。
4. 在「日期組」輸入名稱，例如 `main`，按 `＋` 新增。
5. 選取 Illustrator 裡的月份文字物件，按外掛的「月」。
6. 選取日期文字物件，按「日」。
7. 選取時間文字物件，按「時間」。
8. 選取星期文字物件，按「星期」。
9. 在日期時間區塊選擇活動日期、小時與分鐘。
10. 選擇星期語言與星期樣式。
11. 按「套用到文件」。

之後如果同一個活動要改期，只要重新打開面板、選擇日期組、調整日期時間，再按「套用到文件」即可。

## 多組日期

一份文件可以有多組日期設定。例如：

- `main`：主活動日期
- `earlybird`：早鳥截止日期
- `tour-1`：第一場巡演日期
- `tour-2`：第二場巡演日期

每個日期組都可以各自綁定一組「月」、「日」、「時間」、「星期」文字物件。切換日期組後套用，只會更新該日期組的綁定文字。

## 面板欄位與按鈕說明

### 重新整理

位於面板右上角的 `↻` 按鈕。

用途：

- 重新讀取目前 Illustrator 文件狀態。
- 更新目前選取的文字物件數量。
- 重新掃描文件中的已綁定日期文字。

### 日期組

用來選擇目前要操作哪一組日期。

下拉選單會顯示目前面板已知的日期組；如果文件中已存在綁定，重新整理或掃描後也會被加入列表。

### ＋

新增日期組。

先在輸入框輸入日期組名稱，例如 `main` 或 `tour-1`，再按 `＋`。日期組名稱建議使用英文、數字、底線或連字號。

### 日期時間

用來選擇要套用到文件的日期與時間。

- 日期使用日期選擇器。
- 小時為 `00` 到 `23`。
- 分鐘固定為 5 分鐘單位：`00`、`05`、`10`、`15`、`20`、`25`、`30`、`35`、`40`、`45`、`50`、`55`。

### 月份補 0

控制月份輸出是否補 0。

- 開啟：`06`
- 關閉：`6`

### 日期補 0

控制日期輸出是否補 0。

- 開啟：`09`
- 關閉：`9`

### 星期語言

控制星期輸出語言。

- `中文`
- `English`

### 星期樣式

控制星期輸出長短格式。

中文：

- `星期一`
- `一`

英文：

- `mon`
- `monday`

### 套用到文件

將目前日期時間套用到所選日期組的所有已綁定文字。

這個按鈕只會修改文字內容，不會更動文字物件的設計樣式。

### 綁定選取文字

先在 Illustrator 文件中選取一個文字物件，再按對應按鈕。

- `月`：將選取文字綁定為月份欄位。
- `日`：將選取文字綁定為日期欄位。
- `時間`：將選取文字綁定為時間欄位，格式為 `HH:mm`。
- `星期`：將選取文字綁定為星期欄位，內容由日期自動計算。

每次綁定請只選取一個文字物件。如果選到群組，外掛會嘗試從選取物件中找出文字框。

### 目前綁定

可摺疊區塊，用來查看目前日期組已綁定的欄位數量與內容。

收合時只顯示數量，例如 `4 個`。展開後會顯示目前日期組內的綁定清單。

### 掃描

重新掃描目前 Illustrator 文件中的已綁定文字物件。

使用情境：

- 剛開啟一份已經綁定過日期的文件。
- 手動複製、刪除或調整了文字物件。
- 面板顯示的綁定數量看起來不正確。
- 想確認目前日期組有哪些欄位已經綁定。

## 綁定資料儲存方式

目前外掛把綁定資訊存在 Illustrator 文字物件的 `name` 屬性中。

格式如下：

```text
DE__日期組__欄位
```

範例：

```text
DE__main__month
DE__main__day
DE__main__time
DE__main__weekday
```

這代表：

- 日期組：`main`
- 欄位：`month`、`day`、`time`、`weekday`

## 設計注意事項

- 請先完成文字樣式設計，再進行綁定。
- 套用日期只會改變文字內容，不會改變樣式。
- 已綁定文字可以移動、縮放、旋轉或調整樣式。
- 請不要把已綁定文字轉外框；轉外框後就不再是可更新文字。
- 如果手動修改文字物件的 `name`，可能會破壞綁定。
- 若複製已綁定文字物件，複製品可能保留相同綁定名稱；必要時請重新綁定或刪除不需要的複製品。

## 重新載入與開發注意事項

開發 CEP 外掛時，Illustrator 可能會快取面板內容。

- 修改 HTML/CSS/JS：通常關閉再重新打開面板即可，有時仍需重啟 Illustrator。
- 修改 `jsx/hostscript.jsx`：可能需要重新打開面板或重啟 Illustrator。
- 修改 `CSXS/manifest.xml`：通常需要重啟 Illustrator。
- 外掛沒有出現在選單：通常需要確認安裝路徑、debug mode，並重啟 Illustrator。

## 專案結構

```text
ILLU_DateEnhance/
├── CSXS/
│   └── manifest.xml
├── css/
│   └── styles.css
├── docs/
│   └── INSTALL.md
├── js/
│   ├── CSInterface.js
│   └── main.js
├── jsx/
│   └── hostscript.jsx
├── scripts/
│   └── install-dev-macos.sh
├── index.html
└── README.md
```

### 主要檔案

- `CSXS/manifest.xml`：Illustrator CEP extension manifest。
- `index.html`：面板 UI 結構。
- `css/styles.css`：面板視覺樣式。
- `js/CSInterface.js`：CEP `evalScript` 橋接。
- `js/main.js`：面板互動、日期時間選擇、綁定列表更新。
- `jsx/hostscript.jsx`：Illustrator ExtendScript 文件操作。
- `scripts/install-dev-macos.sh`：macOS 開發安裝腳本。

## 目前限制

- 目前是未簽名開發版外掛，需開啟 CEP debug mode。
- 尚未包成正式發佈用 `.zxp`。
- 日期格式目前固定為拆分欄位，不支援自訂完整日期字串。
- 時間格式目前固定為 24 小時制 `HH:mm`。
- 英文星期目前為小寫 `mon` / `monday`。
- 綁定管理目前只有新增與掃描，尚未提供取消綁定、重新命名日期組或跳到物件。

## 後續可擴充方向

- 新增欄位：年、月份英文、日期範圍、結束時間。
- 更多格式 presets：`JUN`、`June`、`7:30 PM`、`週一`、`MON`、`Monday`。
- 綁定管理：取消綁定、重新命名日期組、選取對應物件。
- 匯出與匯入日期組資料。
- 改用 Illustrator native Variables / Dataset 做更正式的變數資料流。
- 製作正式簽章與 `.zxp` 安裝包。
