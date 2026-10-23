# Patrones de sección

Cada patrón es una `<section>` con su `data-f` (formación 3D). Copia el bloque desde `template/index.html` y cambia el texto.

| Patrón | `data-f` | Para qué sirve | Texto |
|---|---|---|---|
| Portada | `hero` | Presentar la idea. Los personajes rodean el título y caen rebotando al cargar. | Eyebrow + h1 de 2 líneas (la 2ª en degradé) + 1 línea |
| Frase que se ilumina | `parade` | Una frase de 12–20 palabras que se enciende palabra por palabra mientras los personajes caminan abajo. Sección fija de 240vh. | Solo la frase, con `data-words` |
| Pasos | `steps` | Un proceso o lista de 3–8 pasos. El paso activo queda al frente y salta; los demás se alejan a los lados con su etiqueta. Sección fija. | Número + h3 + 1 línea por paso |
| Grilla con etiquetas | `grid` | Mostrar todos los roles/actores con su nombre. | Eyebrow + h2 |
| Ronda | `ring` | Ciclo o repetición ("Código. Test. Repetir."). Los personajes giran alrededor del texto. | h2 + 1 línea + chips |
| Cierre | `party` | Llamado a la acción. Los personajes saltan en ola. | Eyebrow + h2 + chips |

## Ideas de guion que funcionan

1. **Verdad simple** (portada): qué proponemos, en 3–6 palabras.
2. **El problema / antes**: cómo era, con un enemigo claro (traspasos, lentitud, complejidad).
3. **Cómo debe ser**: el nuevo flujo en pasos.
4. **Tranquilidad / control**: qué se mide y quién decide.
5. **Prueba**: cifras o citas verificadas, con su fuente en el eyebrow.
6. **Quiénes**: las personas y roles, con nombre.
7. **Cierre abierto**: invitar a sumarse, no solo "gracias".

## Recetas de formaciones nuevas

Todas devuelven `{ x, y, z, s, yaw, look, label, walk, active, wave, hopL }` (lo que falte vale 0).

- **Fila al pie**: `x = (i/(N-1) - .5) * c.V.w*.8`, `y = -c.V.h*.36`, `s = c.u*.26`.
- **Columna a la derecha** (texto a la izquierda): `x = c.V.w*.28`, `y = (i - (N-1)/2) * c.u*.8`.
- **Arco detrás de alguien**: `ang = PI*(.1 + .8*i/(N-1))`, `x = cos(ang)*R`, `y = y0 + sin(ang)*R*.4`, `z = -1`.
- **Uno solo al frente** (los demás ocultos): el elegido con `s` grande y `wave: 1`; el resto `s: 0` en la misma posición para que aparezca/desaparezca en su lugar.
- **Dentro de una caja**: calcula puntos locales y gíralos con `new THREE.Euler(tilt, yaw, 0, 'XYZ')`; usa `pitch: tilt` para que se paren sobre la cara inclinada.

En celular (`c.V.portrait`) achica `s`, usa 3 columnas en vez de 5 y baja las formaciones (`y` más negativo) para dejar arriba el texto.
