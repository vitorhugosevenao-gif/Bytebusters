/* ==========================================================
   BYTE BUSTER — intro.js  (só na Home)
   Tela "Toque para entrar" + loading.

   - Aparece só na PRIMEIRA visita. Depois fica escondida.
   - Para ver de novo: abra  index.html?intro
   - Tem botão "Pular" e o som é opcional (só toca após o clique).
   - A decisão de mostrar ou não é tomada no <head> do index.html
     (classe "intro-pending" na tag <html>), antes da página
     aparecer, para não piscar.
   ========================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var intro = document.getElementById("intro");
  if (!intro || !root.classList.contains("intro-pending")) return;

  var startBtn = document.getElementById("introStart");
  var skipBtn = document.getElementById("introSkip");
  var hud = document.getElementById("introHud");
  var bar = document.getElementById("introBar");
  var percent = document.getElementById("introPercent");
  var sound = document.getElementById("introSound");

  var timer = null;
  var finished = false;

  function finish() {
    if (finished) return;
    finished = true;

    clearInterval(timer);
    if (sound) sound.pause();

    try { localStorage.setItem("bb-intro-seen", "1"); } catch (e) {}

    root.classList.remove("intro-pending");
    var main = document.getElementById("conteudo");
    if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
  }

  function runLoading() {
    startBtn.hidden = true;
    hud.hidden = false;

    if (sound) {
      sound.volume = 0.35;
      sound.currentTime = 0;
      sound.play().catch(function () {}); // navegador pode bloquear: sem problema
    }

    var progress = 0;
    timer = setInterval(function () {
      progress = Math.min(100, progress + Math.floor(Math.random() * 8) + 4);
      bar.style.width = progress + "%";
      percent.textContent = progress + "%";
      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(finish, 350);
      }
    }, 110);
  }

  startBtn.addEventListener("click", runLoading);
  skipBtn.addEventListener("click", finish);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") finish();
  });

  startBtn.focus();
})();
