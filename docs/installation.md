# Guía de Instalación de Silent Password

Esta guía te ayudará a instalar Silent Password en tu navegador Chrome.

## Método 1: Instalación desde Chrome Web Store (Recomendado)

La forma más fácil y segura de instalar Silent Password es a través de la Chrome Web Store oficial:

1. Abre Google Chrome
2. Navega a la [página de Silent Password en Chrome Web Store](https://chrome.google.com/webstore/detail/silent-password/id) 
   *(Enlace por actualizar cuando la extensión sea publicada)*
3. Haz clic en el botón "Añadir a Chrome"
4. En el diálogo de confirmación, haz clic en "Añadir extensión"
5. ¡Listo! Verás el icono de Silent Password en la barra de herramientas de Chrome

## Método 2: Instalación Manual (Modo desarrollador)

Si prefieres instalar la extensión directamente desde el código fuente:

1. **Descarga el archivo ZIP o clona el repositorio**
   - Opción A: Descarga el [archivo ZIP](https://github.com/tebiiee/silentpassword/releases/latest) 
     y descomprímelo en una carpeta de tu elección
   - Opción B: Clona el repositorio usando Git:
     ```
     git clone https://github.com/tebiiee/silentpassword.git
     ```

2. **Abre la página de extensiones de Chrome**
   - Escribe `chrome://extensions/` en la barra de direcciones y presiona Enter, o
   - Desde el menú de Chrome (tres puntos verticales), navega a "Más herramientas" > "Extensiones"

3. **Activa el modo desarrollador**
   - Busca el interruptor "Modo desarrollador" en la esquina superior derecha y actívalo

4. **Carga la extensión**
   - Haz clic en el botón "Cargar descomprimida"
   - Navega hasta la carpeta donde descomprimiste o clonaste Silent Password
   - Selecciona la carpeta (asegúrate de seleccionar la carpeta raíz que contiene el archivo `manifest.json`)
   - Haz clic en "Seleccionar carpeta"

5. **Verifica la instalación**
   - Deberías ver Silent Password en tu lista de extensiones
   - El icono de Silent Password aparecerá en la barra de herramientas de Chrome

## Actualización Manual

Si instalaste la extensión manualmente y deseas actualizarla a una nueva versión:

1. Descarga la nueva versión o actualiza tu copia local con `git pull`
2. Ve a `chrome://extensions/`
3. Encuentra Silent Password en la lista de extensiones
4. Haz clic en el botón "Actualizar" (icono de recarga) o elimina la extensión y vuelve a cargarla

## Solución de Problemas

### La extensión no aparece en la barra de herramientas
- Haz clic en el icono de extensiones (puzzle) en la barra de herramientas
- Busca Silent Password y haz clic en el icono de pin para fijarlo en la barra

### Error al cargar la extensión
- Asegúrate de seleccionar la carpeta correcta que contiene el archivo `manifest.json`
- Verifica que el modo desarrollador esté activado
- Revisa la consola de desarrollador para ver detalles sobre posibles errores

### La extensión no funciona correctamente
- Asegúrate de tener una versión compatible de Chrome (v88 o superior)
- Intenta recargar la extensión desde la página de extensiones
- Reinicia el navegador Chrome

## Contacto y Soporte

Si tienes problemas con la instalación o uso de Silent Password, puedes:

- Abrir un [issue en GitHub](https://github.com/tebiiee/silentpassword/issues)
- Contactarnos por correo electrónico a [contact@silentpassword.dev](mailto:contact@silentpassword.dev)

---

¡Gracias por usar Silent Password! Esperamos que disfrutes generando contraseñas seguras con nuestra extensión. 