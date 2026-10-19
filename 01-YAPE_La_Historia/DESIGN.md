# CONTRATO DE DISEÑO Y DIRECCIÓN DE ARTE (DESIGN.MD)
**Proyecto:** 01-YAPE_La_Historia  
**Concepto Visual:** Moodboard Viviente / Boxed Premium Minimalist Collage & Pop-Brutalism  
**Inspiración:** trevornoah.com + Fanzine Editorial Táctil de Alto Impacto  
**Filosofía:** El lienzo y los controles viven en estricto Blanco y Negro (`B&W`); el color explota exclusivamente a través de los recortes fotográficos, billetes, stickers y el personaje de Yape.

---

## 1. Principios Visuales Inviolables (Constitution of Design)

1. **Monocromo Arquitectónico (Black & White Core):**
   - Toda la estructura de navegación, contenedores ("boxes"), bordes, textos y botones se diseña en una escala estricta de negro, blanco y grises neutros de alta gama.
   - Prohibido teñir los fondos de contenedores con gradientes corporativos genéricos o morados saturados de baja fidelidad.
2. **Color Exclusivo en los Recortes Narrativos (Asset Burst):**
   - El color pertenece a la historia: los billetes reales peruanos (el rosa del billete de S/ 200, el azul de S/ 100), el personaje del smartphone gigante con capa roja y amarilla, y el morado rebelde del logotipo de Yape.
3. **Cajas Delimitadas y Estructura Boxed:**
   - La información se organiza en recuadros limpios con bordes nítidos (`border: 1px solid var(--border)`).
   - Esquinas rectas o con micro-redondeo industrial (`2px` a `4px`). Cero botones pill inflados estilo Web 2.0.
4. **Textura Táctil y Halftone (Impresión Física):**
   - Uso de tramas de semitono / puntos de imprenta (halftone) en brazos, sombras y recortes para reforzar la estética de periódico / fanzine de lujo.
5. **Atmósfera Reactiva por Sección:**
   - El fondo muta de forma sutil según la tensión narrativa del capítulo (desde negro abisal `#080808` hasta carbón grafito `#141414` o blanco papel rasgado `#F4F4F0` en momentos de clímax).

---

## 2. Sistema de Design Tokens (DTCG Specification)

### 2.1. Capa 1: Primitivos (Valores Absolutos)
```css
:root {
  /* B&W Foundation */
  --color-black-pure: #000000;
  --color-black-rich: #080808;
  --color-black-surface: #111111;
  --color-black-elevated: #1a1a1a;
  
  --color-white-pure: #ffffff;
  --color-white-warm: #f6f6f4;
  --color-white-muted: #d0d0ce;
  
  --color-gray-dark: #262626;
  --color-gray-mid: #404040;
  --color-gray-border: #2a2a2a;
  --color-gray-border-light: #e2e2de;
  
  /* Story Assets Accent (Inyectado en los recortes e ilustraciones) */
  --accent-yape-purple: #742284;
  --accent-yape-cyan: #00d2b5;
  --accent-sol-200: #d63353;
  --accent-sol-100: #2979ff;
  --accent-cape-yellow: #f5c400;

  /* Typography Scales */
  --font-display: 'Clash Display', 'Syne', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: 'Inter Tight', 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Geist Mono', monospace;
}
```

### 2.2. Capa 2: Semánticos (Roles Funcionales)
```css
:root {
  /* Surfaces & Backgrounds */
  --bg-main: var(--color-black-rich);
  --bg-surface: var(--color-black-surface);
  --bg-surface-elevated: var(--color-black-elevated);
  --bg-card-paper: var(--color-white-warm);
  
  /* Text & Foreground */
  --text-primary: var(--color-white-pure);
  --text-secondary: var(--color-white-muted);
  --text-inverse: var(--color-black-pure);
  --text-meta: #888888;
  
  /* Lines & Boxes */
  --border-subtle: 1px solid var(--color-gray-border);
  --border-strong: 1px solid var(--color-white-pure);
  --border-paper: 1px solid var(--color-gray-border-light);
  
  /* Buttons & Controls (B&W High Contrast) */
  --btn-bg: var(--color-white-pure);
  --btn-text: var(--color-black-pure);
  --btn-border: 1px solid var(--color-white-pure);
  
  --btn-hover-bg: var(--color-black-pure);
  --btn-hover-text: var(--color-white-pure);
  --btn-hover-border: 1px solid var(--color-white-pure);

  /* Shadows (Táctiles / Físicas para Recortes) */
  --shadow-cutout: 0 16px 36px rgba(0, 0, 0, 0.65), 0 4px 10px rgba(0, 0, 0, 0.4);
  --shadow-sticker: 0 4px 14px rgba(0, 0, 0, 0.45);
  --shadow-box: 4px 4px 0px rgba(255, 255, 255, 0.15); /* Brutalist offset shadow */
}
```

### 2.3. Capa 3: Componentes (Tokens Específicos)
```css
/* Box Widget & Sticky Cards */
.box-widget {
  background-color: var(--bg-surface);
  border: var(--border-subtle);
  border-radius: 2px;
  box-shadow: var(--shadow-box);
}

/* Sticker Tag */
.badge-mono {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 8px;
  border: 1px solid var(--color-gray-mid);
  background: var(--color-black-pure);
  color: var(--color-white-pure);
}
```

---

## 3. Tipografía y Jerarquía Editorial

