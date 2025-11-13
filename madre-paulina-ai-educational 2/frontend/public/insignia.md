# Insignia del Colegio Madre Paulina

Esta es una imagen placeholder para la insignia del colegio.

## Para implementar:

1. Reemplaza este archivo con la insignia real del Colegio Madre Paulina
2. Mantén el nombre como `insignia.png`
3. Formato recomendado: PNG, 200x200px máximo
4. Fondo transparente preferible

## Uso en la aplicación:

- Se muestra en el header de la aplicación
- Se incluye en los headers de los PDFs exportados
- Se convierte a Base64 automáticamente para Puppeteer

## Nota importante:

La insignia debe estar disponible tanto en:
- `frontend/public/insignia.png` (para el frontend)
- `netlify/functions/insignia.png` (para las funciones serverless)

Para las funciones serverless, copia la insignia desde el frontend después de confirmar que tienes la imagen real.