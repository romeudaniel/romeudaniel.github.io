/* =========================================================
   ROMEU DANIEL — MAIN.JS
   Funções gerais do site
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  
  /* =====================================================
     1. MENU MOBILE
     ===================================================== */
  
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-navigation");
  
  if (menuToggle && navigation) {
    
    menuToggle.addEventListener("click", () => {
      
      const isOpen = navigation.classList.toggle("menu-open");
      
      menuToggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );
      
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
      );
      
    });
    
    
    /* =================================================
       FECHAR MENU AO CLICAR NUM LINK
    ================================================== */
    
    const navigationLinks =
      navigation.querySelectorAll("a");
    
    navigationLinks.forEach((link) => {
      
      link.addEventListener("click", () => {
        
        navigation.classList.remove("menu-open");
        
        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );
        
        menuToggle.setAttribute(
          "aria-label",
          "Abrir menu"
        );
        
      });
      
    });
    
    
    /* =================================================
       FECHAR MENU AO CLICAR FORA
    ================================================== */
    
    document.addEventListener("click", (event) => {
      
      const clickedInsideMenu =
        navigation.contains(event.target);
      
      const clickedToggle =
        menuToggle.contains(event.target);
      
      if (
        !clickedInsideMenu &&
        !clickedToggle &&
        navigation.classList.contains("menu-open")
      ) {
        
        navigation.classList.remove("menu-open");
        
        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );
        
        menuToggle.setAttribute(
          "aria-label",
          "Abrir menu"
        );
        
      }
      
    });
    
  }
  
  
  /* =====================================================
     2. ANO AUTOMÁTICO
     ===================================================== */
  
  const currentYear = new Date().getFullYear();
  
  const yearElements =
    document.querySelectorAll("[data-current-year]");
  
  yearElements.forEach((element) => {
    
    element.textContent = currentYear;
    
  });
  
  
  /* =====================================================
     3. FECHAR MENU AO AUMENTAR A TELA
     ===================================================== */
  
  window.addEventListener("resize", () => {
    
    if (
      window.innerWidth > 767 &&
      navigation &&
      menuToggle
    ) {
      
      navigation.classList.remove("menu-open");
      
      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );
      
      menuToggle.setAttribute(
        "aria-label",
        "Abrir menu"
      );
      
    }
    
  });
  
  
  /* =====================================================
     4. LOG
     ===================================================== */
  
  console.log(
    "Romeu Daniel — Site carregado com sucesso."
  );
  
});