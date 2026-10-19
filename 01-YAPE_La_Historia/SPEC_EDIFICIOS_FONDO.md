# SPEC: EDIFICIOS DE FONDO (PANORAMA COMPLETO DE ALTA DEFINICIÓN)
**Componente:** `HeroStage.tsx` (`edificiosBack`)  
**Fecha:** 16 de Octubre de 2026  
**Imagen Base de Referencia:** `Captura desde 2026-10-15 19-46-48.png` + `fondo-hero-01.jpg` (2752×1536 px)

---

## 1. Problema Identificado y Resuelto
- **Problema previo:** La imagen anterior de edificios se veía recortada en los costados, con siluetas simplificadas que no abarcaban todo el ancho de pantalla y con un tamaño excesivo por edificio que reducía la escala visual de la metrópoli.
- **Solución implementada:** Se extrajo el panorama completo ultra ancho de 2752 px con corte nítido contra el cielo, mayor iluminación y definición natural de ventanas, fachadas y antenas.

---

## 2. Requerimientos de Diseño y Comportamiento

1. **Cobertura Horizontal Completa (Full Width):**
   - La capa de edificios de fondo ocupa el `100vw` completo sin cortes laterales, adaptándose tanto a pantallas panorámicas (ultrawide) como a laptops y móviles.
2. **Escala y Cantidad de Edificios:**
   - Edificios con menor escala relativa (más pequeños individualmente) para mostrar **mucha mayor cantidad y densidad urbana**, exactamente como se aprecia en la captura de referencia.
3. **Tratamiento Visual Realista:**
   - Iluminación natural realzada (+15% brillo, +10% contraste), sin filtros opacos ni siluetas grises planas.
4. **Interacción con el Editor Visual:**
   - El usuario puede regular la altura base, posición vertical (Y), escala y opacidad directamente desde el panel del **Editor Visual** o arrastrando con el cursor.
