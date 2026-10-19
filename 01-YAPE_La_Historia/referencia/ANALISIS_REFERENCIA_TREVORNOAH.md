# ANÁLISIS TÉCNICO Y DE DISEÑO DE REFERENCIA: TREVORNOAH.COM
**Proyecto de referencia para:** 01-YAPE_La_Historia  
**Fecha de análisis:** 15 de Octubre de 2026  
**URL inspeccionada en vivo:** `https://www.trevornoah.com/`  
**Objetivo:** Servir de repositorio analítico de componentes, animaciones, arquitectura y layout para consultar en cualquier momento durante la planeación y desarrollo.

---

## 1. Resumen Ejecutivo de la Experiencia
La web de Trevor Noah (desarrollada en colaboración con Off-Brand Studio) es un referente de **diseño editorial interactivo de alto impacto**. Combina una retícula rigurosa inspirada en diseño de revistas impresas contemporáneas con cinemática digital moderna: inercia de scroll suave, deformaciones WebGL sutiles, microinteracciones táctiles (como cartas y stickers que se despegan) y tipografía grotesca masiva.

---

## 2. Stack Tecnológico Subyacente

- **Smooth Scroll:** **Lenis** (`html.lenis`), motor de inercia que suaviza la aceleración/desaceleración del scroll sin secuestrar ni romper la accesibilidad del scroll nativo.
- **Motor WebGL / Canvas:** Canvas único a pantalla completa (`.webgl_canvas` dentro de `.webgl_wrap`) con un viewport responsive de alta resolución.
- **Arquitectura de Módulos (Dataset Declarativo):**
  - Cada sección y elemento reactivo implementa atributos `data-module="..."` y `data-gl-scene="..."`.
  - Esta separación permite desacoplar el HTML semántico de los renderizadores WebGL y las animaciones de scroll.
- **Tipografía Variable / Custom Fonts:**
  - Familia **Die Grotesk** en múltiples anchos y pesos (`Die Grotesk C`, `Die Grotesk B`, `Die Grotesk D`).
- **Sistema de Capas y Colores:**
  - Fondo Primario Noche: `#1D2440` (`rgb(29, 36, 64)`).
  - Fondo Secundario Carbón: `#2B2B2B` (`rgb(43, 43, 43)`).
  - Texto Primario Marfil/Off-White: `#F9FCF4` (`rgb(249, 252, 244)`).
  - Transparencias y capas glassmórficas limpias en la barra de navegación superior.

---

## 3. Catálogo de Componentes e Interacciones Analizadas

### 3.1. Navegación y Cabecera Flotante (`header_wrap`)
- **Estructura:**
  - Barra superior flotante con backdrop transparente.
  - Logotipo tipográfico a la izquierda.
  - CTA principal directo a la derecha (*"Get Tickets"* en su caso).
  - Gatillo de menú hamburguesa con modal a pantalla completa (`data-module="modal"`, `.menu_wrap.u-modal`).
- **Comportamiento dinámico:**
  - Estados alternos `.is-home` y `.is-default`. Cambia de opacidad y contraste según la sección activa sobre la que navega el usuario.

### 3.2. Hero Monumental y Escena WebGL (`#sectionHero`)
- **Atributos:** `data-intro=""`, `data-gl-scene="hero"`, `data-module="intro"`.
- **Composición:**
  - **Título Display Gigante:** Texto con tipografía ultra-bold con escala que domina más del 60% del alto de la pantalla inicial.
  - **Widget Flotante / Sticker:** Elemento superpuesto (`.widget_wrap`, `.card_peel.is-widget`) con una inclinación sutil que rompe la cuadrícula rígida.
  - **Navegación GL Integrada:** Selector interactivo (`.gl_nav_wrap`) que interactúa con el canvas de fondo.
  - **Progreso Fijo:** Indicador de redes sociales y progreso vertical (`data-module="fixed-progress"`, `--progress: X`) anclado en los bordes.

### 3.3. Sistema de Cartas Apiladas con Despegue (`card_peel`)
- **Módulo:** `data-module="card"`, clases `.card_peel.is-1` hasta `.is-4`.
- **Efecto Visual:**
  - Simula cartas o billetes apilados en abanico.
  - A medida que el usuario hace scroll o pasa el cursor, las cartas cambian de rotación (`transform: matrix(...)`), profundidad Z y efecto de sombra física, revelando información oculta en las capas inferiores.
