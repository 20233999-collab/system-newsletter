# ESPECIFICACIÓN TÉCNICA DEL HERO COLLAGE (SPEC_HERO.MD)
**Componente:** `HeroStage.tsx` (Organismo)  
**Objetivo Visual:** Recrear la escena de la referencia con profundidad de 3 planos urbanos, degradado de cielo atmosférico y `yape-persona` centrado emergiendo entre las capas de rascacielos.

---

## 1. Arquitectura de Capas de Profundidad (Z-Index Blueprint)

```
[ FRONT / Z-30 ]  Titular Monumental H1 + Textos + Barra de progreso / Meta
        │
[ Z-25 ]          Billetes flotantes interactivos (S/ 200 y S/ 100 con mouse tilt)
        │
[ Z-20 ]          PLANTO FRONTAL: `edificios01.png` (Rascacielos oscuros con textura nítida)
        │
[ Z-15 ]          PROTAGONISTA: `yape-persona.png` (Smartphone gigante con capa emergiendo entre ambos edificios)
        │
[ Z-10 ]          PLANO MEDIO: `edificios02.png` (Siluetas distantes con neblina urbana / haze)
        │
[ Z-5 ]           NUBES: `nubes_1.png` a `nubes_5.png` con deriva sutil
        │
[ BACK / Z-0 ]    FONDO CIELO: Degradado atmosférico (`fondo-hero-limpio.jpg` con blend radial hacia negro base)
```

---

## 2. Requerimientos de Composición Visual

1. **El Fondo (Cielo con Degradado Atmosférico):**
   - Utiliza la textura de cielo real (`fondo-hero-limpio.jpg`) combinada con un gradiente vertical que se funde suavemente al negro profundo (`#080808`) en la parte superior e inferior, manteniendo el marco monocromático de la web.
2. **El Dúo de Edificios (`edificios01` y `edificios02`):**
   - `edificios02.png` se ubica al fondo con menor opacidad y escala más amplia para dar la sensación de una metrópoli lejana.
   - `edificios01.png` se ubica en primer plano, con mayor nitidez y detalle arquitectónico.
3. **El Protagonista (`yape-persona`):**
   - Se posiciona **físicamente intercalado en medio de las dos capas de edificios**:
     - Por detrás de `edificios01.png` (para que los techos y antenas frontales lo tapen parcialmente en sus pies, simulando que camina como un coloso entre los edificios).
     - Por delante de `edificios02.png` (sobresaliendo por encima de la silueta lejana y las nubes).
4. **Cinemática Reactiva (Parallax Diferencial con el Mouse):**
   - Capa cielo / nubes: movimiento mínimo (factor 0.01).
   - `edificios02` (fondo): movimiento suave inverso al cursor.
   - `yape-persona`: inclinación sutil y oscilación vertical.
   - `edificios01` (frente): mayor desplazamiento de parallax para maximizar el efecto tridimensional.
   - Billetes: flotabilidad ágil que acompaña el cursor.

---

## 3. Escenarios Gherkin de Verificación

```gherkin
Scenario: Carga y orden de profundidad en el Hero
  Given que el componente HeroStage se renderiza en pantalla
  Then "fondo-hero-limpio" debe estar al fondo con un fundido suave hacia negro
  And "edificios02.png" debe renderizarse detrás de "yape-persona.png"
  And "yape-persona.png" debe posicionarse en medio
  And "edificios01.png" debe renderizarse al frente tapando la base de "yape-persona.png"
  And el titular "EL IMPERIO QUE CASI MUERE EN 72 HORAS" debe permanecer legible y nítido por encima de todas las capas
```
