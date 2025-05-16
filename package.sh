#!/bin/bash

# Crear directorio para la versión de desarrollo si no existe
mkdir -p dist

# Verificar que los iconos sean PNG válidos
echo "Verificando iconos..."
for icon in assets/icons/icon16.png assets/icons/icon32.png assets/icons/icon48.png assets/icons/icon128.png; do
  if ! file "$icon" | grep -q "PNG image data"; then
    echo "Error: $icon no es un archivo PNG válido."
    echo "Ejecuta ./fix_icons.sh para regenerar los iconos."
    exit 1
  fi
done

# Empaquetar archivos necesarios
echo "Empaquetando archivos..."
zip -r dist/silent-password-dev.zip \
  manifest.json \
  popup.html \
  popup.js \
  style.css \
  assets/icons/icon16.png \
  assets/icons/icon32.png \
  assets/icons/icon48.png \
  assets/icons/icon128.png

echo "Extensión empaquetada en dist/silent-password-dev.zip" 