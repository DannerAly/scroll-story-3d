---
name: scroll-story-3d
description: Crea presentaciones tipo landing de scroll vertical, minimalistas estilo Apple (fondo blanco, tipografía grande, muy poco texto), con personajes 3D animados (Three.js) que cambian de formación en cada sección, transiciones suaves (Lenis + parallax), pasos fijos (sticky) y navegación con flechas. Úsala cuando pidan una presentación, propuesta, pitch o "slide" en HTML que se recorra hacia abajo, con animaciones, 3D, personajes, estilo Apple, o "como la landing anterior".
---

# Presentaciones de scroll con personajes 3D

Un solo archivo HTML, sin build. La página se recorre hacia abajo (no hay slides laterales). Detrás del texto hay un `<canvas>` fijo con personajes 3D de bloques que se mueven a una nueva **formación** en cada sección. Se navega con la rueda/trackpad o con las flechas ↑ ↓ ← →, barra espaciadora y Page Up/Down.

Punto de partida: copia `template/index.html` y edítalo. Ya trae el motor de scroll, la escena 3D, 6 formaciones, etiquetas y navegación con teclado funcionando.

## Flujo de trabajo

1. **Contenido primero.** Antes del HTML, escribe en un `.md` el contenido completo (qué se propone, para quién, el porqué, el cómo, la prueba, el cierre). Después redúcelo a frases de 2 a 8 palabras por pantalla. Si una sección necesita un párrafo, sobra texto.
2. **Arma el guion de secciones.** Cada sección = una idea = una formación 3D. Usa los patrones de `references/patterns.md` (portada, frase que se ilumina, pasos fijos, grilla con etiquetas, ronda, cierre). Evita secciones que repitan una idea ya dicha.
3. **Copia la plantilla** a la carpeta del usuario (`<nombre>.html`) y ajusta `CONFIG` (color de marca, nombres de los personajes) y las variables CSS de `:root`.
4. **Escribe las secciones** en el HTML (cada `<section>` con `data-f="<formación>"`). Las secciones de varios pasos llevan `data-pin` y un `.stages` con varios `.stage`.
5. **Verifica con capturas** (`scripts/shoot.mjs`, ver abajo) en escritorio (1440×900) y celular (390×844). Revisa: texto que se pisa con los personajes, etiquetas cortadas en los bordes, personajes fuera de cuadro.
6. **Abre el archivo** en el navegador del usuario (`open <archivo>.html` en macOS) y resume qué hay en cada sección.

## Diseño (lo que hace que se vea bien)

- **Fondo blanco** (`#fff`), texto casi negro (`#1d1d1f`), gris secundario (`#6e6e73`). Un solo color de acento, el de la marca, en `--accent`; úsalo en el eyebrow, en el título en degradé y en los personajes.
- **Tipografía**: una sola familia de Google Fonts (por defecto Poppins 400/500/600). Títulos 600 con `letter-spacing:-.045em` y `line-height:1.02–1.06`. Tamaños con `clamp()`: h1 hasta ~136px, h2 hasta ~92px. Eyebrow en mayúsculas, 12–13px, `letter-spacing:.18em`, color acento.
- **Poquísimo texto**: un eyebrow + un título + una línea como máximo por pantalla.
- **Revelado**: los elementos `.r` entran con opacidad, desplazamiento de 42px y blur de 10px que se va (curva `cubic-bezier(.16,1,.3,1)`). Escalonar con `style="--d:.1s"`.
- **Pasos fijos**: el texto cambia con un cruce suave (opacidad + blur) mientras la sección queda fija.
- **Personajes 3D**: bloques redondeados del color de marca, con visor oscuro y ojos que parpadean, patas que caminan, saltitos y mirada que sigue al mouse. Son originales y genéricos: no dibujes mascotas o personajes conocidos de otras marcas; si piden "personajes de X", haz uno propio inspirado en el color/estilo, no una copia.
- **Etiquetas HTML** (no texto 3D) para nombres/roles: píldoras blancas con borde suave, proyectadas sobre cada personaje.
- **Campo de puntos** ondulante abajo (shader) para dar profundidad; más visible en portada y cierre.

## Cómo funciona el motor (para editarlo sin romperlo)

- Cada `<section data-f="nombre">` define un **rango de scroll** donde su formación se mantiene. Entre una sección y la siguiente, cada personaje interpola de una formación a otra con un salto y un escalonado propio.
- Secciones normales: alto `100vh`. Secciones de pasos: `class="pin"`, `data-pin`, alto `(pasos × ~95 + 100)vh`, contenido dentro de `.sticky`.
- El motor (script clásico) calcula el progreso `p` (0→1) de cada sección fija, cambia el paso activo (`.stage.on`) y llama a `window.__render(estado)`. La escena (script módulo) recibe `fa`, `fb`, `t` (mezcla entre formaciones), `pa`, `pb` (progreso de cada una), `step` (paso continuo de la sección `steps`), `mouse` y `time`.
- Una **formación** es una función `(i, c) => ({ x, y, z, s, yaw, look, label, walk, active, wave, hopL })`. `c.V.w`/`c.V.h` son el ancho/alto visible del mundo en z=0 y `c.u` una unidad que escala con la pantalla; usa siempre fracciones de `c.V` para que funcione en escritorio y celular (`c.V.portrait` cuando el alto supera al ancho). `s: 0` oculta al personaje en su lugar.
- Para agregar una formación: añade la función en `F`, su peso del campo de puntos en `FIELD`, y una sección con ese `data-f`.
- La navegación con teclado usa paradas: el centro de cada sección normal y el centro de cada paso de las secciones fijas.

## Verificación con capturas

`scripts/shoot.mjs` abre Chrome sin ventana por DevTools, hace scroll a cada posición (en unidades de alto de pantalla) y guarda PNG:

```bash
# copia de prueba sin Lenis (Lenis interfiere con scrollTo en Chrome sin ventana)
sed 's#<script src="https://unpkg.com/lenis[^"]*"></script>#&<script>window.Lenis=undefined;</script>#' pagina.html > /tmp/prueba.html
node scripts/shoot.mjs "file:///tmp/prueba.html" ./capturas 1440 900 "0,0,1.7,4.5"
```

- Repite la primera posición: la primera captura tras cargar puede salir a mitad de transición.
- Para saber la posición de cada sección, suma alturas: una sección normal ocupa 1, una fija ocupa su `height` en vh / 100.
- Si en la parte de abajo de la captura sale repetida la parte de arriba, es un artefacto de Chrome sin ventana, no de la página.
- La consola reporta errores de JS; si hay, corrígelos antes de entregar.

## Cosas que ya fallaron (evítalas)

- `overflow-x:hidden` en `body` rompe `position:sticky`; usa `overflow-x:clip` en `main`.
- Textos y personajes en la misma zona: reserva la mitad de arriba para el texto y pon las formaciones abajo (`y` negativo) o al costado.
- Etiquetas que se pisan cuando los personajes están cerca: alterna la altura de las etiquetas o usa nombres cortos.
- Citas o cifras de personas o empresas reales: verifícalas con una fuente antes de ponerlas, y di de dónde salen. No inventes métricas.
- Logos: incrústalos como data URI (base64) para que el archivo funcione solo; las imágenes PNG con fondo blanco quedan bien sobre tarjetas blancas.
- El 3D y las fuentes se cargan de CDN: la página necesita internet. Si el 3D no carga, el texto sigue funcionando.
