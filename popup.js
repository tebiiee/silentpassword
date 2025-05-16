/**
 * Silent Password - Generador de contraseñas seguras
 * Desarrollado usando JavaScript vanilla y Manifest V3
 */

// Mock para pruebas locales fuera del entorno de extensión
if (typeof chrome === 'undefined') {
  window.chrome = {
    storage: {
      local: {
        get: function(key) {
          const data = localStorage.getItem(key);
          return Promise.resolve({ [key]: data ? JSON.parse(data) : null });
        },
        set: function(obj) {
          const key = Object.keys(obj)[0];
          localStorage.setItem(key, JSON.stringify(obj[key]));
          return Promise.resolve();
        }
      },
      sync: {
        get: function(key) {
          const data = localStorage.getItem(key);
          return Promise.resolve({ [key]: data ? JSON.parse(data) : null });
        },
        set: function(obj) {
          const key = Object.keys(obj)[0];
          localStorage.setItem(key, JSON.stringify(obj[key]));
          return Promise.resolve();
        }
      }
    },
    tabs: {
      create: function(options) {
        window.open(options.url, '_blank');
        return Promise.resolve();
      }
    }
  };
}

// Traducciones para internacionalización
const translations = {
  es: {
    title: 'Silent Password',
    lengthLabel: 'Longitud: %length% caracteres',
    uppercaseLabel: 'Incluir\nMayúsculas',
    lowercaseLabel: 'Incluir\nMinúsculas',
    numbersLabel: 'Incluir\nNúmeros',
    symbolsLabel: 'Incluir\nSímbolos (!@#$%&)',
    generateButton: 'Generar',
    copyButton: 'Copiar',
    donateButton: 'Donar',
    strengthWeak: 'Débil',
    strengthMedium: 'Medio',
    strengthStrong: 'Fuerte',
    passwordCopied: 'Contraseña copiada',
    passwordCleared: 'Portapapeles limpiado',
    requireOneOption: 'Selecciona al menos una opción',
    preferences: 'Preferencias guardadas',
    error: 'Error'
  },
  en: {
    title: 'Silent Password',
    lengthLabel: 'Length: %length% characters',
    uppercaseLabel: 'Include\nUppercase',
    lowercaseLabel: 'Include\nLowercase',
    numbersLabel: 'Include\nNumbers',
    symbolsLabel: 'Include\nSymbols (!@#$%&)',
    generateButton: 'Generate',
    copyButton: 'Copy',
    donateButton: 'Donate',
    strengthWeak: 'Weak',
    strengthMedium: 'Medium',
    strengthStrong: 'Strong',
    passwordCopied: 'Password copied',
    passwordCleared: 'Clipboard cleared',
    requireOneOption: 'Select at least one option',
    preferences: 'Preferences saved',
    error: 'Error'
  }
};

