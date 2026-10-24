/**
 * Script de interactividad para Hoja de Vida - Juan Camilo Cardona Ospina
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCopyButtons();
    initPrintButton();
    setCurrentYear();
});

/**
 * 1. Gestión de Tema Claro / Oscuro con persistencia en localStorage
 */
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;

    // Detectar preferencia guardada o preferencia del sistema operativo
    const savedTheme = localStorage.getItem('cv_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (systemPrefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('cv_theme', newTheme);
            showToast(newTheme === 'dark' ? '🌙 Modo Oscuro activado' : '☀️ Modo Claro activado');
        });
    }

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        if (themeIcon) {
            if (theme) {
                themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
        }
    }
}

/**
 * 2. Copiar texto al portapapeles con feedback accesible
 */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('[data-copy]');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            const label = btn.getAttribute('data-label') || 'Texto';
            
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    // Fallback para contextos no seguros o navegadores antiguos
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    textArea.remove();
                }
                showToast(`✓ ${label} copiado al portapapeles`);
            } catch (err) {
                console.error('Error al copiar:', err);
                showToast(`✕ No se pudo copiar ${label}`);
            }
        });
    });
}

/**
 * 3. Botón de Imprimir / Guardar como PDF
 */
function initPrintButton() {
    const printButtons = document.querySelectorAll('[data-action="print"]');
    printButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Abrir automáticamente todos los detalles antes de imprimir
            document.querySelectorAll('details.cv-disclosure').forEach(d => d.open = true);
            window.print();
        });
    });
}

/**
 * 4. Toast flotante no intrusivo
 */
let toastTimeout;
function showToast(message) {
    let toast = document.getElementById('cvToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cvToast';
        toast.className = 'cv-toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

/**
 * 5. Actualizar año dinámico en pie de página
 */
function setCurrentYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
