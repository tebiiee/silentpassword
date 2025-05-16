# Silent Password

![Silent Password Logo](assets/icons/icon128.png)

Silent Password es una extensión de Chrome moderna y minimalista para generar contraseñas seguras directamente en tu navegador.

## Características

- **Generación de contraseñas seguras** utilizando el algoritmo criptográficamente seguro `window.crypto.getRandomValues()`
- **Interfaz unificada** que integra todas las funcionalidades en una sola vista
- **Configuración personalizada**:
  - Longitud ajustable (8-32 caracteres)
  - Opciones para incluir mayúsculas, minúsculas, números y símbolos
- **Indicador visual de fortaleza** que muestra la robustez de tu contraseña
- **Copia con un clic** para transferir fácilmente la contraseña al portapapeles
- **Limpieza automática del portapapeles** tras 60 segundos por seguridad
- **Temas claro/oscuro** para adaptarse a tus preferencias
- **Soporte multiidioma** (Español e Inglés)
- **Guardado de preferencias** entre sesiones

## Instalación

### Desde Chrome Web Store

1. Visita la [página de Silent Password en Chrome Web Store](https://chrome.google.com/webstore/detail/silent-password/id)
2. Haz clic en "Añadir a Chrome"
3. Confirma la instalación

### Instalación manual (modo desarrollador)

#### Opción 1: Desde el código fuente
1. Clona o descarga este repositorio
2. Abre Chrome y navega a `chrome://extensions/`
3. Activa el "Modo desarrollador" en la esquina superior derecha
4. Haz clic en "Cargar descomprimida"
5. Selecciona la carpeta donde descargaste/clonaste el repositorio

#### Opción 2: Desde el archivo empaquetado
1. Descarga el archivo `silent-password-dev.zip` desde la sección de [Releases](https://github.com/tebiiee/silentpassword/releases)
2. Descomprime el archivo en una carpeta de tu elección
3. Abre Chrome y navega a `chrome://extensions/`
4. Activa el "Modo desarrollador" en la esquina superior derecha
5. Haz clic en "Cargar descomprimida"
6. Selecciona la carpeta donde descomprimiste los archivos

## Uso

1. Haz clic en el icono de Silent Password en la barra de herramientas de Chrome
2. Configura los ajustes según tus necesidades:
   - Ajusta la longitud de la contraseña con el control deslizante
   - Selecciona qué tipos de caracteres incluir
3. La contraseña se genera automáticamente
4. Haz clic en el botón de copiar o directamente en la contraseña para copiarla al portapapeles

## Privacidad

Silent Password está diseñado con la privacidad como prioridad:

- **No recopila datos personales**
- **Las contraseñas nunca se almacenan** ni se envían a servidores remotos
- **Las preferencias se guardan localmente** en tu navegador
- El portapapeles se limpia automáticamente por seguridad

Para más información, consulta nuestra [Política de Privacidad](docs/privacy.html).

## Desarrollo

### Estructura del proyecto

```
silent-password/
├── assets/
│   └── icons/         # Iconos de la extensión
├── dist/              # Archivos de distribución
├── docs/              # Documentación
├── tests/             # Pruebas
├── manifest.json      # Configuración de la extensión
├── package.sh         # Script para empaquetar la extensión
├── popup.html         # Interfaz principal
├── popup.js           # Lógica de la aplicación
└── style.css          # Estilos
```

### Tecnologías utilizadas

- JavaScript vanilla
- HTML5/CSS3
- Chrome Extension API (Manifest V3)
- Crypto API para generación segura

### Ejecutar pruebas

Abre `tests/index.html` en tu navegador para ejecutar las pruebas unitarias.

## Contribuir

¡Las contribuciones son bienvenidas! Si deseas contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu función: `git checkout -b nueva-funcion`
3. Haz tus cambios y confirma: `git commit -m 'Añadir nueva función'`
4. Sube tus cambios: `git push origin nueva-funcion`
5. Envía un pull request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Apoyar el proyecto

Si encuentras útil Silent Password, considera [donar](https://ko-fi.com/tebiiee) para apoyar su desarrollo continuo.

---

Desarrollado con ❤️ por [tebiiee](https://github.com/tebiiee) 