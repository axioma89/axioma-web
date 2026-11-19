# Web oficial — AXIOMA IA TECH

Sitio estático (HTML + CSS + JS sin dependencias ni build) servido por nginx en Docker y
desplegado en Dokploy. Estilo visual inspirado en apple.com.

## Empresa (fuente: certificado Cámara de Comercio del Huila, 19/11/2026)
- Razón social: AXIOMA INTELIGENCIA ARTIFICIAL Y TECNOLOGIA S.A.S. | Sigla: AXIOMA IA TECH S.A.S.
- NIT 902.127.967-5 | Matrícula 436569 | Neiva, Huila
- Dirección: Carrera 21 # 1A-46, Neiva | Tel/WhatsApp: +57 322 785 4064 | axiomaiatech@gmail.com
- CIIU: 6201 (principal), 6202, 6311, 4741

## Estructura
- `site/` — todo lo que se publica (index.html, privacidad.html, 404.html, assets/).
- `site/assets/img/logo-mark.svg` — marca vectorial calcada del **logo 2** (original en `tools/src/logo-2.jpg`).
- `tools/generar_imagenes.py` — regenera favicon/íconos/og-image con Pillow.
- `nginx.conf` + `Dockerfile` — servidor; redirige www → dominio raíz, cabeceras de seguridad y CSP.

## Despliegue
- Repo: https://github.com/axioma89/axioma-web (público, rama `main`).
- Dokploy (dokploy.axiomaiatech.com): proyecto "AXIOMA IA TECH S.A.S", entorno production `7PYkACR5FNTUx_3_K_1jv`,
  app "web" `XaSI_DKjLi0LBLEQHPaIC`, fuente git por URL, build `Dockerfile`.
- Dominios: axiomaiatech.com y www.axiomaiatech.com → servidor 62.171.134.43 (Let's Encrypt).
- El repo no tiene webhook: tras cada `git push`, lanzar deploy en Dokploy (MCP `application-deploy` o botón Deploy).

## Convenciones
- Idioma es-CO, tono cercano y directo (tú). Moneda COP con punto de miles.
- No publicar cifras, clientes ni testimonios que no sean reales.
- Al cambiar CSS/JS, subir el `?v=N` en los `<link>`/`<script>` de las páginas (caché de 7 días).
- Si se cambia el script inline del `<head>`, recalcular su hash sha256 en la CSP de `nginx.conf`.

> Estado y pendientes: ver MEMORY.md
