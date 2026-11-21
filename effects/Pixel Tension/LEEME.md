# Pixel Tension

Efecto de pixel art para los momentos de tensión musical. Cuando sube la energía de graves y medios, aparecen bloques cuadrados, una paleta reducida y tramado. Con los ajustes iniciales, el efecto cede al entrar el golpe y se desvanece cuando el nivel se estabiliza.

## En Resolume Arena o Avenue

1. Carga **Pixel Tension.cwired** y añade **Pixel Tension** a un clip o capa.
2. En **Spectrum In**, elige la fuente de audio que quieres seguir. Usa **Composition** para la mezcla de Resolume o **External** para una entrada de audio configurada en la aplicación.
3. Deja **Prueba manual** en **0** para seguir la música. Súbela a **1** para ver el acabado completo mientras ajustas los píxeles y el color.
4. La respuesta detecta subidas más suaves y sostiene la pixelación durante más tiempo. **Umbral del golpe** empieza en **0.60**. Súbelo si la pixelación se corta antes del golpe y bájalo si persiste durante el golpe. Aumenta **Sensibilidad** si las subidas suaves apenas se ven.

| Control | Qué cambia |
|---|---|
| Cantidad | Intensidad máxima de la mezcla con el video original. |
| Filas de píxeles | Menos filas producen bloques más grandes. |
| Niveles de color | Menos niveles producen una paleta más reducida. |
| Tramado | Intensidad del patrón de color entre bloques. |

La zona verde de la referencia se interpretó como una subida de energía moderada antes del golpe. Los niveles dependen de la fuente y la ganancia del audio.

## En Resolume Wire

Abre **Pixel Tension.wire** con la carpeta **Resource** al lado. El compilado incluye el shader. Se comprobó en Wire 7.22.5 sobre Test Card, con pixelación manual activa y con la salida original al devolver el control a cero.

Autor y proveedor **Fereachlv**.
