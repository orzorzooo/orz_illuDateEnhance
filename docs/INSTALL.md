# Date Enhance 安裝與使用

## 可行性

這個外掛用 Illustrator CEP panel 製作。面板本身是 HTML/CSS/JavaScript，透過 ExtendScript 操控 Illustrator 文件內的文字物件。

第一版支援：

- 把已排好樣式的文字物件分別綁定成「月」、「日」、「時間」、「星期」。
- 用面板內的日期時間選擇器更新指定日期組。
- 自動依日期計算星期，並可切換中文 `星期一` / `一` 或英文 `mon` / `monday`。
- 同一份文件可建立多個日期組，例如 `main`、`earlybird`、`tour-1`。
- 後續改日期時不必重新選取文字，只要選日期組並按「套用到文件」。

## 安裝到 Illustrator

1. 關閉 Illustrator。
2. macOS 開發版可直接執行：
   `bash scripts/install-dev-macos.sh`
3. 或手動將整個 `ILLU_DateEnhance` 資料夾複製或建立捷徑到 CEP extensions 目錄：
   - macOS：`~/Library/Application Support/Adobe/CEP/extensions/com.dateenhance.illustrator`
   - Windows：`%AppData%\Adobe\CEP\extensions\com.dateenhance.illustrator`
4. 開啟 debug mode，讓未簽名的開發版外掛可以載入。
   - macOS Terminal：
     `defaults write com.adobe.CSXS.11 PlayerDebugMode 1`
     `defaults write com.adobe.CSXS.12 PlayerDebugMode 1`
   - Windows PowerShell：
     `reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.11 /v PlayerDebugMode /t REG_SZ /d 1 /f`
     `reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.12 /v PlayerDebugMode /t REG_SZ /d 1 /f`
5. 重新啟動 Illustrator。
6. 在 Illustrator 選單開啟：`Window > Extensions > Date Enhance`。

如果你的 Illustrator 版本很新但沒有顯示外掛，可以再補開 `CSXS.13`、`CSXS.14` 或目前版本對應的 debug key。

## 使用流程

1. 在海報上分別建立並設計文字物件：月、日、時間，也可以另外建立星期。
2. 開啟 `Date Enhance` 面板。
3. 在「日期組」輸入名稱，例如 `main`，按 `＋`。
4. 選取月份文字物件，按「月」。
5. 選取日期文字物件，按「日」。
6. 選取時間文字物件，按「時間」。
7. 如需星期，選取星期文字物件，按「星期」。
8. 用日期時間欄位選擇活動時間，並選擇星期語言與樣式。
9. 按「套用到文件」。

之後你只要重新開面板、選日期組、改日期時間、按套用即可。

## 設計注意事項

- 綁定資料目前存放在文字物件的 `name`，格式為 `DE__日期組__欄位`。
- 套用日期只會改文字內容，不會改字型、大小、位置、顏色、旋轉或其他設計樣式。
- 請不要把已綁定的文字轉外框；轉外框後就不再是可更新文字。
