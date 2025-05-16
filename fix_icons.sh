#!/bin/bash

# Script para corregir los iconos de la extensión Silent Password

echo "Generando iconos para Silent Password..."

# Asegurarse de que exista la carpeta assets/icons
mkdir -p assets/icons

# Copiar los iconos existentes desde la carpeta fixed
echo "Copiando iconos existentes..."
cp assets/icons/fixed/icon16.png assets/icons/icon16.png
cp assets/icons/fixed/icon48.png assets/icons/icon48.png

# Crear el icono de 32x32 a partir del de 48x48 (usando sips en macOS)
echo "Creando icono de 32x32..."
sips -z 32 32 assets/icons/fixed/icon48.png --out assets/icons/icon32.png

# Crear el icono de 128x128 a partir del de 48x48 (escalando)
echo "Creando icono de 128x128..."
sips -z 128 128 assets/icons/fixed/icon48.png --out assets/icons/icon128.png

echo "Verificando iconos generados..."
file assets/icons/icon16.png
file assets/icons/icon32.png
file assets/icons/icon48.png
file assets/icons/icon128.png

echo "Iconos generados correctamente. Ahora puedes empaquetar la extensión." 