/**
 * Función principal que se ejecuta cuando el DOM está completamente cargado
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Referencias a los elementos del DOM
  const passwordOutput = document.getElementById('password-output');
  const passwordLength = document.getElementById('password-length');
  const lengthValue = document.getElementById('length-value');
  const includeUppercase = document.getElementById('include-uppercase');
  const includeLowercase = document.getElementById('include-lowercase');
  const includeNumbers = document.getElementById('include-numbers');
  const includeSymbols = document.getElementById('include-symbols');
  const copyButton = document.getElementById('copy-button');
  const refreshButton = document.getElementById('refresh-button');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIconLight = document.getElementById('theme-icon-light');
  const themeIconDark = document.getElementById('theme-icon-dark');
  const languageSelector = document.getElementById('language-selector');
  const strengthIndicator = document.getElementById('strength-indicator');
  const infoButton = document.getElementById('info-button');

  // Estado inicial de la aplicación
  let currentLanguage = 'es';
  let currentTheme = 'light';
  
  /**
   * Carga las preferencias del usuario desde el almacenamiento local
   */
  async function loadPreferences() {
    try {
      const result = await chrome.storage.local.get('silentPasswordPrefs');
      
      if (result.silentPasswordPrefs) {
        const prefs = result.silentPasswordPrefs;
        
        // Restaurar valores de los controles
        passwordLength.value = prefs.length || 20;
        lengthValue.textContent = passwordLength.value;
        includeUppercase.checked = prefs.includeUppercase !== undefined ? prefs.includeUppercase : true;
        includeLowercase.checked = prefs.includeLowercase !== undefined ? prefs.includeLowercase : true;
        includeNumbers.checked = prefs.includeNumbers !== undefined ? prefs.includeNumbers : true;
        includeSymbols.checked = prefs.includeSymbols !== undefined ? prefs.includeSymbols : true;
        
        // Restaurar idioma
        currentLanguage = prefs.language || 'es';
        languageSelector.value = currentLanguage;
        
        // Restaurar tema
        currentTheme = prefs.theme || 'light';
        applyTheme(currentTheme);
        
        return prefs;
      }
      
      return null;
    } catch (error) {
      console.error('Error al cargar preferencias:', error);
      showToast('error', translations[currentLanguage].error);
      return null;
    }
  }
  
  /**
   * Guarda las preferencias del usuario en el almacenamiento local
   */
  async function savePreferences() {
    try {
      const prefs = {
        length: parseInt(passwordLength.value, 10),
        includeUppercase: includeUppercase.checked,
        includeLowercase: includeLowercase.checked,
        includeNumbers: includeNumbers.checked,
        includeSymbols: includeSymbols.checked,
        language: currentLanguage,
        theme: currentTheme
      };
      
      await chrome.storage.local.set({ silentPasswordPrefs: prefs });
      console.log('Preferencias guardadas:', prefs);
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
      showToast('error', translations[currentLanguage].error);
    }
  }
  
  /**
   * Genera una contraseña segura según los criterios seleccionados
   */
  function generatePassword() {
    const length = parseInt(passwordLength.value, 10);
    const useUppercase = includeUppercase.checked;
    const useLowercase = includeLowercase.checked;
    const useNumbers = includeNumbers.checked;
    const useSymbols = includeSymbols.checked;
    
    // Verificar que al menos una opción esté seleccionada
    if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
      showToast('warning', translations[currentLanguage].requireOneOption);
      includeLowercase.checked = true;
      return '';
    }
    
    // Conjuntos de caracteres
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%&';
    
    let allChars = '';
    if (useUppercase) allChars += uppercaseChars;
    if (useLowercase) allChars += lowercaseChars;
    if (useNumbers) allChars += numberChars;
    if (useSymbols) allChars += symbolChars;
    
    // Asegurar que hay al menos un carácter de cada tipo seleccionado
    const requiredChars = [];
    if (useUppercase) requiredChars.push(getRandomChar(uppercaseChars));
    if (useLowercase) requiredChars.push(getRandomChar(lowercaseChars));
    if (useNumbers) requiredChars.push(getRandomChar(numberChars));
    if (useSymbols) requiredChars.push(getRandomChar(symbolChars));
    
    // Generar el resto de la contraseña
    let password = '';
    
    // Primero, agregar los caracteres requeridos
    for (let i = 0; i < requiredChars.length; i++) {
      password += requiredChars[i];
    }
    
    // Luego, completar con caracteres aleatorios hasta alcanzar la longitud deseada
    for (let i = requiredChars.length; i < length; i++) {
      password += getRandomChar(allChars);
    }
    
    // Mezclar la contraseña para que los caracteres requeridos no estén al principio
    return shuffleString(password);
  }
  
  /**
   * Obtiene un carácter aleatorio de una cadena utilizando la API de crypto
   */
  function getRandomChar(characters) {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    return characters.charAt(randomValues[0] % characters.length);
  }
  
  /**
   * Mezcla los caracteres de una cadena de forma aleatoria
   */
  function shuffleString(str) {
    const array = str.split('');
    
    // Fisher-Yates shuffle con valores criptográficamente seguros
    for (let i = array.length - 1; i > 0; i--) {
      const randomValues = new Uint32Array(1);
      window.crypto.getRandomValues(randomValues);
      const j = randomValues[0] % (i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    
    return array.join('');
  }
  
  /**
   * Calcula y muestra la fortaleza de la contraseña
   */
  function updatePasswordStrength(password) {
    if (!password) {
      strengthIndicator.textContent = '';
      strengthIndicator.className = 'strength-badge';
      return;
    }
    
    // Criterios de evaluación
    let score = 0;
    
    // Longitud
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Complejidad
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%&]/.test(password)) score += 1;
    
    // Clasificar la contraseña según su puntuación
    let strengthText = '';
    let strengthClass = '';
    
    if (score <= 3) {
      strengthText = translations[currentLanguage].strengthWeak;
      strengthClass = 'weak';
    } else if (score <= 5) {
      strengthText = translations[currentLanguage].strengthMedium;
      strengthClass = 'medium';
    } else {
      strengthText = translations[currentLanguage].strengthStrong;
      strengthClass = '';
    }
    
    // Actualizar la interfaz
    strengthIndicator.textContent = strengthText;
    strengthIndicator.className = `strength-badge ${strengthClass}`;
  }
  
  /**
   * Actualizar la visualización de la contraseña
   * Muestra los primeros 17 caracteres y luego '...' si es más larga
   */
  function updatePasswordDisplay(password) {
    if (!password) {
      passwordOutput.value = '';
      return;
    }
    
    if (password.length > 17) {
      passwordOutput.value = password.substring(0, 17) + '...';
    } else {
      passwordOutput.value = password;
    }
    
    // Guardamos la contraseña completa como un atributo para copiar la versión completa
    passwordOutput.setAttribute('data-full-password', password);
    
    updatePasswordStrength(password);
  }
  
  /**
   * Copia la contraseña al portapapeles
   */
  async function copyPasswordToClipboard() {
    // Usar la contraseña completa almacenada en el atributo data, no la versión recortada
    const password = passwordOutput.getAttribute('data-full-password');
    
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      showToast('success', translations[currentLanguage].passwordCopied);
      
      // Limpiar el portapapeles después de 60 segundos
      setTimeout(async () => {
        try {
          // Intentar limpiar el portapapeles directamente sin verificar
          // Esto evita errores de permisos que pueden ocurrir al intentar leer el portapapeles
          // después de que la extensión ha estado inactiva
          await navigator.clipboard.writeText('');
          showToast('info', translations[currentLanguage].passwordCleared);
        } catch (error) {
          // Error silencioso, no mostramos el error al usuario para no confundirlo
          console.log('No se pudo limpiar el portapapeles automáticamente');
        }
      }, 60000);
    } catch (error) {
      console.error('Error al copiar al portapapeles:', error);
      showToast('error', translations[currentLanguage].error);
    }
  }
  
  /**
   * Aplica el tema seleccionado
   */
  function applyTheme(theme) {
    currentTheme = theme;
    
    if (theme === 'dark') {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      themeIconLight.classList.add('hidden');
      themeIconDark.classList.remove('hidden');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      themeIconLight.classList.remove('hidden');
      themeIconDark.classList.add('hidden');
    }
  }
  
  /**
   * Actualiza el idioma de la interfaz
   */
  function updateLanguage(lang) {
    currentLanguage = lang;
    
    // Actualizar etiquetas
    document.querySelector('label[for="password-length"]').textContent = 
      translations[lang].lengthLabel.replace('%length%', passwordLength.value);
    document.querySelector('label[for="include-uppercase"]').textContent = translations[lang].uppercaseLabel;
    document.querySelector('label[for="include-lowercase"]').textContent = translations[lang].lowercaseLabel;
    document.querySelector('label[for="include-numbers"]').textContent = translations[lang].numbersLabel;
    document.querySelector('label[for="include-symbols"]').textContent = translations[lang].symbolsLabel;
    
    // Actualizar el indicador de fortaleza si hay una contraseña
    if (passwordOutput.value) {
      updatePasswordStrength(passwordOutput.value);
    }
  }
  
  /**
   * Muestra una notificación toast
   */
  function showToast(type, message) {
    const toastContainer = document.getElementById('toast-container');
    
    // Crear el elemento toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Agregar al contenedor
    toastContainer.appendChild(toast);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
  
  // Cargar preferencias guardadas
  await loadPreferences();
  
  // Inicializar la interfaz
  updateLanguage(currentLanguage);
  
  // Generar contraseña inicial
  const initialPassword = generatePassword();
  updatePasswordDisplay(initialPassword);
  
  // Event Listeners
  passwordLength.addEventListener('input', () => {
    lengthValue.textContent = passwordLength.value;
    document.querySelector('label[for="password-length"]').textContent = 
      translations[currentLanguage].lengthLabel.replace('%length%', passwordLength.value);
    savePreferences();
  });
  
  [includeUppercase, includeLowercase, includeNumbers, includeSymbols].forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      savePreferences();
      
      // Regenerar contraseña cuando cambian las opciones
      const newPassword = generatePassword();
      updatePasswordDisplay(newPassword);
    });
  });
  
  refreshButton.addEventListener('click', () => {
    const newPassword = generatePassword();
    updatePasswordDisplay(newPassword);
  });
  
  copyButton.addEventListener('click', copyPasswordToClipboard);
  
  // Permite copiar la contraseña haciendo clic en el campo de texto
  passwordOutput.addEventListener('click', copyPasswordToClipboard);
  
  themeToggle.addEventListener('click', () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    savePreferences();
  });
  
  languageSelector.addEventListener('change', () => {
    updateLanguage(languageSelector.value);
    savePreferences();
  });
  
  infoButton.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://tebiiee.github.io/silentpassword/docs/privacy.html' });
  });
});
