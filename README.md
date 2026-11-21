# Efectos de audio para Resolume Wire

Efectos audiovisuales reactivos al audio, creados por **Fereachlv** y validados con Resolume Wire 7.22.5:

- **Visión Psicodélica**: distorsión psicodélica con movimiento automático o por sonido, respuesta suavizada, inversión gradual durante pausas y detección adaptativa de graves.
- **Ondas de Agua**: genera hasta ocho ondas de agua independientes a partir de ataques de kick o de un disparo manual.
- **Pixel Tension**: convierte el video en pixel art durante subidas de energía musical. La pixelación también responde a subidas suaves, se sostiene durante el tramo y cede al entrar el golpe. [Guía](effects/Pixel%20Tension/LEEME.md) · [Descargar `.cwired`](effects/Pixel%20Tension/Pixel%20Tension.cwired?raw=true)

Los archivos `.wire` son editables. Los `.cwired` en [`effects/`](effects/) y en [Releases](https://github.com/jlozoya/resolume-wire-audio-effects/releases) están compilados y listos para instalar.

## Requisitos

- Resolume Arena o Avenue compatible con efectos compilados por Wire 7.22.5.
- Resolume Wire 7.22.5 para abrir, modificar o volver a compilar los proyectos.
- Una fuente de audio configurada en Resolume para usar la respuesta automática.

## Instalación rápida

1. Descarga el `.cwired` del efecto que quieras usar.
2. En Arena o Avenue, abre **Sources > Effects** y usa **Reveal in Finder/Explorer** sobre cualquier efecto de Wire para localizar la carpeta de efectos del usuario. También puedes arrastrar cada `.cwired` a Resolume.
3. Copia los `.cwired` en esa carpeta y reinicia Resolume si no aparecen inmediatamente.
4. Busca los efectos por sus nombres completos y aplícalos a un clip, una capa o la composición.

Los `.cwired` contienen los recursos necesarios. No es necesario copiar por separado la carpeta `Resource` para usarlos. Esa carpeta sí debe permanecer junto al `.wire` cuando se edita el proyecto en Wire.

## Integración recomendada

### Cadena de efectos

Los efectos procesan una imagen o video de entrada. Para combinar Visión Psicodélica y Ondas de Agua, usa esta cadena:

```text
Clip o capa con video
  → Visión Psicodélica
  → Ondas de Agua
  → salida
```

Este orden crea primero el movimiento y color psicodélico y después deforma el resultado con ondas. Invierte el orden si quieres que la distorsión psicodélica también afecte los anillos.

Para reducir carga de GPU, aplícalos a una capa o a la composición cuando varias fuentes deban compartir el mismo resultado, en vez de repetirlos en cada clip.

### Audio

1. En Resolume, selecciona la fuente correcta en **Preferences > Audio** y confirma que el medidor responda.
2. Usa una señal limpia y sin clipping. Si el audio viene de otro programa en Windows, una ruta virtual estéreo a 48 kHz suele ser más estable.
3. Activa **Por sonido** en Visión Psicodélica.
4. En Ondas, activa temporalmente **Mostrar diagnóstico** para calibrar el detector y apágalo durante la presentación.

Una ruta de audio recomendada es una salida auxiliar o envío dedicado desde el mezclador/DJ software. Así puedes ecualizar la señal de análisis sin cambiar el audio del público. Evita alimentar el detector desde un micrófono de ambiente si hay mucho rebote o ruido de sala.

### Calibración de Ondas de Agua

Empieza con los valores incluidos y ajusta en este orden:

1. **Sensibilidad kicks**: súbela sólo hasta que la barra azul del diagnóstico responda claramente.
2. **Umbral transitorio**: súbelo en pasos de 0.005 si hay falsos disparos; bájalo si omite golpes claros.
3. **Exigencia de ataque**: súbela para evitar disparos sobre graves sostenidos; bájala si deja de reconocer kicks encima de un subgrave continuo.
4. **Intervalo mínimo (ms)**: 180 ms funciona bien como punto de partida. Bájalo para ritmos muy rápidos; súbelo si detecta dobles golpes.
5. **Intensidad visual máxima**: ajusta sólo la deformación visual; no mejora la detección.

El botón **Disparar onda de prueba** permite revisar la parte visual sin audio.

### Calibración de Visión Psicodélica

- **Automático** mantiene movimiento constante.
- **Por sonido** hace que la energía grave avance y module los patrones.
- Con ambos desactivados se detienen los relojes del efecto.
- **Fluidez del sonido (s)** controla la suavidad de aceleración y caída; 0.30 s es un buen inicio.
- **Espera sin kicks (s)** define cuándo comienza la inversión gradual durante una pausa.
- Si necesitas ahorrar GPU, deja **Separación RGB**, **Respuesta al movimiento** o **Estelas** en cero cuando no aporten a la escena; el shader omite trabajo asociado en esos casos.

## Edición en Wire

Cada proyecto mantiene esta estructura:

```text
Nombre del efecto/
├── Nombre del efecto.wire
├── Nombre del efecto.cwired
└── Resource/
    └── ISF/
        └── shaders del efecto
```

Abre el `.wire` sin moverlo fuera de su carpeta. Después de modificarlo, usa **Patch > Compile…** y prueba el nuevo `.cwired` en una escena de respaldo antes de reemplazar una versión usada en producción.

## Pruebas incluidas

El detector de Ondas incluye validación estructural y simulaciones matemáticas. Desde la raíz del repositorio:

```powershell
node ".\effects\Ondas de Agua\QA\validate-kick-wire.mjs"
node ".\effects\Ondas de Agua\QA\test-kick-detector-v2.mjs"
```

La simulación no sustituye una prueba con la mezcla, ganancia y ruta de audio reales.

## Limitaciones

- La FFT no distingue instrumentalmente un kick de un bajo percusivo. Para pulsos estrictamente regulares, MIDI Clock o Transport Beat puede ser más determinista, aunque no reconoce silencios ni patrones irregulares.
- El rendimiento depende de la resolución, GPU y valores usados. Las optimizaciones del shader están verificadas en código, pero no se afirma un porcentaje universal de mejora.
- Antes de una presentación, conserva una copia del `.cwired` anterior y prueba la ruta completa de audio y video.

## Versiones

La release `v1.0.0` contiene las primeras versiones públicas compiladas de ambos efectos. Consulta [CHANGELOG.md](CHANGELOG.md) para el detalle.

## Autor

Fereachlv.

