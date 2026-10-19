# ESPECIFICACIÓN DEL EDITOR VISUAL EN VIVO (SPEC_VISUAL_EDITOR.MD)
**Componentes involucrados:** `HeroStage.tsx`, `VisualControls.tsx`, `visualConfig.ts`  
**Objetivo:** Permitir al usuario mover, escalar, rotar y reposicionar manualmente cualquier elemento del Hero directamente en el navegador, persistiendo los cambios y permitiendo sincronizarlos con el código fuente.

---

## 1. Funcionamiento del Modo Editor

1. **Gatillo de Activación:**
   - Botón flotante inferior derecho: `[ Editor Visual (Mover Elementos) ]`.
   - Al hacer clic, se activa el modo de edición y se abre el panel lateral `VisualControls`.

2. **Interacción Manual Directa (Drag & Drop en Canvas):**
   - Todos los elementos interactivos se rodean de un marco visual de selección:
     - `yapePerson`: Smartphone gigante con capa.
     - `billete200`: Mano con abanico de 200 soles.
     - `billete100`: Billete de 100 soles.
     - `edificiosFront`: Skyline frontal nítido.
     - `edificiosBack`: Skyline lejano con neblina.
     - `textBlock`: Bloque editorial con titular y subtítulo.
   - Puedes hacer clic directamente sobre cualquiera de ellos y **arrastrarlo con el cursor o el dedo (touch)** a la posición exacta que desees.

3. **Panel Lateral de Control Fino (Sliders):**
   - Pestañas para cada elemento con controles numéricos:
     - **Posición Horizontal (X)**
     - **Posición Vertical (Y)**
     - **Escala (0.3x a 2.5x)**
     - **Rotación (-45° a +45°)**
     - **Opacidad (10% a 100%)**

4. **Persistencia y Sincronización con el Agente:**
   - **Guardado Automático en LocalStorage:** Cualquier movimiento que hagas en el navegador queda guardado y no se pierde al recargar.
   - **Botón `[ Copiar Config ]`:** Copia el objeto JSON con las coordenadas exactas al portapapeles. Solo me pegas ese JSON aquí en el chat y yo lo dejo fijado permanentemente en el código base.
   - **Botón `[ Reset ]`:** Regresa a los valores iniciales por defecto en un clic.
