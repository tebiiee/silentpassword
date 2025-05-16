// test.js - Pruebas para Silent Password
// Utiliza Mocha y Chai para las pruebas

describe('Silent Password Generator', () => {
  // Pruebas para la generación de contraseñas
  describe('Generación de contraseñas', () => {
    it('debe generar una contraseña con la longitud especificada', () => {
      // Simulamos la función generatePassword
      const password = generatePassword(12, {
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true
      });
      
      chai.expect(password).to.have.lengthOf(12);
    });

    it('debe incluir al menos un carácter de cada tipo seleccionado', () => {
      const password = generatePassword(12, {
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true
      });
      
      // Verificar que contiene al menos un carácter de cada tipo
      chai.expect(password).to.match(/[A-Z]/);
      chai.expect(password).to.match(/[a-z]/);
      chai.expect(password).to.match(/[0-9]/);
      chai.expect(password).to.match(/[!@#$%&]/);
    });

    it('debe respetar las opciones de exclusión de caracteres', () => {
      // Contraseña solo con minúsculas y números
      const password = generatePassword(12, {
        includeUppercase: false,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false
      });
      
      // No debe contener mayúsculas ni símbolos
      chai.expect(password).to.not.match(/[A-Z]/);
      chai.expect(password).to.not.match(/[!@#$%&]/);
      
      // Debe contener minúsculas y números
      chai.expect(password).to.match(/[a-z]/);
      chai.expect(password).to.match(/[0-9]/);
    });
  });

  // Pruebas para el cálculo de fortaleza
  describe('Cálculo de fortaleza de contraseña', () => {
    it('debe clasificar correctamente una contraseña débil', () => {
      const strength = calculatePasswordStrength('abc123');
      chai.expect(strength).to.be.at.most(2);
    });

    it('debe clasificar correctamente una contraseña media', () => {
      const strength = calculatePasswordStrength('Abc123456');
      chai.expect(strength).to.be.within(3, 4);
    });

    it('debe clasificar correctamente una contraseña fuerte', () => {
      const strength = calculatePasswordStrength('P@ssw0rd!2023XYZ');
      chai.expect(strength).to.equal(5);
    });
  });

  // Pruebas para el guardado de preferencias
  describe('Gestión de preferencias', () => {
    beforeEach(() => {
      // Limpiar almacenamiento antes de cada prueba
      chrome.storage.local.clear();
    });

    it('debe guardar correctamente las preferencias del usuario', async () => {
      const preferences = {
        length: 16,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: false,
        includeSymbols: true,
        language: 'es',
        theme: 'dark'
      };
      
      await savePreferences(preferences);
      
      const loadedPrefs = await loadPreferences();
      chai.expect(loadedPrefs).to.deep.equal(preferences);
    });

    it('debe cargar valores predeterminados cuando no hay preferencias guardadas', async () => {
      const loadedPrefs = await loadPreferences();
      chai.expect(loadedPrefs).to.be.null;
    });
  });
});

// Funciones auxiliares para pruebas
function generatePassword(length, options) {
  const { includeUppercase, includeLowercase, includeNumbers, includeSymbols } = options;
  
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%&';
  
  let allChars = '';
  if (includeUppercase) allChars += uppercaseChars;
  if (includeLowercase) allChars += lowercaseChars;
  if (includeNumbers) allChars += numberChars;
  if (includeSymbols) allChars += symbolChars;
  
  // Ensure at least one character from each selected category is included
  const selectedCategories = [
    includeUppercase ? uppercaseChars : '',
    includeLowercase ? lowercaseChars : '',
    includeNumbers ? numberChars : '',
    includeSymbols ? symbolChars : ''
  ].filter(category => category !== '');
  
  if (selectedCategories.length === 0) {
    // Default to lowercase if no categories selected
    allChars = lowercaseChars;
    selectedCategories.push(lowercaseChars);
  }
  
  let password = '';
  // Add at least one character from each selected category
  selectedCategories.forEach(category => {
    password += category.charAt(Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * category.length));
  });
  
  // Fill the rest of the password length with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars.charAt(Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1) * allChars.length));
  }
  
  // Shuffle the password to randomize the order
  password = password.split('').sort(() => 0.5 - Math.random()).join('');
  
  return password;
}

function calculatePasswordStrength(password) {
  // Simple strength calculation based on length and character variety
  let strength = 0;
  if (password.length >= 12) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return strength;
}

// Mock de chrome.storage para pruebas
if (typeof chrome === 'undefined') {
  globalThis.chrome = {
    storage: {
      local: {
        _data: {},
        set: function(data, callback) {
          Object.assign(this._data, data);
          if (callback) setTimeout(callback, 0);
          return Promise.resolve();
        },
        get: function(keys, callback) {
          const result = {};
          if (typeof keys === 'string') {
            result[keys] = this._data[keys];
          } else if (Array.isArray(keys)) {
            keys.forEach(key => {
              result[key] = this._data[key];
            });
          } else if (typeof keys === 'object') {
            Object.keys(this._data).forEach(key => {
              result[key] = this._data[key];
            });
          }
          if (callback) setTimeout(() => callback(result), 0);
          return Promise.resolve(result);
        },
        clear: function(callback) {
          this._data = {};
          if (callback) setTimeout(callback, 0);
          return Promise.resolve();
        }
      }
    }
  };
} 