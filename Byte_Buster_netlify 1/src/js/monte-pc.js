/* ==========================================================
   BYTE BUSTER — monte-pc.js  (só na página Monte seu PC)
   Ao clicar em "Montar para este uso" num perfil, o campo
   "Uso principal do PC" do formulário já fica selecionado
   e o cursor vai para o campo Nome.
   ========================================================== */
(function () {
  "use strict";

  var select = document.getElementById("assunto");
  var nome = document.getElementById("nome");
  if (!select) return;

  document.querySelectorAll("[data-perfil]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      select.value = botao.getAttribute("data-perfil");

      // espera a rolagem suave chegar no formulário e coloca o foco no nome
      setTimeout(function () {
        if (nome) nome.focus({ preventScroll: true });
      }, 500);
    });
  });
})();
