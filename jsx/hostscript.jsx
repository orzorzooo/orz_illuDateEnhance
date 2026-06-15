var DateEnhance = (function () {
  var PREFIX = "DE__";
  var PART_LABELS = {
    month: "月",
    day: "日",
    time: "時間",
    weekday: "星期"
  };

  function jsonStringify(value) {
    if (value === null) return "null";
    if (typeof value === "string") {
      return '"' + value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n") + '"';
    }
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (value instanceof Array) {
      var arrayParts = [];
      for (var i = 0; i < value.length; i += 1) arrayParts.push(jsonStringify(value[i]));
      return "[" + arrayParts.join(",") + "]";
    }
    var objectParts = [];
    for (var key in value) {
      if (value.hasOwnProperty(key)) objectParts.push(jsonStringify(key) + ":" + jsonStringify(value[key]));
    }
    return "{" + objectParts.join(",") + "}";
  }

  function ok(data) {
    data.ok = true;
    return jsonStringify(data);
  }

  function fail(message) {
    return jsonStringify({ ok: false, message: message });
  }

  function hasDocument() {
    return app.documents.length > 0;
  }

  function isTextFrame(item) {
    return item && (item.typename === "TextFrame" || item.typename === "TextFrameItem");
  }

  function selectedTextFrames() {
    var frames = [];
    if (!hasDocument()) return frames;
    var selection = app.activeDocument.selection;
    for (var i = 0; i < selection.length; i += 1) {
      collectTextFrames(selection[i], frames);
    }
    return frames;
  }

  function collectTextFrames(item, frames) {
    if (!item) return;
    if (isTextFrame(item)) {
      frames.push(item);
      return;
    }
    if (item.pageItems) {
      for (var i = 0; i < item.pageItems.length; i += 1) collectTextFrames(item.pageItems[i], frames);
    }
    if (item.textFrames) {
      for (var j = 0; j < item.textFrames.length; j += 1) collectTextFrames(item.textFrames[j], frames);
    }
  }

  function parseBindingName(name) {
    if (!name || name.indexOf(PREFIX) !== 0) return null;
    var parts = name.split("__");
    if (parts.length !== 3) return null;
    if (!PART_LABELS[parts[2]]) return null;
    return {
      eventId: parts[1],
      part: parts[2],
      partLabel: PART_LABELS[parts[2]]
    };
  }

  function bindingName(eventId, part) {
    return PREFIX + eventId + "__" + part;
  }

  function scanBindings() {
    var bindings = [];
    if (!hasDocument()) return bindings;

    var frames = app.activeDocument.textFrames;
    for (var i = 0; i < frames.length; i += 1) {
      var parsed = parseBindingName(frames[i].name);
      if (parsed) {
        parsed.contents = frames[i].contents;
        bindings.push(parsed);
      }
    }
    return bindings;
  }

  function pad2(value) {
    value = Number(value);
    return value < 10 ? "0" + value : String(value);
  }

  function weekdayIndex(year, month, day) {
    return new Date(Number(year), Number(month) - 1, Number(day)).getDay();
  }

  function formatWeekday(year, month, day, language, style) {
    var index = weekdayIndex(year, month, day);
    var zhShort = ["日", "一", "二", "三", "四", "五", "六"];
    var enShort = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    var enLong = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    if (language === "en") {
      return style === "long" ? enLong[index] : enShort[index];
    }

    return style === "short" ? zhShort[index] : "星期" + zhShort[index];
  }

  function formatPart(part, year, month, day, hour, minute, padMonth, padDay, weekdayLanguage, weekdayStyle) {
    if (part === "month") return padMonth ? pad2(month) : String(Number(month));
    if (part === "day") return padDay ? pad2(day) : String(Number(day));
    if (part === "time") return pad2(hour) + ":" + pad2(minute);
    if (part === "weekday") return formatWeekday(year, month, day, weekdayLanguage, weekdayStyle);
    return "";
  }

  return {
    status: function () {
      if (!hasDocument()) return fail("請先開啟 Illustrator 文件。");
      return ok({
        message: "已連接：" + app.activeDocument.name,
        selectionCount: selectedTextFrames().length,
        bindings: scanBindings()
      });
    },

    bindSelected: function (eventId, part) {
      if (!hasDocument()) return fail("請先開啟 Illustrator 文件。");
      if (!eventId) return fail("請先建立或選擇日期組。");
      if (!PART_LABELS[part]) return fail("未知的日期欄位。");

      var frames = selectedTextFrames();
      if (frames.length !== 1) return fail("請只選取一個文字物件，再綁定「" + PART_LABELS[part] + "」。");

      frames[0].name = bindingName(eventId, part);
      return ok({ message: "已將選取文字綁定為「" + eventId + " / " + PART_LABELS[part] + "」。" });
    },

    applyDate: function (eventId, year, month, day, hour, minute, padMonth, padDay, weekdayLanguage, weekdayStyle) {
      if (!hasDocument()) return fail("請先開啟 Illustrator 文件。");
      if (!eventId) return fail("請先選擇日期組。");

      var updated = 0;
      var frames = app.activeDocument.textFrames;
      for (var i = 0; i < frames.length; i += 1) {
        var parsed = parseBindingName(frames[i].name);
        if (parsed && parsed.eventId === eventId) {
          frames[i].contents = formatPart(
            parsed.part,
            year,
            month,
            day,
            hour,
            minute,
            padMonth,
            padDay,
            weekdayLanguage,
            weekdayStyle
          );
          updated += 1;
        }
      }

      if (!updated) return fail("找不到「" + eventId + "」的已綁定文字。");
      app.redraw();
      return ok({ message: "已更新 " + updated + " 個日期文字。" });
    }
  };
})();
