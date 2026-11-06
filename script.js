(function () {
  var N = QUOTES.length;

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var order = [];
  for (var i = 0; i < N; i++) order.push(i);
  var rnd = mulberry32(20261106); // zmień liczbę, by zmienić kolejność
  for (var k = N - 1; k > 0; k--) {
    var j = Math.floor(rnd() * (k + 1));
    var tmp = order[k]; order[k] = order[j]; order[j] = tmp;
  }

  function dayNumber(d) {
    return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  }

  var quoteEl = document.getElementById("quote");
  var authorEl = document.getElementById("author");
  var dateEl = document.getElementById("date");
  var countdownEl = document.getElementById("countdown");
  var shownDay = null;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function render(now) {
    var day = dayNumber(now);
    if (day === shownDay) return;
    shownDay = day;
    var q = QUOTES[order[((day % N) + N) % N]];
    quoteEl.textContent = q[0];
    authorEl.textContent = q[1];
    dateEl.textContent = now.toLocaleDateString("pl-PL", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
  }

  function tick() {
    var now = new Date();
    render(now);
    var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    var left = Math.max(0, Math.floor((next - now) / 1000));
    var h = Math.floor(left / 3600);
    var m = Math.floor((left % 3600) / 60);
    var s = left % 60;
    countdownEl.textContent = pad(h) + ":" + pad(m) + ":" + pad(s);
  }

  tick();
  setInterval(tick, 1000);
})();