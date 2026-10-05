/* ==========================================================
   BYTE BUSTER — main.js
   Usado em todas as páginas:
   1. menu mobile (hambúrguer) e submenu de Serviços
   2. formulário que envia a mensagem para o WhatsApp
   3. ano do rodapé
   4. widget VLibras (tradução para Libras)
   ========================================================== */

(function () {
  "use strict";

  /* Número do WhatsApp (DDI + DDD + número, só dígitos) */
  var WHATSAPP = "5511920110136";

  var MOBILE_BREAKPOINT = 900; // igual ao @media do base.css

  /* ---------------- 1. MENU MOBILE ---------------- */
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("siteNav");

  if (toggle && nav) {
    var setMenu = function (open) {
      nav.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };

    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("open"));
    });

    // Fecha ao clicar num link (exceto o botão do submenu)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });

    // Fecha com Esc e devolve o foco ao botão
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (nav.classList.contains("open")) {
        setMenu(false);
        toggle.focus();
      }
      document.querySelectorAll(".dropdown.open").forEach(function (d) {
        d.classList.remove("open");
        d.querySelector(".dd-toggle").setAttribute("aria-expanded", "false");
      });
    });

    // Voltou para desktop com o menu aberto: reseta
    window.addEventListener("resize", function () {
      if (window.innerWidth > MOBILE_BREAKPOINT && nav.classList.contains("open")) {
        setMenu(false);
      }
    });
  }

  // Submenu "Serviços": abre/fecha pelo botão (toque e teclado)
  document.querySelectorAll(".dropdown").forEach(function (dropdown) {
    var btn = dropdown.querySelector(".dd-toggle");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = dropdown.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // Clique fora fecha o submenu
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".dropdown.open").forEach(function (d) {
      if (!d.contains(e.target)) {
        d.classList.remove("open");
        d.querySelector(".dd-toggle").setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ---------------- 2. FORMULÁRIO -> WHATSAPP ----------------
     O site é estático (sem servidor), então em vez de "enviar"
     o formulário abre o WhatsApp já com a mensagem escrita.
     Campos lidos pelo name: nome, assunto, orcamento, mensagem. */
  document.querySelectorAll("form[data-whatsapp]").forEach(function (form) {
    var status = form.querySelector(".form-status");

    function say(text, type) {
      if (!status) return;
      status.textContent = text;
      if (type) status.dataset.type = type; else delete status.dataset.type;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var data = new FormData(form);
      var get = function (k) { return String(data.get(k) || "").trim(); };

      var nome = get("nome");
      var mensagem = get("mensagem");

      if (!nome || !mensagem) {
        say("Preencha seu nome e descreva o que você precisa.", "error");
        (nome ? form.elements.mensagem : form.elements.nome).focus();
        return;
      }

      var linhas = ["Olá, Byte Buster! Meu nome é " + nome + "."];
      if (get("assunto")) linhas.push("Assunto: " + get("assunto") + ".");
      if (get("orcamento")) linhas.push("Orçamento previsto: " + get("orcamento") + ".");
      linhas.push(mensagem);

      var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(linhas.join("\n"));

      say("Abrindo o WhatsApp com a sua mensagem…");
      var link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  });

  /* ---------------- 3. ANO DO RODAPÉ ---------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------- 4. VLIBRAS ----------------
     Carrega o widget do governo depois que a página terminou de
     carregar, para não atrasar o site. */
  window.addEventListener("load", function () {
    if (!document.querySelector("[vw]")) return;

    var s = document.createElement("script");
    s.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    s.onload = function () {
      if (window.VLibras) new window.VLibras.Widget("https://vlibras.gov.br/app");
    };
    document.body.appendChild(s);
  });
})();