- **Aplicación para Yape:** Ideal para mostrar la evolución de productos (vouchers de pago, QR, créditos, microseguros) como tarjetas físicas o stickers interactivos.

### 3.4. Transiciones de Sección con Papel Rasgado (`paper-tear`)
- **Módulo:** `data-gl-scene="paper-tear"`, clase `.section.is-transition`.
- **Efecto Visual:**
  - En lugar de cortes rectos o divisores vectoriales genéricos, la separación entre el fondo azul oscuro (`#1D2440`) y el fondo grafito (`#2B2B2B`) es un desgarro de papel orgánico procedural generado por shader en WebGL.
  - Transmite una sensación editorial física y táctil de recorte de periódico/revista.

### 3.5. Revelado Tipográfico Sincronizado (`data-module="split"`)
- **Módulo:** Invocado en encabezados, declaraciones editoriales y citas.
- **Efecto Visual:**
  - Divide los textos en palabras o caracteres individuales (`span`).
  - Al entrar en el viewport con el scroll, cada palabra se desenfoca, rota o asciende con un leve retraso escalonado (stagger).
  - Mantiene legibilidad total y evita el efecto de "texto que parpadea".

### 3.6. Citas Editoriales Flotantes (`hover-float` / `quote_wrap`)
- **Módulo:** `data-gl-scene="quote"`, `data-module="hover-float"`, `.quote_layout`.
- **Efecto Visual:**
  - Gran frase célebre o declaración de impacto.
  - Reacciona levemente al movimiento del ratón con un efecto de parallax orgánico y amortiguado (damped pointer target).
  - Viene acompañada de micro-metadatos periodísticos en el pie (`.quote_meta`): fuente, fecha y medio de publicación.

### 3.7. Footer Editorial Extendido (`#sectionFooter`)
- **Estructura:**
  - Enlaces de navegación en tamaño display masivo.
  - Enlaces secundarios compactos a la par de avisos de copyright y créditos de estudio.
  - Contraste sobrio que cierra la experiencia como la contraportada de un libro.

---

## 4. Matriz de Equivalencias y Adaptación a YAPE: La Historia

| Componente en Trevor Noah | Función Original | Adaptación Estratégica para YAPE |
| :--- | :--- | :--- |
| **Hero Display + WebGL** | Presentación personal del comediante | **"YAPE: DE 0 A 20 MILLONES"**. Tipografía masiva con distorsión de energía morada y cifras dinámicas en tiempo real. |
| **Widget `card_peel`** | Promoción de nuevo especial de Netflix | **El Primer Ticket / QR de Prueba en NovaLab (BCP)**. Tarjeta táctil inclinada interactiva. |
| **Deck de Tarjetas (`card_peel 1-4`)** | Carrusel de medios / especiales | **Las 4 Eras de Yape:** 1. El Laboratorio, 2. El Salto a los Mercados, 3. La Pandemia y el Boom Digital, 4. La Superapp Financiera. |
| **Divisores `paper-tear`** | Separador físico entre capítulos | **Transición tipo Ticket de POS / Recibo Rasgado** que separa los bloques históricos. |
| **Texto `data-module="split"`** | Frases de impacto de comedia | **Manifiestos de Inclusión Financiera**: Frases sobre la muerte del efectivo en las calles peruanas. |
| **Módulo `quote` + `hover-float`** | Cita en People Magazine | **Voz del Fundador / Testimonio del Comerciante**: Testimonio real de un bodeguero o del equipo de innovación del BCP. |
| **Smooth Scroll (Lenis)** | Fluidez cinematográfica en lectura | Navegación pesada pero suave, ideal para una historia interactiva tipo *longform storytelling*. |

---

## 5. Recomendaciones de Implementación para Nuestro Proyecto

1. **Modularidad mediante Datasets:** Adoptar la misma convención de arquitectura limpia:
   - `data-module="lenis"`
   - `data-module="card-peel"`
   - `data-module="text-reveal"`
   - `data-module="paper-divider"`
2. **Micro-interacciones desacopladas:** Usar GSAP ScrollTrigger para controlar los estados del scroll y vincularlos a variables CSS (`--progress`) para que los estilos reaccionen fluidamente sin sobrecargar el hilo de JS.
3. **Optimización de Rendimiento:** Asegurar que los efectos visuales (shaders, rotaciones 3D o capas de canvas) tengan fallback limpio para dispositivos móviles y respeto a `prefers-reduced-motion`.
