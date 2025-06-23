// js/hub-global.js
document.addEventListener('DOMContentLoaded', () => {
    //console.log("SekaiHub: DOMContentLoaded. Iniciando script v4 (rutas de componentes mejoradas).");

    // --- Datos de Novelas para el Buscador ---
    // Modifica esto con tus datos reales.
    // Para enlaces a OTROS SITIOS WEB o a la versión EN VIVO de tus otras páginas de GitHub, usa la URL COMPLETA.
    // Para enlaces INTERNOS a este mismo sitio HUBPRI, usa la ruta relativa desde la raíz de HUBPRI.
    const novelsData = [
        { 
            title: "Ore wa Seikan Kokka no Akutoku Ryōshu! ", 
            author: "Yomu Mishima",
            // Ejemplo de URL completa (podría ser a otro de tus repositorios/sitios)
            presentationPage: "https://rtber.github.io/HUBPRI/novelas/Ore%20wa%20Seikan%20Kokka%20no%20Akutoku%20Ry%C5%8Dshu!.html", // ¡SUSTITUYE POR LA URL REAL!
        },
        { 
            title: "Overlord ", 
            author: "Kugane Maruyama",
            // Ejemplo de ruta local dentro de HUBPRI
            presentationPage: "https://rtber.github.io/HUBPRI/novelas/Overlord.html", 
        },
        { 
            title: "Kage no Jitsuryokusha ni Naritakute!", 
            author: "Aizawa Daisuke",
            // Ejemplo de URL completa a un sitio oficial
            presentationPage: "https://rtber.github.io/HUBPRI/novelas/Kage%20no%20Jitsuryokusha%20ni%20Naritakute!.html", 
        },
        { 
            title: "Classroom of The Elite", 
            author: "Kinugasa Shougo",
            presentationPage: "https://rtber.github.io/HUBPRI/novelas/Classroom%20of%20The%20Elite.html", // Ruta desde la raíz del hub
        }
    ];

    // Función para determinar la ruta base del sitio
        function getSiteBasePath() {
            // ¡¡¡ASEGÚRATE DE QUE ESTE VALOR SEA EL NOMBRE EXACTO DE TU REPOSITORIO EN GITHUB!!!
            const repoName = 'OREAK-V9';            // <--- VERIFICA Y CAMBIA ESTO SI ES NECESARIO
            const hostname = window.location.hostname;
            const pathname = window.location.pathname;
            let basePath = "";
        
           // console.log(`[getSiteBasePath] Original Pathname: ${pathname}`);
        
            if (hostname.endsWith('github.io')) {
                // Para GitHub Pages, el path suele ser /repoName/ o /repoName/index.html, etc.
                // Filtramos para quitar segmentos vacíos que pueden surgir de barras iniciales/finales
                const pathSegments = pathname.split('/').filter(segment => segment.length > 0);
              //  console.log(`[getSiteBasePath] Path Segments:`, pathSegments);
             //   console.log(`[getSiteBasePath] Comparando con repoName.toLowerCase(): ${repoName.toLowerCase()}`);
        
                if (pathSegments.length > 0 && pathSegments[0].toLowerCase() === repoName.toLowerCase()) {
                    basePath = `/${pathSegments[0]}`; 
              //      console.log(`[getSiteBasePath] GitHub Pages: repoName encontrado, basePath es: ${basePath}`);
                } else {
              //      console.log(`[getSiteBasePath] GitHub Pages: repoName NO encontrado como primer segmento o pathSegments vacío. basePath sigue siendo: "${basePath}"`);
                    // Esto podría suceder si el sitio es un sitio de usuario (rtber.github.io) y el repoName no es parte del path
                    // O si el repoName está mal escrito.
                }
            } else { 
                // Servidor Local
                const pathSegments = pathname.split('/').filter(segment => segment.length > 0);
           //     console.log(`[getSiteBasePath] Local Server Path Segments:`, pathSegments);
                if (pathSegments.length > 0 && pathSegments[0].toLowerCase() === repoName.toLowerCase()) {
                     basePath = `/${pathSegments[0]}`; // Si la URL local incluye el nombre del repo
           //          console.log(`[getSiteBasePath] Local Server: repoName encontrado, basePath es: ${basePath}`);
                } else {
          //          console.log(`[getSiteBasePath] Local Server: repoName NO encontrado o servido desde raíz. basePath sigue siendo: "${basePath}"`);
                }
            }
            return basePath;
        }
        const SITE_BASE_PATH = getSiteBasePath(); // Esto debe estar después de la definición de la función
      //  console.log(`SekaiHub: SITE_BASE_PATH final deducido: "${SITE_BASE_PATH}"`); // Log final
        
            async function loadComponent(componentFile, placeholderId) {
                // Los componentes siempre están en la raíz del proyecto del hub.
                const fetchUrl = `${SITE_BASE_PATH}/${componentFile}`; 
        
           //     console.log(`SekaiHub: [loadComponent] Página actual: ${window.location.pathname}`);
            //    console.log(`SekaiHub: [loadComponent] Intentando fetch de: ${fetchUrl} para placeholder: ${placeholderId}`);
        
                try {
                    const response = await fetch(fetchUrl);
                    const responseStatus = response.status;
                    const responseOk = response.ok;
                    const fullAttemptedUrl = new URL(fetchUrl, window.location.origin).href; 
        
                  //  console.log(`SekaiHub: [loadComponent] Fetch para ${componentFile} (URL intentada: ${fullAttemptedUrl}) - Status: ${responseStatus}, OK: ${responseOk}`);
        
                    if (!responseOk) {
                        throw new Error(`No se pudo cargar ${componentFile} desde ${fullAttemptedUrl} (Status: ${responseStatus})`);
                    }
                    const html = await response.text();
                    const placeholder = document.getElementById(placeholderId);
                    if (placeholder) {
                        placeholder.outerHTML = html; 
                     //   console.log(`SekaiHub: [loadComponent] Componente '${placeholderId}' cargado DESDE ${fullAttemptedUrl}`);
                    } else {
                        console.warn(`SekaiHub: [loadComponent] Placeholder '${placeholderId}' NO ENCONTRADO.`);
                    }
                } catch (error) {
                 //   console.error(`SekaiHub: [loadComponent] Catch - Error cargando componente '${componentFile}':`, error);
                    const placeholder = document.getElementById(placeholderId);
                    if (placeholder) {
                        placeholder.innerHTML = `<div class="component-error-message" style="color:red; text-align:center; padding:1em; border:1px dashed red; background: #fff0f0;">Error al cargar sección: ${componentFile}.<br>Verifique consola (F12) y ruta: ${fetchUrl}</div>`;
                    }
                }
            }

    async function loadLayoutAndInitialize() {
        //console.log("SekaiHub: Cargando layout (header y footer)...");
        await Promise.all([
            // <-- NOMBRES DE ARCHIVOS CORREGIDOS -->
            loadComponent('component_header.html', 'header-placeholder'),
            loadComponent('component_footer.html', 'footer-placeholder')
        ]);
        // Pequeña demora para asegurar que el DOM se actualice después de outerHTML
        await new Promise(resolve => setTimeout(resolve, 0)); 
        initializeHubFunctionality();
    }

    function initializeHubFunctionality() {
      //  console.log("SekaiHub: initializeHubFunctionality() - Iniciando.");

        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

        const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        const mobileNavMenuEl = document.getElementById('mobileNavMenuEl'); 
        const iconMenu = mobileNavToggle ? mobileNavToggle.querySelector('.icon-menu') : null;
        const iconClose = mobileNavToggle ? mobileNavToggle.querySelector('.icon-close') : null;
        const novelasDropdownToggleMobile = document.getElementById('novelasDropdownToggleMobile');
        const novelasDropdownMenuMobile = document.getElementById('novelasDropdownMenuMobile');

        if (mobileNavToggle && mobileNavMenuEl && iconMenu && iconClose) {
            if(iconMenu) iconMenu.style.display = 'block'; 
            if(iconClose) iconClose.style.display = 'none';  
            mobileNavToggle.addEventListener('click', () => {
                const isExpanded = mobileNavMenuEl.classList.toggle('active');
                mobileNavToggle.setAttribute('aria-expanded', isExpanded.toString());
                mobileNavToggle.classList.toggle('active'); 
                if (iconMenu) iconMenu.style.display = isExpanded ? 'none' : 'block';
                if (iconClose) iconClose.style.display = isExpanded ? 'block' : 'none';
                if (!isExpanded) {
                    if (novelasDropdownMenuMobile) novelasDropdownMenuMobile.classList.remove('submenu-active');
                    if (novelasDropdownToggleMobile) {
                        novelasDropdownToggleMobile.setAttribute('aria-expanded', 'false');
                        const arrow = novelasDropdownToggleMobile.querySelector('.dropdown-arrow-mobile');
                        if (arrow) arrow.style.transform = 'rotate(0deg)';
                    }
                }
            });
        }

        if (novelasDropdownToggleMobile && novelasDropdownMenuMobile) {
            novelasDropdownToggleMobile.addEventListener('click', (e) => {
                e.preventDefault(); 
                const isSubmenuExpanded = novelasDropdownMenuMobile.classList.toggle('submenu-active');
                novelasDropdownToggleMobile.setAttribute('aria-expanded', isSubmenuExpanded.toString());
                const arrow = novelasDropdownToggleMobile.querySelector('.dropdown-arrow-mobile');
                if(arrow) arrow.style.transform = isSubmenuExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
            });
        }
        
        if (mobileNavMenuEl) {
            mobileNavMenuEl.querySelectorAll('a:not(.has-dropdown-mobile), .dropdown-menu-mobile a').forEach(link => {
                link.addEventListener('click', () => { 
                    if (mobileNavMenuEl.classList.contains('active')) {
                        mobileNavMenuEl.classList.remove('active');
                        if(mobileNavToggle) {
                            mobileNavToggle.setAttribute('aria-expanded', 'false');
                            mobileNavToggle.classList.remove('active');
                        }
                        if (iconMenu && iconClose) {
                           iconMenu.style.display = 'block';
                           iconClose.style.display = 'none';
                        }
                        if (novelasDropdownMenuMobile) novelasDropdownMenuMobile.classList.remove('submenu-active');
                        if (novelasDropdownToggleMobile) {
                            novelasDropdownToggleMobile.setAttribute('aria-expanded', 'false');
                            const arrow = novelasDropdownToggleMobile.querySelector('.dropdown-arrow-mobile');
                            if(arrow) arrow.style.transform = 'rotate(0deg)';
                        }
                    }
                });
            });
            const mobileThemeBtn = mobileNavMenuEl.querySelector('.theme-toggle-btn');
            if(mobileThemeBtn){ 
                mobileThemeBtn.addEventListener('click', (e)=>{
                    e.stopPropagation(); 
                });
            }
        }
        
        const hubThemeToggleBtns = [
            document.getElementById('hubThemeToggleBtnDesktop'),
            document.getElementById('hubThemeToggleBtnMobile')
        ].filter(btn => btn !== null); 
        const LSHubThemeKey = 'sekainovels-hub-theme';

        const applyHubTheme = (theme) => { 
            document.documentElement.setAttribute('data-theme', theme);
            hubThemeToggleBtns.forEach(btn => {
                const iconSun = btn.querySelector('.icon-sun');
                const iconMoon = btn.querySelector('.icon-moon');
                if (iconSun && iconMoon) {
                    iconSun.style.display = theme === 'dark' ? 'inline-block' : 'none';
                    iconMoon.style.display = theme === 'light' ? 'inline-block' : 'none';
                    btn.title = theme === 'light' ? 'Activar Tema Oscuro' : 'Activar Tema Claro';
                }
            });
        };
        const toggleHubTheme = () => { 
            let newTheme = (document.documentElement.getAttribute('data-theme') || 'light') === 'light' ? 'dark' : 'light';
            localStorage.setItem(LSHubThemeKey, newTheme);
            applyHubTheme(newTheme);
        };
        const savedHubTheme = localStorage.getItem(LSHubThemeKey) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        applyHubTheme(savedHubTheme); 
        hubThemeToggleBtns.forEach(btn => btn.addEventListener('click', toggleHubTheme));

        // Variables del buscador (se obtienen cuando se necesitan, dentro de displaySearchResults y los listeners)
        const searchInput = document.getElementById('searchInput');
        const searchResultsDropdown = document.getElementById('searchResultsDropdown');
        const searchButton = document.getElementById('searchButton');

        function displaySearchResults(term) { 
            // Se obtienen los elementos aquí para asegurar que existen después de cargar el header
            const currentSearchResultsDropdown = document.getElementById('searchResultsDropdown');
            const currentSearchInput = document.getElementById('searchInput'); // No se usa 'term' directamente?

            if (!currentSearchResultsDropdown || !currentSearchInput) { // Comprueba contra currentSearchInput también
                console.error("Buscador: Elementos HTML 'searchResultsDropdown' o 'searchInput' no encontrados. ¿Cargó el header?");
                return;
            }

            currentSearchResultsDropdown.innerHTML = ''; 
            if (!term || term.length < 2) {
                currentSearchResultsDropdown.classList.remove('active');
                return;
            }

            const lowerTerm = term.toLowerCase();
            const matchedNovels = novelsData.filter(novel => 
                novel.title.toLowerCase().includes(lowerTerm) ||
                (novel.author && novel.author.toLowerCase().includes(lowerTerm)) 
            );

            if (matchedNovels.length > 0) {
                matchedNovels.slice(0, 4).forEach(novel => { 
                    const item = document.createElement('a');
                    
                    if (novel.presentationPage.startsWith('http://') || novel.presentationPage.startsWith('https://')) {
                        item.href = novel.presentationPage;
                        item.target = '_blank';
                        item.rel = 'noopener noreferrer';
                    } else {
                        item.href = `${SITE_BASE_PATH}/${novel.presentationPage}`; 
                    }

                    item.classList.add('search-result-item');
                    item.innerHTML = `
                        <span class="search-result-title">${novel.title}</span>
                        <span class="search-result-author">${novel.author || ''}</span>
                    `;
                    currentSearchResultsDropdown.appendChild(item);
                });
                
                const viewAll = document.createElement('a');
                viewAll.href = `https://rtber.github.io/HUBPRI/todas-las-novelas.html?search=${encodeURIComponent(term)}#todas-las-novelas-section`;
                viewAll.className = 'search-results-view-all';
                viewAll.textContent = matchedNovels.length > 4 ? `Ver los ${matchedNovels.length} resultados...` : 'Ver todos los resultados...';
                currentSearchResultsDropdown.appendChild(viewAll);
                currentSearchResultsDropdown.classList.add('active');
            } else {
                const noResultsItem = document.createElement('div');
                noResultsItem.className = 'search-result-item no-match';
                noResultsItem.textContent = 'No se encontraron coincidencias.';
                currentSearchResultsDropdown.appendChild(noResultsItem);
                currentSearchResultsDropdown.classList.add('active');
            }
        }

        if (searchInput && searchResultsDropdown) {
            searchInput.addEventListener('input', () => displaySearchResults(searchInput.value));
            searchInput.addEventListener('focus', () => {
                if(searchInput.value.length >= 2) displaySearchResults(searchInput.value);
            });
            document.addEventListener('click', (event) => {
                const searchArea = document.querySelector('.search-area');
                if (searchArea && !searchArea.contains(event.target)) {
                    if(searchResultsDropdown) searchResultsDropdown.classList.remove('active');
                }
            });
        }
        
        if (searchButton && searchInput) {
            searchButton.addEventListener('click', () => {
                const searchTerm = searchInput.value.trim();
                if (!searchTerm) return;
                window.location.href = `https://rtber.github.io/HUBPRI/todas-las-novelas.html?search=${encodeURIComponent(searchTerm)}#todas-las-novelas-section`;
            });
        }

        function filterNovelCardsOnPage(searchTermQuery) {
            const searchTerm = searchTermQuery.toLowerCase();
            const novelGrid = document.querySelector('#lista-novelas-section .novel-grid') || document.querySelector('#todas-las-novelas-section .novel-grid');
            let noResultsMessage = document.getElementById('noResultsMessage') || document.getElementById('noResultsMessageAllNovels'); 
            
            if (!novelGrid) return; 
            const novelCards = Array.from(novelGrid.querySelectorAll('.novel-card'));
            if (novelCards.length === 0 && !searchTerm) { 
                 if(noResultsMessage) noResultsMessage.style.display = 'none';
                return;
            }
            let resultsFound = false;
            novelCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                const author = card.querySelector('.novel-author')?.textContent?.toLowerCase() || '';
                const excerpt = card.querySelector('.novel-excerpt')?.textContent?.toLowerCase() || '';
                if (title.includes(searchTerm) || author.includes(searchTerm) || excerpt.includes(searchTerm)) {
                    card.classList.remove('hidden-by-search');
                    resultsFound = true;
                } else {
                    card.classList.add('hidden-by-search');
                }
            });
            if (!noResultsMessage && novelGrid.parentNode) { 
                noResultsMessage = document.createElement('div');
                noResultsMessage.className = 'no-results-message'; 
                if (novelGrid.closest('#lista-novelas-section')) noResultsMessage.id = 'noResultsMessage';
                else if (novelGrid.closest('#todas-las-novelas-section')) noResultsMessage.id = 'noResultsMessageAllNovels';
                novelGrid.insertAdjacentElement('afterend', noResultsMessage);
            }
            if (noResultsMessage) {
                noResultsMessage.style.display = (resultsFound || !searchTerm) ? 'none' : 'block';
                if (!resultsFound && searchTerm) noResultsMessage.textContent = 'No se encontraron novelas que coincidan con tu búsqueda.';
            }
        }
        
        const currentPagePathForSearchCheck = window.location.pathname;
        if (currentPagePathForSearchCheck === `${SITE_BASE_PATH}/` || currentPagePathForSearchCheck === `${SITE_BASE_PATH}/index.html` || currentPagePathForSearchCheck.endsWith('todas-las-novelas.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const searchTermFromUrl = urlParams.get('search');
            if (searchTermFromUrl && searchInput) { 
                searchInput.value = decodeURIComponent(searchTermFromUrl);
                filterNovelCardsOnPage(decodeURIComponent(searchTermFromUrl));
                
                const targetSectionId = currentPagePathForSearchCheck.endsWith('todas-las-novelas.html') ? 'todas-las-novelas-section' : 'lista-novelas-section';
                const novelListSection = document.getElementById(targetSectionId);
                if (novelListSection && urlParams.has('search')) { 
                    setTimeout(() => novelListSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                }
            }
        }
        
        const animatedElements = document.querySelectorAll('.novel-card, .page-section article, .faq-item, .novel-presentation-header > div, .chapters-list-external li'); 
        if (animatedElements.length > 0 && "IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries, observerInstance) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scroll-fade-in-up');
                        observerInstance.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.05, rootMargin: "0px 0px -30px 0px" }); 
            animatedElements.forEach(el => {
                el.classList.add('will-animate'); 
                observer.observe(el);
            });
        } else { 
            animatedElements.forEach(el => {
                el.classList.remove('will-animate'); 
                el.classList.add('scroll-fade-in-up'); 
            });
        }

        (function attachFontSizeControls() {
            const KEY = 'sekaiUserPFontSize';
            const containerSelector = '.page-section'; 
            const firstP = document.querySelector(`${containerSelector} p`);
            const defaultSize = firstP
              ? parseFloat(getComputedStyle(firstP).fontSize)
              : 16;
          
            let fontSize = parseFloat(localStorage.getItem(KEY));
            const MIN = 10, MAX = 48;
          
            function applySize() {
              document
                .querySelectorAll(`${containerSelector} p`)
                .forEach(p => p.style.fontSize = fontSize + 'px');
              localStorage.setItem(KEY, fontSize);
            }
          
            function change(delta) {
              if (isNaN(fontSize)) fontSize = defaultSize;
              fontSize = Math.min(MAX, Math.max(MIN, fontSize + delta));
              applySize();
            }
          
            document.getElementById('hubFontSizeDecrease')
              ?.addEventListener('click', () => change(-1));
            document.getElementById('hubFontSizeIncrease')
              ?.addEventListener('click', () => change(+1));
            document.getElementById('hubFontSizeDecreaseMobile')
              ?.addEventListener('click', () => change(-1));
            document.getElementById('hubFontSizeIncreaseMobile')
              ?.addEventListener('click', () => change(+1));
          
            if (!isNaN(fontSize)) applySize();
          })();
          
       // console.log("SekaiHub: Funcionalidades del Hub completamente inicializadas.");
    } // Cierre de initializeHubFunctionality
    
    loadLayoutAndInitialize();
}); // Cierre de DOMContentLoaded


