# SPEC: HERO LAYER ADJUSTMENTS & VISUAL EDITOR FIX
**Fecha:** 17 de Octubre de 2026  
**Objetivo:** Separar estrictamente las capas del Hero (`edificios02` al fondo, `yape-persona` al medio y `edificios01` al frente), retirar los billetes de 200 soles y reparar integralmente el editor visual interactivo.

---

## 1. Arquitectura de Capas Estrictas (Z-Index Map)

| Capa | Z-Index | Asset | Rol Visual |
|---|---|---|---|
| **Capa 0** | `z-0` | `fondo-hero-limpio.jpg` | Atmósfera y degradado del cielo |
| **Capa 1** | `z-5` | `nubes_1.png` / `nubes_2.png` | Parallax atmosférico superior |
| **Capa 2** | `z-10` | `edificios02.png` | **Edificios de Fondo:** Skyline lejano con bruma atmosférica |
| **Capa 3** | `z-15` | `yape-persona.png` | **Capa Intermedia:** Smartphone gigante con capa amarilla. Se alza sobre el fondo y se oculta tras el frente |
| **Capa 4** | `z-20` | `edificios01.png` | **Edificios del Frente:** Rascacielos nítidos con alto nivel de detalle, ventanas y textura que cubren los pies de Yape |
| **Capa 5** | `z-25` | `100soles-01.png` | Billete de S/ 100 flotante a la derecha |
| **Capa 6** | `z-30` | Tipografía & HUD | Titular editorial, badges y botones |

---

## 2. Diagnóstico y Corrección del Editor Visual

### Problemas Detectados:
1. **Arrastre nativo del navegador:** Al hacer click en las etiquetas `<img>`, el navegador activaba el arrastre nativo de imágenes ("ghost thumbnail"), cancelando los eventos `mousemove` y `mouseup`.
2. **Bloqueo por superposición:** Al tener ancho completo (`inset-x-0 bottom-0`), `edificios01` (`z-20`) interceptaba todos los clicks en la parte inferior de la pantalla, impidiendo seleccionar o arrastrar `edificios02` (`z-10`).
3. **Corte visual en `edificios01`:** Estaba configurado con `object-top`, mostrando el área transparente superior y ocultando la fachada inferior de los edificios.

### Soluciones Implementadas:
1. **Prevención de Drag Nativo:** Se agregó `draggable={false}` en todas las imágenes y `e.preventDefault() / e.stopPropagation()` en `startDrag`.
2. **Sincronización de Capa Activa:** El estado `activeTab` ahora se comparte entre la pantalla y el cajón del editor. Al seleccionar una pestaña (o hacer click en un elemento), esa capa eleva dinámicamente su `z-index` y muestra un recuadro luminoso cian con etiqueta identificadora.
3. **Alineación de Edificios:** Se corrigió a `object-bottom` en ambas capas de edificios, logrando que los rascacielos se vean completos, nítidos e iluminados de extremo a extremo de la pantalla.
4. **Controles Numéricos y Pasos Rápidos:** Además de los sliders de rango amplio (`-800px` a `+800px`), se añadieron inputs numéricos directos y botones de ajuste fino (`-50`, `-10`, `-1`, `+1`, `+10`, `+50`).

---

## 3. Duplicación en Espejo (Seamless Mirroring) y Parallax Vox

### Arquitectura de Espejo:
- **Tira Continua Panorámica (Triplet):** Cada capa de edificios se compone de 3 segmentos alineados en la base:
  1. `[Normal]`
  2. `[Reflejado scale-x-[-1]]` (la arista derecha del tile 1 se une milimétricamente con la arista derecha del tile 2 sin costuras visibles).
  3. `[Normal]` (la arista izquierda del tile 2 se une con la izquierda del tile 3).
- **Proporciones de Altura:**
  - `edificios02` (Fondo): `h-[38vh] md:h-[48vh]`
  - `edificios01` (Frente): `h-[28vh] md:h-[36vh]`
- **Yape Intermedio:** `bottom: 7%`, lo que sumerge sus pies y piernas de forma natural detrás del skyline frontal mientras su cuerpo, capa amarilla y teléfono se yerguen contra el fondo.

### Animación Vox-Style:
1. **Nubes en Loop Continuo:** Dos pistas independientes que se trasladan infinitamente a `-50%` (`65s` y `45s`) con `nubes_1` a `nubes_5`.
2. **Parallax Cinemático Multiplane:**
   - Cielo: `-8px`
   - Edificios Fondo: `-16px`
   - Yape Persona: `-28px`
   - Edificios Frente: `-48px`
   - Billete 100: `+24px` con inclinación de `6°`

---

## 4. Camuflaje Atmosférico: Neblinas, Degradados y Blending de Aristas

### Capas Implementadas:
1. **Capa 2.5 — Neblina Intermedia (`z-12`):**
   - Velo translúcido con `mix-blend-screen` y gradiente vertical que suaviza la base de `edificios02` (fondo) antes de topar con `yapePerson` y `edificios01`.
   - Incorpora una tira de niebla difusa en deriva horizontal continua (`38s` loop con GSAP).
2. **Capa 4.5 — Neblina de Cimientos y Fade al Piso (`z-22`):**
   - Fundido profundo `linear-gradient(to top, #080808, transparent)` que desvanece suavemente los cimientos de `edificios01` en el negro de la escena, eliminando cualquier corte plano o arista dura inferior.
   - Pista de niebla de suelo a contraderiva (`28s` loop inverso) para romper la estática.
3. **Capa 5.5 — Viñeta Lateral y Blending de Bordes (`z-28`):**
   - Gradiente radial central que concentra la luz en el héroe.
   - Gradientes laterales izquierdo y derecho que funden los extremos panorámicos hacia los bordes de la pantalla.

---

## 5. Aislamiento Puro del Hero y Nubes Sobre Yape

### Modificaciones Realizadas:
1. **Nubes Sobre Yape (`z-18`):**
   - Se añadió una pista continua de nubes intermedias (`nubes_2.png` y `nubes_4.png`) que flotan a la altura del pecho y capa de Yape con `mix-blend-screen` y opacidad del `60%`, cruzando por delante de él en un loop dinámico de `32s`.
2. **Eliminación del Billete de S/ 100:**
   - Retirado por completo del JSX, parallax y pestañas del editor visual.
3. **Limpieza Integral de UI Externa y Metadatos:**
   - En [`App.tsx`](file:///home/laptop/Documentos/system-newsletter/01-YAPE_La_Historia/app/src/App.tsx): Se removieron la barra de navegación superior (Navbar), la sección placeholder del Bloque 1 y el Footer.
   - En [`HeroStage.tsx`](file:///home/laptop/Documentos/system-newsletter/01-YAPE_La_Historia/app/src/components/organisms/HeroStage.tsx): Se removieron la barra superior de metadatos (`BLOQUE 00`), el tag de advertencia (`Pattern Interrupt`), el badge `MVP // 2016` sobre Yape y la barra inferior de navegación/CTA.
   - Se conservaron intactos el titular editorial monumental (**"EL IMPERIO QUE CASI MUERE EN 72 HORAS:"**) y el párrafo del cuerpo con máxima legibilidad.
