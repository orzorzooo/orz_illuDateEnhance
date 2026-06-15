(function () {
  var cs = new CSInterface();
  var state = {
    events: ["main"],
    activeEvent: "main",
    bindings: []
  };

  var els = {
    docStatus: document.getElementById("docStatus"),
    refreshBtn: document.getElementById("refreshBtn"),
    eventSelect: document.getElementById("eventSelect"),
    addEventBtn: document.getElementById("addEventBtn"),
    eventNameInput: document.getElementById("eventNameInput"),
    dateInput: document.getElementById("dateInput"),
    hourSelect: document.getElementById("hourSelect"),
    minuteSelect: document.getElementById("minuteSelect"),
    padMonthInput: document.getElementById("padMonthInput"),
    padDayInput: document.getElementById("padDayInput"),
    weekdayLanguageSelect: document.getElementById("weekdayLanguageSelect"),
    weekdayStyleSelect: document.getElementById("weekdayStyleSelect"),
    selectionStatus: document.getElementById("selectionStatus"),
    bindingCount: document.getElementById("bindingCount"),
    bindingList: document.getElementById("bindingList"),
    scanBtn: document.getElementById("scanBtn"),
    applyBtn: document.getElementById("applyBtn")
  };

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function formatDateLocal(value) {
    return value.getFullYear() + "-" + pad2(value.getMonth() + 1) + "-" + pad2(value.getDate());
  }

  function roundToFiveMinutes(value) {
    var rounded = new Date(value.getTime());
    rounded.setSeconds(0, 0);
    rounded.setMinutes(Math.round(rounded.getMinutes() / 5) * 5);
    return rounded;
  }

  function renderTimeOptions() {
    var hour;
    var minute;

    els.hourSelect.innerHTML = "";
    for (hour = 0; hour < 24; hour += 1) {
      var hourOption = document.createElement("option");
      hourOption.value = String(hour);
      hourOption.textContent = pad2(hour);
      els.hourSelect.appendChild(hourOption);
    }

    els.minuteSelect.innerHTML = "";
    for (minute = 0; minute < 60; minute += 5) {
      var minuteOption = document.createElement("option");
      minuteOption.value = String(minute);
      minuteOption.textContent = pad2(minute);
      els.minuteSelect.appendChild(minuteOption);
    }
  }

  function setDefaultDate() {
    var value = roundToFiveMinutes(new Date());
    els.dateInput.value = formatDateLocal(value);
    els.hourSelect.value = String(value.getHours());
    els.minuteSelect.value = String(value.getMinutes());
  }

  function getSelectedDateTime() {
    if (!els.dateInput.value) return null;

    var parts = els.dateInput.value.split("-");
    return new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2]),
      Number(els.hourSelect.value),
      Number(els.minuteSelect.value),
      0,
      0
    );
  }

  function renderWeekdayStyles() {
    var language = els.weekdayLanguageSelect.value;
    var options =
      language === "en"
        ? [
            { value: "short", label: "mon" },
            { value: "long", label: "monday" }
          ]
        : [
            { value: "long", label: "星期一" },
            { value: "short", label: "一" }
          ];

    els.weekdayStyleSelect.innerHTML = "";
    options.forEach(function (item) {
      var option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      els.weekdayStyleSelect.appendChild(option);
    });
  }

  function esc(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  }

  function runHost(method, args, callback) {
    var list = args || [];
    var script =
      "DateEnhance." +
      method +
      "(" +
      list
        .map(function (arg) {
          if (typeof arg === "number" || typeof arg === "boolean") return String(arg);
          return "'" + esc(arg) + "'";
        })
        .join(",") +
      ")";

    cs.evalScript(script, function (raw) {
      var result;
      try {
        result = JSON.parse(raw);
      } catch (error) {
        result = { ok: false, message: raw || error.message };
      }

      if (!result.ok) {
        setStatus(result.message || "Illustrator 執行失敗", true);
      }

      if (callback) callback(result);
    });
  }

  function setStatus(message, isError) {
    els.docStatus.textContent = message;
    els.docStatus.className = isError ? "error" : "toast";
  }

  function normalizeEventName(value) {
    return String(value || "")
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function renderEvents() {
    els.eventSelect.innerHTML = "";
    state.events.forEach(function (eventId) {
      var option = document.createElement("option");
      option.value = eventId;
      option.textContent = eventId;
      els.eventSelect.appendChild(option);
    });
    els.eventSelect.value = state.activeEvent;
  }

  function renderBindings() {
    var relevant = state.bindings.filter(function (binding) {
      return binding.eventId === state.activeEvent;
    });
    els.bindingCount.textContent = relevant.length + " 個";

    if (!relevant.length) {
      els.bindingList.innerHTML = '<div class="empty">這個日期組尚未綁定文字。</div>';
      return;
    }

    els.bindingList.innerHTML = "";
    relevant.forEach(function (binding) {
      var row = document.createElement("div");
      row.className = "binding-row";
      row.innerHTML =
        "<strong>" +
        binding.partLabel +
        '</strong><span class="meta">' +
        binding.contents +
        "</span>";
      els.bindingList.appendChild(row);
    });
  }

  function hydrateFromBindings(bindings) {
    state.bindings = bindings || [];
    state.bindings.forEach(function (binding) {
      if (state.events.indexOf(binding.eventId) === -1) {
        state.events.push(binding.eventId);
      }
    });
    renderEvents();
    renderBindings();
  }

  function refresh() {
    runHost("status", [], function (result) {
      if (!result.ok) return;
      setStatus(result.message, false);
      els.selectionStatus.textContent = result.selectionCount + " 個文字物件";
      hydrateFromBindings(result.bindings);
    });
  }

  function addEvent() {
    var eventId = normalizeEventName(els.eventNameInput.value);
    if (!eventId) {
      setStatus("請輸入日期組名稱", true);
      return;
    }
    if (state.events.indexOf(eventId) === -1) {
      state.events.push(eventId);
    }
    state.activeEvent = eventId;
    els.eventNameInput.value = "";
    renderEvents();
    renderBindings();
  }

  function bindSelected(part) {
    runHost("bindSelected", [state.activeEvent, part], function (result) {
      if (!result.ok) return;
      setStatus(result.message, false);
      refresh();
    });
  }

  function applyDate() {
    var value = getSelectedDateTime();
    if (!value) {
      setStatus("請先選擇日期時間", true);
      return;
    }

    runHost(
      "applyDate",
      [
        state.activeEvent,
        value.getFullYear(),
        value.getMonth() + 1,
        value.getDate(),
        value.getHours(),
        value.getMinutes(),
        els.padMonthInput.checked,
        els.padDayInput.checked,
        els.weekdayLanguageSelect.value,
        els.weekdayStyleSelect.value
      ],
      function (result) {
        if (!result.ok) return;
        setStatus(result.message, false);
        refresh();
      }
    );
  }

  els.refreshBtn.addEventListener("click", refresh);
  els.scanBtn.addEventListener("click", refresh);
  els.addEventBtn.addEventListener("click", addEvent);
  els.eventSelect.addEventListener("change", function () {
    state.activeEvent = els.eventSelect.value;
    renderBindings();
  });
  els.applyBtn.addEventListener("click", applyDate);
  els.weekdayLanguageSelect.addEventListener("change", renderWeekdayStyles);

  Array.prototype.forEach.call(document.querySelectorAll("[data-bind-part]"), function (button) {
    button.addEventListener("click", function () {
      bindSelected(button.getAttribute("data-bind-part"));
    });
  });

  renderTimeOptions();
  setDefaultDate();
  renderWeekdayStyles();
  renderEvents();
  refresh();
})();
