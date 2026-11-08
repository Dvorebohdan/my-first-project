/* BedHackr — спільний перемикач мови для всіх сторінок.
   Переклад робить Google Translate (потрібен інтернет на пристрої, що відкриває сайт).
   Вибрана мова зберігається і діє на всіх сторінках. */
(function () {
  var LANGS = [["uk","Українська"],["en","English"],["es","Español"],["fr","Français"],["de","Deutsch"],["it","Italiano"],["pt","Português"],["pt-br","Português (Brasil)"],["nl","Nederlands"],["pl","Polski"],["ro","Română"],["cs","Čeština"],["sk","Slovenčina"],["hu","Magyar"],["bg","Български"],["hr","Hrvatski"],["sr","Српски"],["sl","Slovenščina"],["lt","Lietuvių"],["lv","Latviešu"],["et","Eesti"],["fi","Suomi"],["sv","Svenska"],["no","Norsk"],["da","Dansk"],["is","Íslenska"],["el","Ελληνικά"],["tr","Türkçe"],["ru","Русский"],["be","Беларуская"],["ka","ქართული"],["hy","Հայերեն"],["az","Azərbaycan"],["kk","Қазақша"],["uz","Oʻzbek"],["ar","العربية"],["he","עברית"],["fa","فارسی"],["ur","اردو"],["hi","हिन्दी"],["bn","বাংলা"],["pa","ਪੰਜਾਬੀ"],["gu","ગુજરાતી"],["ta","தமிழ்"],["te","తెలుగు"],["kn","ಕನ್ನಡ"],["ml","മലയാളം"],["mr","मराठी"],["ne","नेपाली"],["si","සිංහල"],["th","ไทย"],["lo","ລາວ"],["km","ខ្មែរ"],["my","မြန်မာ"],["vi","Tiếng Việt"],["id","Bahasa Indonesia"],["ms","Bahasa Melayu"],["tl","Filipino"],["zh","中文（简体）"],["zh-tw","中文（繁體）"],["ja","日本語"],["ko","한국어"],["mn","Монгол"],["bo","བོད་སྐད"],["ps","پښتو"],["sw","Kiswahili"],["am","አማርኛ"],["so","Soomaali"],["ha","Hausa"],["yo","Yorùbá"],["ig","Igbo"],["zu","isiZulu"],["xh","isiXhosa"],["af","Afrikaans"],["mg","Malagasy"],["rw","Kinyarwanda"],["sn","chiShona"],["st","Sesotho"],["ny","Chichewa"],["om","Oromoo"],["ti","ትግርኛ"],["ga","Gaeilge"],["cy","Cymraeg"],["gd","Gàidhlig"],["mt","Malti"],["eu","Euskara"],["ca","Català"],["gl","Galego"],["lb","Lëtzebuergesch"],["fo","Føroyskt"],["mk","Македонски"],["sq","Shqip"],["bs","Bosanski"],["me","Crnogorski"],["cv","Чӑвашла"],["tt","Татарча"],["ba","Башҡортса"],["tg","Тоҷикӣ"],["ky","Кыргызча"],["tk","Türkmençe"],["mi","Māori"],["haw","ʻŌlelo Hawaiʻi"],["sm","Gagana Sāmoa"],["to","Lea Fakatonga"],["fj","Vosa Vakaviti"]];
  var MAP = { 'pt-br': 'pt', 'zh': 'zh-CN', 'zh-tw': 'zh-TW', 'he': 'iw', 'me': 'sr', 'fil': 'tl' };
  var KEY = 'bh_lang';
  var SRC = (document.documentElement.lang || 'uk').slice(0, 2).toLowerCase();

  function g(code) { return MAP[code] || code; }
  function nameOf(code) { for (var i = 0; i < LANGS.length; i++) if (LANGS[i][0] === code) return LANGS[i][1]; return code; }
  function getSaved() { try { return localStorage.getItem(KEY) || 'uk'; } catch (e) { return 'uk'; } }
  function save(c) { try { localStorage.setItem(KEY, c); } catch (e) {} }

  function cookieDomains() {
    var out = [''], h = location.hostname;
    if (h.indexOf('.') > -1 && !/^\d+\.\d+\.\d+\.\d+$/.test(h)) out.push('; domain=' + h);
    return out;
  }
  function setCookie(v) { cookieDomains().forEach(function (d) { document.cookie = 'googtrans=' + v + '; path=/' + d; }); }
  function clearCookie() {
    cookieDomains().forEach(function (d) {
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT' + d;
    });
  }

  function syncCookie(code) {
    if (g(code) === SRC) clearCookie(); else setCookie('/' + SRC + '/' + g(code));
  }

  function apply(code) {
    save(code);
    syncCookie(code);
    location.reload();
  }

  // ---- стилі: ховаємо інтерфейс Google ----
  var css = document.createElement('style');
  css.textContent =
    'iframe.skiptranslate,.goog-te-banner-frame{display:none!important}' +
    'body{top:0!important}' +
    '#goog-gt-tt,.goog-tooltip,.goog-te-balloon-frame{display:none!important}' +
    '.goog-text-highlight{background:none!important;box-shadow:none!important}' +
    '#bh_gt{position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden}';
  document.head.appendChild(css);

  // ---- запуск перекладу ----
  var saved = getSaved();
  if (g(saved) !== SRC) {
    syncCookie(saved);
    var box = document.createElement('div');
    box.id = 'bh_gt';
    document.body.appendChild(box);
    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement({ pageLanguage: SRC, autoDisplay: false }, 'bh_gt');
    };
    var sc = document.createElement('script');
    sc.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    sc.async = true;
    document.body.appendChild(sc);
  } else {
    clearCookie();
  }

  window.BHLang = { list: LANGS, current: saved, apply: apply, nameOf: nameOf };

  // ---- власний інтерфейс для сторінок, де немає вбудованого перемикача (programs, offer) ----
  function buildUi() {
    if (document.getElementById('langBtn')) return; // index.html має свій
    var st = document.createElement('style');
    st.textContent =
      '.bhl-btn{position:fixed;right:16px;bottom:20px;z-index:9998;display:flex;align-items:center;gap:8px;' +
      'font:500 13px/1 Inter,system-ui,sans-serif;color:#fff;background:rgba(0,0,0,.72);backdrop-filter:blur(12px);' +
      'border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:10px 16px;cursor:pointer}' +
      '.bhl-btn:hover{border-color:#323C4D;background:#323C4D}' +
      '@media(max-width:640px){.bhl-btn{top:84px;bottom:auto;right:12px;padding:8px 13px}}' +
      '.bhl-btn svg{width:15px;height:15px}' +
      '.bhl-ov{position:fixed;inset:0;z-index:9999;background:rgba(3,4,3,.65);backdrop-filter:blur(4px);display:none;align-items:center;justify-content:center;padding:24px}' +
      '.bhl-ov.open{display:flex}' +
      '.bhl-pn{width:100%;max-width:520px;max-height:80vh;display:flex;flex-direction:column;overflow:hidden;background:#0b0d0b;color:#eef1ec;' +
      'border:1px solid rgba(255,255,255,.12);border-radius:12px;box-shadow:0 40px 80px -20px rgba(0,0,0,.7);font-family:Inter,system-ui,sans-serif}' +
      '.bhl-hd{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.1);font-weight:700;font-size:15px}' +
      '.bhl-x{background:none;border:0;color:#aab1bd;font-size:18px;cursor:pointer}' +
      '.bhl-s{margin:12px 16px;padding:11px 14px;background:#10130f;border:1px solid rgba(255,255,255,.12);border-radius:8px;color:#fff;font-size:14px;outline:none}' +
      '.bhl-ls{overflow:auto;padding:0 8px 10px}' +
      '.bhl-it{display:flex;justify-content:space-between;padding:11px 14px;border-radius:8px;cursor:pointer;font-size:14.5px}' +
      '.bhl-it:hover{background:rgba(255,255,255,.07)}' +
      '.bhl-it.sel{background:#323C4D}' +
      '.bhl-it span:last-child{color:#7c877c;font-size:11px;text-transform:uppercase}';
    document.head.appendChild(st);

    var btn = document.createElement('button');
    btn.className = 'bhl-btn';
    btn.setAttribute('translate', 'no');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg><span></span>';
    btn.lastChild.textContent = nameOf(saved);

    var ov = document.createElement('div');
    ov.className = 'bhl-ov';
    ov.setAttribute('translate', 'no');
    ov.innerHTML = '<div class="bhl-pn"><div class="bhl-hd"><span>Language / Мова</span><button class="bhl-x">✕</button></div>' +
      '<input class="bhl-s" placeholder="Search language / Пошук мови...">' +
      '<div class="bhl-ls"></div></div>';
    var list = ov.querySelector('.bhl-ls'), search = ov.querySelector('.bhl-s');

    function render(q) {
      q = (q || '').trim().toLowerCase();
      list.innerHTML = '';
      LANGS.forEach(function (l) {
        if (q && l[1].toLowerCase().indexOf(q) < 0 && l[0].indexOf(q) < 0) return;
        var d = document.createElement('div');
        d.className = 'bhl-it' + (l[0] === saved ? ' sel' : '');
        d.innerHTML = '<span></span><span></span>';
        d.children[0].textContent = l[1]; d.children[1].textContent = l[0];
        d.onclick = function () { apply(l[0]); };
        list.appendChild(d);
      });
    }
    function open() { ov.classList.add('open'); search.value = ''; render(); setTimeout(function () { search.focus(); }, 50); }
    function close() { ov.classList.remove('open'); }
    btn.onclick = open;
    ov.querySelector('.bhl-x').onclick = close;
    ov.onclick = function (e) { if (e.target === ov) close(); };
    search.oninput = function () { render(search.value); };
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.body.appendChild(btn);
    document.body.appendChild(ov);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildUi); else buildUi();
})();
