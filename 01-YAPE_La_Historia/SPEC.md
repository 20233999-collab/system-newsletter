# ESPECIFICACIÓN FUNCIONAL Y TÉCNICA (SPEC.MD)
**Proyecto:** 01-YAPE_La_Historia  
**Metodología:** Spec-Driven Development (SDD) & Atomic Design  
**Fase Inicial:** Milestone 1 — Navbar Minimalista + Hero Collage Interactivo (Proof of Concept Visual)  
**Stack Definido:** Vite + React (TypeScript) + Tailwind CSS + GSAP (ScrollTrigger) + Lenis + Lucide Icons

---

## 1. Visión y Alcance del Milestone 1

El objetivo del Milestone 1 es validar la dirección de arte **"Boxed Premium Minimalist Collage & Pop-Brutalism"** construyendo el entorno base, el **Navbar flotante B&W** y el **Hero Stage interactivo con collage de recortes**, permitiendo al usuario visualizar el estilo, la fluidez del movimiento (desktop y mobile) y calibrar las físicas antes de escalar al resto de secciones.

---

## 2. Requerimientos Funcionales por Componente

### 2.1. Navegación Flotante Minimalista (`Navbar`)
- **Estructura Boxed:**
  - Barra superior flotante con fondo negro puro/translúcido (`rgba(8, 8, 8, 0.85)`), backdrop-filter blur de 12px y borde inferior sutil de 1px (`#262626`).
  - **Identificador de Marca:** Logotipo minimalista o texto monoespaciado `[ YAPE // 01. LA HISTORIA ]`.
  - **Indicador de Progreso:** Tag en la barra que muestra el porcentaje de lectura (`00%` a `100%`) sincronizado con el scroll.
  - **Botón de Acción (B&W High Contrast):** Botón estilo caja rectangular `[ COMPARTIR CASO ]` o `[ EXPLORAR ]` con inversión de color en hover.
  - **Responsive:** En mobile se reduce a logo + botón compacto sin saturar el viewport.

### 2.2. Hero Collage Interactivo (`HeroStage`)
- **Estructura en Capas Profundas (Z-Index Hierarchy):**
  1. **Capa 0 (Fondo Urbano):** Silueta / skyline de edificios (`edificios01.png` + `edificios02.png`) con filtro semitono desaturado.
  2. **Capa 1 (Atmósfera):** Nubes recortadas (`nubes_1.png` a `nubes_5.png`) con deriva continua sutil.
  3. **Capa 2 (Titular Monumental H1):** Texto display grotesco en caja con máscara de revelado (`«El imperio que casi muere en 72 horas...»`).
  4. **Capa 3 (Héroe Recortado):** Smartphone Yape gigante con capa de superhéroe (`yape-persona.png`) recortado sin fondo.
  5. **Capa 4 (Billetes Flotantes):** Recortes de billetes de 100 y 200 soles (`100soles-01.png`, `mano-200soles.png`) orbitando la composición.
  6. **Capa 5 (Stickers & Widgets Boxed):** Etiqueta tipo advertencia: `[ ADVERTENCIA: DÍA 3 // 0 USUARIOS ]`.
  7. **Capa 6 (Call to Action Hero):** Botón rectangular interactivo: `[ ¿QUÉ PASÓ EL TERCER DÍA? ↓ ]`.

---

## 3. Escenarios de Comportamiento Gherkin (Criterios de Aceptación)

### Escenario 1: Entrada y Carga Inicial del Hero
```gherkin
Given que el usuario entra a la web en desktop o mobile
When la página termina de cargar
Then el motor de scroll Lenis se inicializa de forma suave
And el titular H1 se revela mediante una máscara tipográfica escalonada
And las capas de recortes (Yape gigante, edificios y billetes) hacen una entrada escalonada con rebote amortiguado
```

### Escenario 2: Interacción con el Cursor (Mouse Parallax en Desktop)
```gherkin
Given que el usuario está en el Hero Stage en un dispositivo de escritorio
When el usuario mueve el cursor por la pantalla
Then los billetes flotantes se desplazan con mayor aceleración hacia la posición del cursor (factor 0.05)
And el personaje Yape gigante se inclina sutilmente (rotación 3D máxima de +/- 4 grados)
And el fondo de edificios se mueve en dirección contraria con menor factor (factor -0.015) para generar profundidad
```

### Escenario 3: Comportamiento en Dispositivos Móviles (Touch & Fluidity)
```gherkin
Given que el usuario visualiza la web desde un smartphone
When se renderiza el Hero
Then los elementos del collage se reordenan automáticamente en una composición vertical equilibrada
And el efecto de mouse parallax se desactiva para no comprometer el rendimiento de la batería ni causar tirones
And el botón de acción Hero permanece accesible con área táctil mínima de 48px
```

### Escenario 4: Gatillo de Scroll hacia la Historia
```gherkin
Given que el usuario se encuentra en el Hero
When el usuario hace clic en el botón "[ ¿QUÉ PASÓ EL TERCER DÍA? ↓ ]" o desliza con el scroll
Then Lenis ejecuta una animación de desplazamiento suave (smooth scroll) hacia el Bloque 1
And los billetes flotantes del Hero ascienden y se desvanecen con parallax coordinado
```

---

## 4. Estrategia de Atomic Design para los Componentes

Para permitir escalar ordenadamente hacia las siguientes secciones, los componentes se modularizan así:

- **Átomos:**
  - `BoxButton`: Botón rectangular B&W con hover brutalista desplazado.
  - `BadgeMono`: Etiqueta técnica monoespaciada para metadatos y fechas.
  - `HalftoneImage`: Envoltorio de imagen con sombra compuesta táctil y efecto opcional de trama.
- **Moléculas:**
  - `ProgressBar`: Indicador de avance de lectura con contador numérico.
  - `HeroHeadline`: Encabezado display con tipografía grotesca y máscara de revelado.
  - `FloatingCutout`: Recorte fotográfico con propiedades de parallax y tilt 3D.
- **Organismos:**
  - `Navbar`: Cabecera global con logo, progreso y acciones.
  - `HeroStage`: Escenario completo compuesto por el collage multicapa y CTA.

---

## 5. Criterios de Aceptación Inmutables (Definition of Done)
1. El proyecto compila sin errores de TypeScript (`"strict": true`).
2. La estética cumple al 100% el contrato `DESIGN.md` (interfaz B&W de alto contraste, color concentrado en los recortes).
3. 60 FPS estables en la animación de parallax e inercia de scroll.
4. Totalmente adaptable y fluido en mobile.