| Nivel | Fuente | Peso | Tracking | Tamaño (Desktop / Mobile) | Caso de Uso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display (H1)** | `font-display` | 800 / Black | `-0.04em` | `clamp(2.8rem, 6.5vw, 6rem)` | Titular monumental del Hero. |
| **Encabezados de Bloque (H2)** | `font-display` | 700 / Bold | `-0.03em` | `clamp(2rem, 4vw, 3.5rem)` | Títulos de los capítulos 1 al 5. |
| **Subtítulos / Causal Hooks** | `font-display` | 600 / SemiBold | `-0.01em` | `1.35rem / 1.15rem` | Ganchos de atención, "PERO" y "POR ESO". |
| **Cuerpo Narrativo** | `font-body` | 500 / Medium | `0` | `1.125rem / 1rem` | Lectura de scrollytelling en columna limpia. |
| **Data & Métricas KPIs** | `font-mono` | 700 / Bold | `0` | `2.5rem / 2rem` | Cifras clave (S/ 200, 20M, Breakeven). |
| **Labels & Metadatos** | `font-mono` | 400 / Regular | `+0.05em` | `0.75rem (12px)` | Fechas, fuente, artículos de ley y tags. |

---

## 4. Arquitectura Anatómica de Componentes (Collage Interactivo)

### 4.1. The Hero Collage Stage (`#heroStage`)
- **Fondo:** Skyline de ciudad urbana peruana (`edificios01.png` + `edificios02.png`) con filtro semitono/desaturado sutil.
- **Nivel Medio:** Capa de nubes flotantes con parallax desacoplado (`nubes_1.png` a `nubes_5.png`).
- **Nivel Frontal Protagónico:**
  - Personaje recortado de Yape gigante con capa de superhéroe (`yape-persona.png`).
  - Titular recortado en gran formato: *«El imperio que casi muere en 72 horas»*.
  - Billetes flotantes de S/ 100 y S/ 200 que reaccionan a la posición del cursor (`mousemove`).
- **Botón de Exploración (B&W High Contrast):**
  - Caja negra con borde blanco fino y flecha animada: `[ Desliza para saber ↓ ]`.

### 4.2. Scrollytelling Two-Column Box Layout
```
+-------------------------------------------------------------+
| [Header B&W: Logo Yape Minimal + Progreso 00% + Compartir]  |
+-------------------------------------------------------------+
|                                                             |
|   COLUMNA NARRATIVA (Izquierda)    COLUMNA STICKY BOX (Der) |
|   -----------------------------    ------------------------ |
|   Capítulo 01: Majo y 72 Horas     [ CAJA DE RECORTE 01 ]   |
|   Texto fluido editorial...        + Mano con S/ 200        |
|   «...POR ESO buscaron...»         + Gráfica Halftone       |
|   «...PERO chocaron con...»        + Métricas: 20K a 370K   |
|                                    [ Pin durante el bloque] |
|                                                             |
+-------------------------------------------------------------+
|   [ TRANSICIÓN TICKET DE POS / CORTE RASGADO FÍSICO ]       |
+-------------------------------------------------------------+
|   Capítulo 02: El Billete...       [ CAJA DE RECORTE 02 ]   |
|   ...                              + Celular Antiguo        |
|                                    + Timbre de Alerta       |
+-------------------------------------------------------------+
```

### 4.3. Tarjetas Interactivas "Peel & Tilt" (`card_peel`)
- **Estilo:** Tarjeta blanca o carbón con textura de papel offset.
- **Efecto Hover / Drag:** Inclinación sutil 3D (`perspective: 1000px`, `rotateX`, `rotateY`) y sombra física que se aleja al pasar el mouse.
- **Esquina despegada:** Micro-animación que simula un sticker que puedes retirar para ver el dato oculto detrás.

### 4.4. Botones y Controles de Interacción (B&W)
- **Botón Primario:**
  ```css
  .btn-box-primary {
    background: #FFFFFF;
    color: #000000;
    border: 1px solid #FFFFFF;
    padding: 12px 24px;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .btn-box-primary:hover {
    background: #000000;
    color: #FFFFFF;
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0px #FFFFFF;
  }
  ```
- **Botón Secundario / Conector:**
  ```css
  .btn-box-secondary {
    background: transparent;
    color: #FFFFFF;
    border: 1px solid #333333;
    padding: 10px 20px;
    font-family: var(--font-mono);
    font-size: 12px;
  }
  .btn-box-secondary:hover {
    border-color: #FFFFFF;
    background: rgba(255, 255, 255, 0.05);
  }
  ```

---

## 5. Cinemática y Especificación de Animaciones (Motion Specs)

- **Inercia de Scroll (Lenis):**
  - `duration`: 1.25s
  - `easing`: `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` (curva exponencial suave estilo Apple/Awwwards).
- **Revelado Tipográfico (Text Split):**
  - Palabras envueltas en máscaras `overflow: hidden`.
  - Animación: `translateY(110%)` a `translateY(0%)` con stagger de `0.02s` por palabra al entrar al 75% del viewport.
- **Parallax de Recortes Fotográficos:**
  - Billetes y manos: velocidad amortiguada (`y: -80px` a través del scroll del bloque).
  - Nubes de fondo: deriva horizontal lenta constante + parallax vertical sutil.
- **Micro-interacción de Audio (El Sonido de Yape):**
  - En el Bloque 2, al alcanzar el hito del timbre, botón interactivo táctil que reproduce el mítico audio de confirmación de Yape con una onda expansiva en semitono.

---

## 6. Lista de Verificación Pre-Flight de Diseño (Anti-Slop Guardrails)

- [ ] ¿La interfaz base es estrictamente Black & White de alto contraste?
- [ ] ¿Los botones tienen estructura de caja rectangular nítida sin curvaturas infantiles?
- [ ] ¿Los colores saturados quedan reservados exclusivamente para los recortes, billetes y stickers?
- [ ] ¿Todos los textos tienen jerarquía clara con fuentes Grotesk Display y Monoespaciadas?
- [ ] ¿Las imágenes de recortes tienen sombras físicas realistas que transmiten sensación de collage táctil de papel?
