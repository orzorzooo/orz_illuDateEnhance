(function () {
  function CSInterface() {}

  CSInterface.prototype.evalScript = function (script, callback) {
    if (window.__adobe_cep__ && window.__adobe_cep__.evalScript) {
      window.__adobe_cep__.evalScript(script, callback || function () {});
      return;
    }

    if (callback) {
      callback(
        JSON.stringify({
          ok: false,
          message: "這個面板需要在 Illustrator CEP 環境中執行。"
        })
      );
    }
  };

  window.CSInterface = CSInterface;
})();
