---
exported: 2026-10-15T21:43:28.684Z
source: NotebookLM
type: report
title: "[SKILL] Software Engineer: Buenas practicas de desarrollo de software"
---

# [SKILL] Software Engineer: Buenas practicas de desarrollo de software

Exported at: 15/10/2026, 4:43:28 p. m.

---

# Manual Maestro de Ingeniería Web y Desarrollo Asistido por IA

* * *

## 1\. Gobernanza Previa al Código y Contexto para Agentes de IA

### 1.1. Arquitectura de Archivos de Contexto y Taxonomía de Formatos

En la ingeniería de software asistida por inteligencia artificial, la inyección de contexto persistente y bajo demanda determina la precisión sintáctica y semántica de la generación de código. Los entornos de desarrollo en 2026 utilizan una taxonomía bien definida de archivos de contexto activos y pasivos para gobernar el comportamiento de los modelos de lenguaje (LLM).

-   `AGENTS.md`: Especificación abierta y estándar agnóstico de repositorio colocada en la raíz del proyecto. Proporciona contexto ambiental pasivo (_"cómo codificamos"_) en Markdown plano sin necesidad de metadatos complejos o frontmatter YAML obligatorio. Actúa como el estándar universal inter-herramientas (_cross-tool standard_) soportado por más de 20 plataformas y entornos de desarrollo.
-   `.cursor/rules/\*.mdc`: Evolución del formato monolítico heredado `.cursorrules` (actualmente en desuso). Organizado como una estructura de directorio mediante componentes Markdown (`.mdc`) enriquecidos con frontmatter YAML explícito (`alwaysApply`, `globs`, `description`). Permite desacoplar y adjuntar reglas condicionales según patrones de archivos (_glob patterns_).
-   `CLAUDE.md`: Archivo de configuración persistente propio del ecosistema Anthropic Claude Code (ubicado en la raíz del proyecto o en `~/.claude/CLAUDE.md`). Optimizado para definir preferencias de comunicación, comandos de compilación/pruebas y convenciones operativas específicas del agente CLI de Anthropic.
-   `SKILL.md`: Unidad modular e invocable de habilidades orientadas a tareas (_"qué puede hacer el agente"_). Estructurada dentro de directorios (`.agents/skills/<skill-name>/SKILL.md` o `~/.claude/skills/`) que empaquetan procedimientos, scripts ejecutable y plantillas. Se carga mediante _despliegue progresivo_ (_progressive disclosure_), actuando como un verbo invocable bajo demanda, a diferencia de las reglas pasivas o adjetivos ambientales.

| Formato | Ámbito | Mecanismo de Carga | Soporte de Herramientas | Caso de Uso Principal |
| --- | --- | --- | --- | --- |
| AGENTS.md | Proyecto (raíz o subdirectorios) | Pasivo (carga continua automática) | Universal (Claude Code, Cursor, OpenAI Codex, GitHub Copilot, VS Code, Aider, Zed, Jules, Amp, Factory) | Estándar de gobernanza repositorio-agnóstico y reglas globales de arquitectura. |
| .cursor/rules/*.mdc | Proyecto o subdirectorio específico | Pasivo, Auto-Attached por Glob, Solicitado por Agente o Manual (@mention) | Exclusivo de Cursor (IDE y CLI) | Reglas condicionales con filtrado fino por rutas de archivos (ej. apps/web/**). |
| CLAUDE.md | Personal (~/.claude/) o de Proyecto | Pasivo (carga continua automática) | Claude Code / Ecosistema Anthropic | Preferencias individuales de interacción, estilos de respuesta y comandos del ecosistema Claude. |
| SKILL.md | Personal, Proyecto o Global (.agents/skills/) | On-Demand (activación por coincidencia de tarea o invocación /skill) | Multi-agente (Claude Code, Codex CLI, Cursor, Copilot, Gemini CLI, Windsurf, Amazon Q) | Procedimientos complejos, repetibles y parametrizados (ej. auditorías, releases, análisis de diffs). |

* * *

### 1.2. Evaluación Empírica de Efectividad del Contexto

La evaluación cuantitativa del rendimiento de los archivos de contexto demuestra que la entrega pasiva e incondicional supera de manera sistemática a los mecanismos de selección estocástica e inferencia bajo demanda.

Resultados de la Suite de Evaluación de Vercel (APIs de Next.js 16)

Vercel diseñó un entorno de evaluación estricto enfocado en APIs de Next.js 16 ausentes en el conjunto de entrenamiento base de los modelos (`connection()`, `'use cache'`, `cacheLife()`, `forbidden()`). Los resultados comparativos demuestran la superioridad del contexto pasivo:

| Configuración | Tasa de Aprobación | Diferencia vs Baseline |
| --- | --- | --- |
| Baseline (sin documentación) | 53% | — |
| Skill por defecto (comportamiento base) | 53% | +0pp |
| Skill + instrucciones explícitas | 79% | +26pp |
| AGENTS.md docs index (índice comprimido de 8 KB) | 100% | +47pp |

_Análisis del sesgo de decisión:_ En la configuración de _Skill por defecto_, el agente omitió invocar la habilidad disponible en el **56% de los casos evaluados**. La presencia de un índice comprimido de documentación de 8 KB embebido directamente en `AGENTS.md` suprimió la toma de decisión estocástica del agente, garantizando una tasa de éxito del 100%.

Hallazgos Críticos del Estudio de ETH Zurich

El estudio empírico _Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?_ (arXiv:2602.11988; Gloaguen et al.) analizó la efectividad técnica de los archivos de contexto en benchmarks de ingeniería SWE-bench y repositorios de producción:

1.  **Incremento Ineficiente de Costos por Visión General:** La inclusión de resúmenes arquitectónicos teóricos, diagramas de flujo y listados descriptivos de archivos incrementa el costo de inferencia en más de un **20% en promedio** sin ofrecer ninguna mejora estadísticamente significativa en la tasa de resolución de tareas.
2.  **Acatamiento Seleccionado de Instrucciones:** Los agentes acatan con precisión quirúrgica las **restricciones directas, mandatos de compilación y comandos de prueba**; por el contrario, los resúmenes genéricos degradan la atención dentro de la ventana de contexto.
3.  **Optimización de Contenido:** Para maximizar la relación costo-beneficio en la inferencia, los archivos de contexto deben limitarse estrictamente a políticas de linters, comandos de ejecución de CI/CD, restricciones de seguridad y patrones de diseño no convencionales, omitiendo explicaciones conceptuales del código fuente.

* * *

### 1.3. Matriz de Compatibilidad, Precedencia y Configuración Multi-Herramienta

La coexistencia de múltiples agentes en el mismo repositorio requiere comprender la lógica exacta de resolución y jerarquía de archivos.

```
{
  "pluginConfigs": {
    "agents-md@builtin": {
      "options": {
        "instructionFiles": "claude-md-and-agents-md"
      }
    }
  },
  "context": {
    "fileName": ["AGENTS.md", "CONTEXT.md", "GEMINI.md"]
  }
}
```

Lógica de Resolución y Reglas de Precedencia por Entorno

-   **Claude Code (v2.1.277 / v2.1.281 en adelante):**
    -   Si existe únicamente `AGENTS.md` (y ningún `CLAUDE.md`, `.claude/CLAUDE.md` o `CLAUDE.local.md` en o sobre el directorio de trabajo), Claude Code lee `AGENTS.md` por defecto.
    -   Si coexisten `CLAUDE.md` y `AGENTS.md`, `CLAUDE.md` **invalida y suprime por completo** la lectura de `AGENTS.md`.
    -   Para leer ambos archivos simultáneamente, se debe ejecutar `/config` y establecer **Project instructions** en `claude-md-and-agents-md`, o incluir la importación explícita `@AGENTS.md` dentro de `CLAUDE.md`.
    -   `CLAUDE.local.md` (incluso sin rastrear en Git) suprime silenciosamente la lectura de `AGENTS.md` para ese desarrollador.
    -   **Trampa Operativa Crítica:** Configurar `"instructionFiles": "claude-md-and-agents-md"` dentro de un archivo `.claude/settings.json` a nivel de proyecto es **ignorado silenciosamente** por Claude Code. Dicha clave solo se respeta en `~/.claude/settings.json` (global), en un archivo pasado mediante `--settings`, o en configuraciones administradas a nivel empresarial. Para garantizar que todo el equipo lea ambos archivos, la importación `@AGENTS.md` dentro de `CLAUDE.md` es el único mecanismo que se transporta con el repositorio.
-   **OpenAI Codex:**
    -   Impone un límite estricto de tamaño (`project_doc_max_bytes`) de **32 KiB** (aprox. 8,000 tokens).
    -   Realiza una lectura descendente desde la raíz del repositorio Git hacia el directorio de trabajo actual (`cwd`). Concatenante las guías; los archivos en directorios más profundos se posicionan al final del prompt, **sobrescribiendo** las directivas raíz. El archivo `AGENTS.override.md` reemplaza a `AGENTS.md` en su nivel.
-   **Cursor IDE y Cursor CLI:**
    -   Aplica la jerarquía: **Team Rules → Project Rules (.cursor/rules/\*.mdc) → User Rules**.
    -   Admite `AGENTS.md` en la raíz y subdirectorios. Cursor **combina en capas** (_layering_) los archivos anidados sobre la raíz en lugar de reemplazarlos, aplicando las instrucciones de la ruta en edición con mayor precedencia.
-   **GitHub Copilot y VS Code:**
    -   Copilot evalúa en orden: `.github/instructions/*.instructions.md` → `.github/copilot-instructions.md` → `AGENTS.md` → Instrucciones organizacionales.
    -   VS Code (modo Agente Local) lee `AGENTS.md` en la raíz por defecto. La lectura de archivos anidados requiere activar la bandera experimental `chat.useNestedAgentsMdFiles`.
-   **Gemini CLI:**
    -   Su comportamiento predeterminado nativo es buscar estrictamente `GEMINI.md`. Para habilitar `AGENTS.md`, requiere definir la clave `context.fileName` en `settings.json` con el arreglo `["AGENTS.md", "CONTEXT.md", "GEMINI.md"]`.

* * *

### 1.4. Presupuesto de Tokens, Prevención de Context Drift y Límites de Seguridad

Para maximizar la eficiencia en el uso de la ventana de contexto y evitar la degradación del rendimiento por dispersión de atención (_context drift_), se imponen las siguientes normas operativas:

Reglas de Oro de Gobernanza de Contexto

1.  **Límite de Presupuesto de Tokens:** Mantener el archivo `AGENTS.md` principal estrictamente entre **500 y 2,000 tokens** (o un índice comprimido de **8 a 15 KB**). Extensiones superiores deben modularizarse en carpetas de habilidades (`SKILL.md`) o vincularse a archivos externos.
2.  **Instrucción Clave de Inferencia:** Todo archivo de contexto debe incluir explícitamente el mandato:

_"Prefer retrieval-led reasoning over pre-training-led reasoning"_

Esta instrucción obliga al agente a priorizar los esquemas y documentación locales sobre los sesgos de su entrenamiento base.

1.  **Directivas de Seguridad Inviolables:**
    -   Prohibición explícita de editar o leer archivos de variables de entorno (`.env`, `.env.local`, `.env.production`).
    -   Prohibición absoluta de subir o incluir credenciales, tokens API o claves privadas en los commits.
    -   Prohibición de instalar paquetes o dependencias de software sin la confirmación explícita e instruida del usuario en la terminal.
2.  **Sustitución de Prosa por Mandatos Ejecutables:** Reemplazar sugerencias ambiguas por comandos deterministas de terminal (ej. sustituir _"mantén el código limpio"_ por `"pnpm lint --fix && pnpm test"`).

* * *

## 2\. Metodología Spec-Driven Development (SDD) vs. Vibe Coding

### 2.1. Fundamentos de SDD y Crítica al "Vibe Coding"

El desarrollo asistido por IA presenta dos paradigmas metodológicos contrapuestos:

-   **Vibe Coding:** Práctica estocástica caracterizada por la generación impulsiva de código mediante prompts conversacionales no estructurados y sin especificaciones previas. Origina deuda técnica prematura, regresiones invisibles, alucinaciones arquitectónicas y deriva descontrolada del contexto (_context drift_).
-   **Spec-Driven Development (SDD):** Enfoque riguroso de ingeniería donde la fase de diseño, especificación de contratos de datos y definición de criterios de aceptación se formalizan en documentos inmutables antes de autorizar la escritura de código de producción. Garantiza determinismo, auditabilidad y convergencia del agente.

| Criterio | Vibe Coding | Spec-Driven Development (SDD) |
| --- | --- | --- |
| Control de Contexto | Inexistente. El agente infiere la arquitectura en cada iteración provocando deriva de contexto. | Estricto. Anclado a especificaciones ejecutables e inmutables en la raíz del repositorio. |
| Predecibilidad | Baja. Resultados estocásticos altamente variables según el historial conversacional acumulado. | Alta. Basada en contratos de datos validados y suites de pruebas automatizadas deterministas. |
| Mantenibilidad | Deficiente. Código fragmentado, patrones inconsistentes y deuda técnica estructural desde el día 1. | Elevada. Estructura modular, tipado estricto en límites y cumplimiento de estándares de software. |
| Gestión de Errores | Reactiva. Parches iterativos ciegos (trial-and-error) que introducen nuevas regresiones. | Proactiva. Manejo de errores definido mediante tipos Result<T, E> y pruebas TDD previas. |

* * *

### 2.2. La Constitución del Proyecto

La Constitución del Proyecto es la capa superior e inmutable de gobernanza técnica. Establece las directivas de ingeniería que ningún agente de IA tiene permitido violar, eludir o modificar.

```
# CONSTITUCIÓN DEL PROYECTO

## Principios Técnicos Inviolables

1. **Tipado Estricto y Límites de Datos**:
   - TypeScript configurado obligatoriamente en modo estricto (`"strict": true`).
   - Queda estrictamente prohibido el uso de `any` o `unknown` sin guardas de tipo.
   - Validación obligatoria mediante esquemas Zod en todos los límites del sistema (APIs, IO, formularios).

2. **Paradigma y Manejo de Errores**:
   - Inmutabilidad por defecto: priorizar estructuras de datos inmutables y funciones puras.
   - Patrón Result: prohibido lanzar excepciones opacas (`throw`) en flujos asíncronos o de negocio.
     Toda función fallible debe retornar el tipo `Result<T, E>`.

3. **Restricciones Operativas para Agentes de IA**:
   - No modificar archivos de infraestructura (`docker-compose.yml`, `.github/workflows/*`) sin confirmación.
   - No alterar esquemas de base de datos sin generar una migración SQL explícita en `prisma/migrations/`.
   - Ejecutar la suite de linter y pruebas unitarias antes de dar cualquier tarea por completada.
```

* * *

### 2.3. Trinomio Funcional: Spec.md, Plan.md y Tareas Atómicas

El flujo de trabajo documental de la metodología SDD traduce requisitos de cliente en código probado mediante un ciclo estructurado en 4 pasos:

1.  **Paso 1: Especificación Executable (Spec.md)**
    -   **Comando / Skill:** `/bb-specify`
    -   **Descripción:** Recopila evidencias del cliente y requisitos de negocio. Genera `Spec.md` definiendo historias de usuario, escenarios de prueba en lenguaje Gherkin y criterios de aceptación sin ambigüedades.
2.  **Paso 2: Arquitectura y Plan Técnico (Plan.md)**
    -   **Comando / Skill:** `/bb-plan`
    -   **Descripción:** Traduce `Spec.md` en una estrategia de implementación técnica documentada en `Plan.md`. Define contratos de API, estrategia de estado, módulos afectados y esquemas de datos.
3.  **Paso 3: Descomposición en Tareas Atómicas**
    -   **Comando / Skill:** Invocación interna de planificación del agente.
    -   **Descripción:** Desglosa `Plan.md` en unidades de trabajo atómicas, independientes y secuenciales con una estimación de ejecución de **15 a 30 minutos máximo** por tarea.
4.  **Paso 4: Ejecución y Verificación**
    -   **Comando / Skill:** `/trust-but-verify`
    -   **Descripción:** El agente ejecuta cada tarea atómica de forma aislada bajo la metodología TDD, corriendo los linters y runners de prueba locales antes de avanzar a la siguiente unidad.

* * *

## 3\. Arquitectura de Software y Configuración de Semana 1

### 3.1. Estructura de Monorepo Escalable

Estructura industrial de monorepo gestionada mediante **pnpm workspaces** y **Turborepo**, diseñada para aislar dependencias y acelerar los pipelines de construcción:

```
root/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   └── package.json
│   └── web/
│       ├── src/
│       └── package.json
├── packages/
│   ├── config/
│   │   ├── eslint/
│   │   └── typescript/
│   ├── design-tokens/
│   │   ├── tokens/
│   │   └── package.json
│   ├── shared/
│   │   ├── src/
│   │   └── package.json
│   └── ui/
│       ├── src/
│       └── package.json
├── .cursor/
│   └── rules/
│       └── global.mdc
├── AGENTS.md
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

Aislamiento riguroso de dependencias y ejecución de scripts masivos mediante filtros: `pnpm --filter <module_name> build`.

* * *

### 3.2. Contratos Schema-First con Zod y OpenAPI

El desarrollo _schema-first_ centraliza los esquemas de validación en `@repo/shared`, permitiendo la inferencia estricta de tipos en TypeScript y la generación automática de especificaciones OpenAPI 3.0/3.1 para los endpoints del servidor mediante `@asteasolutions/zod-to-openapi`.

```
// packages/shared/src/schemas/user.ts
import { z } from 'zod';
import { extendZodWithOpenApi, OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';

// Extendemos Zod con las capacidades de OpenAPI
extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

export const UserSchema = z.object({
  id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
  email: z.string().email().openapi({ example: 'dev@company.com' }),
  name: z.string().min(2).openapi({ example: 'Architect' }),
  role: z.enum(['admin', 'user', 'guest']).openapi({ example: 'admin' }),
  createdAt: z.string().datetime().openapi({ example: '2026-03-30T10:00:00Z' }),
}).openapi('User');

// Inferencia estricta de tipos TypeScript
export type User = z.infer<typeof UserSchema>;

export const CreateUserRequestSchema = UserSchema.omit({
  id: true,
  createdAt: true,
}).openapi('CreateUserRequest');

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

// Registro del contrato en la especificación OpenAPI
registry.registerPath({
  method: 'post',
  path: '/users',
  summary: 'Crea un nuevo usuario en el sistema',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateUserRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Usuario creado exitosamente',
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
    },
  },
});

// Generación automática del documento OpenAPI JSON
export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Enterprise API Core',
      version: '1.0.0',
    },
  });
}
```

* * *

### 3.3. Guardarraíles de Código y CI Local

Automatización de políticas de calidad en el entorno local del desarrollador antes de consolidar cambios mediante Husky y `lint-staged`.

Configuración de `lint-staged` en `package.json`

```
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml}": [
      "prettier --write"
    ]
  }
}
```

Lista de Verificación (Checklist) de Configuración de CI Local

-   \[x\] **Instalación de Husky y Lint-Staged:**

```
pnpm add -D husky lint-staged -w
pnpm exec husky init
```

-   \[x\] **Configuración del Hook .husky/pre-commit:**

```
echo "pnpm exec lint-staged" > .husky/pre-commit
```

-   \[x\] **Configuración del Hook .husky/pre-push:**

```
echo "pnpm test --filter=...origin/main" > .husky/pre-push
```

-   \[x\] **Ejecución Manual de Verificación:**

```
pnpm lint
pnpm test --filter=web...origin/main
```

* * *

### 3.4. Presupuestos de Rendimiento en CI/CD

Integración de pruebas automáticas con **Lighthouse CI** en el pipeline de CI/CD desde la Semana 1 para bloquear regresiones de rendimiento y accesibilidad.

| Métrica | Umbral Mínimo (0-100) | Acción en CI/CD ante Fallo |
| --- | --- | --- |
| Performance | ≥90 | Bloqueo de Pull Request / Fallo de Build |
| Accessibility (a11y) | 100 | Bloqueo de Pull Request / Fallo de Build |
| Best Practices | ≥95 | Advertencia en reporte / Bloqueo si <90 |
| SEO | ≥90 | Advertencia en reporte CI |

* * *

## 4\. Sistema de Diseño, Pipeline de Tokens y Contrato DESIGN.md

### 4.1. Taxonomía de Design Tokens en 3 Capas (DTCG)

Estructura de design tokens bajo la especificación del W3C Design Tokens Community Group (DTCG), jerarquizada en una estructura anidada de tres niveles:

-   **Capa 1: Primitivos / Core (Valores Absolutos)**
    -   Definición de valores puros, paletas de color base, escalas de espaciado y tipografías fuente.
    -   _Ejemplo de código CSS/JSON:_

```
{
  "color": {
    "brand": { "rausch": { "$value": "#ff385c", "$type": "color" } },
    "gray": { "22": { "$value": "#222222", "$type": "color" } }
  },
  "font": { "family": { "base": { "$value": "Airbnb Cereal VF", "$type": "fontFamily" } } }
}
```

-   **Capa 2: Semánticos (Contexto de Uso)**
    -   Mapeo de primitivos hacia roles funcionales de la interfaz de usuario (superficies, texto primario, alertas).
    -   _Ejemplo de código CSS/JSON:_

```
:root {
  --bg-primary: #ffffff;
  --text-primary: var(--color-gray-22);
  --accent-brand: var(--color-brand-rausch);
}
```

-   **Capa 3: Componentes (UI Específica)**
    -   Variables vinculadas directamente a la anatomía de un componente UI concreto.
    -   _Ejemplo de código CSS/JSON:_

```
.btn-primary {
  background-color: var(--accent-brand);
  border-radius: var(--radius-sm, 8px);
  font-family: var(--font-family-base);
}
```

* * *

### 4.2. Pipeline de Automatización de Tokens

Flujo de integración técnica entre las herramientas de diseño e implementación de código:

1.  **Exportación:** Extraer design tokens desde Figma/Tokens Studio en formato JSON estandarizado por el W3C DTCG.
2.  **Transformación:** Procesar archivos JSON con **Style Dictionary** para compilar variables CSS, mapas Sass y definiciones de tipos estáticos en TypeScript (`tokens.ts`).
3.  **Consulta en Tiempo Real por IA:** Integrar el servidor **Figma MCP** o **Figma Code Connect** para permitir que el agente consulte tokens e inspeccione componentes durante la fase de codificación.
4.  **Consolidación:** Distribuir automáticamente las definiciones compiladas en el paquete compartido `@repo/design-tokens`.

* * *

### 4.3. El Contrato DESIGN.md y Flujo Visual

El archivo `DESIGN.md` establece el contrato estilístico y estructural consumido por el agente de IA para garantizar fidelidad visual estricta.

Flujo de Implementación y Herramientas Visuales

```
DESIGN.md (contrato)
    │
    ├── Stitch (diseño en IDE)
    ├── Pencil (diseño en IDE)
    └── Figma (exploración / refinamiento + handoff)
          │
          ▼
Código de Producción (validación vía capturas de pantalla / screenshot validation)
```

Snippet Representativo de un `DESIGN.md`

```
# CONTRATO DESIGN.MD

## Tokens Estructurales
- **Surface**: `--bg`: `#ffffff`, `--surface-warm`: `#f7f7f7`
- **Text**: `--fg`: `#222222`, `--muted`: `#6a6a6a`
- **Border**: `--border`: `#dddddd`, `--border-soft`: `#ebebeb`
- **Accent**: `--accent`: `#ff385c` (Rausch)
- **Product Tiers**: `--plus-magenta`: `#92174d`, `--luxe-purple`: `#460479`
- **Typography**: `--font-body`: "Airbnb Cereal VF", peso regular a 500
- **Radius**: `--radius-sm`: `8px`, `--radius-md`: `14px`, `--radius-lg`: `20px`, `--radius-pill`: `9999px`
- **Elevation**: `--elev-raised`: `rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0`

## Componente: Sticky Booking Panel
- Ancho: 370px, fijado a 120px del top en viewport de escritorio.
- Sombras: Elevar mediante `--elev-raised` compuesto de 3 capas.
- CTA Primario: Fondo `--accent`, texto blanco peso 500 a 16px.
```

* * *

### 4.4. Caso de Estudio: Reingeniería de Sistema de Diseño (Inspirado en Airbnb / OpenDesign)

Análisis de patrones de arquitectura visual para la transición a super-apps de escala masiva:

-   **Reglas Tipográficas:** Uso exclusivo de la tipografía variable `Airbnb Cereal VF`. El peso **500** actúa como cuerpo de texto regular (el peso 400 queda excluido). Se aplica _tracking_ negativo (-0.18px a -0.44px) en encabezados superiores a 20px.
-   **Acento de Marca y Tiers de Producto:** Uso quirúrgico del color Rausch (`#ff385c`) reservado exclusivamente para la acción principal (CTA _Reserve_). Los niveles de producto superiores aplican sus acentos específicos: **Plus Magenta** (`#92174d`) para la línea Airbnb Plus y **Luxe Purple** (`#460479`) para la línea Airbnb Luxe.
-   **Elevación Compuesta de 3 Capas:** Implementación de sombras compuestas para prevenir aliasing: `rgba(0, 0, 0, 0.02) 0 0 0 1px, rgba(0, 0, 0, 0.04) 0 2px 6px 0, rgba(0, 0, 0, 0.1) 0 4px 8px 0`

Buenas Prácticas (Do's) y Antipatrones (Don'ts) para Agentes

Buenas Prácticas (Do's)

-   Utilizar `Airbnb Cereal VF` con peso 500 por defecto para el texto base.
-   Restringir el color Rausch (`#ff385c`) a un solo elemento de acción principal por vista.
-   Aplicar bordes Hairline Gray (`#dddddd`) de 1px para separación de tarjetas y filas.
-   Mantener fotografías con radio de esquina de 14px en grillas y 20px en vistas de detalle.

Antipatrones (Don'ts)

-   **No utilizar peso de fuente 400** (Regular) cuando la especificación defina el peso base en 500.
-   **No aplicar textos superpuestos** sobre las imágenes de producto. Las etiquetas y precios siempre deben posicionarse debajo del contenedor fotográfico.
-   **No aplicar gradientes decorativos** de fondo en contenedores de superficie.
-   **No usar texto en mayúsculas sostenidas (ALL CAPS)** salvo en la escala tipográfica de 8px (_superscript_).

* * *

## 5\. Ejecución, Pruebas, Observabilidad y Despliegue

### 5.1. Dual-Track Agile y Component-Driven Development (CDD)

-   **Discovery Track:** Equipo enfocado en la validación continua de señales de clientes e investigación de requerimientos, materializando los hallazgos en archivos `Spec.md`.
-   **Delivery Track:** Ejecución de código por parte del agente de IA siguiendo `Plan.md` y tareas atómicas.
-   **Desarrollo Aislado (CDD):** Todos los componentes visuales de la interfaz se construyen de forma aislada en Storybook antes de integrarse en las rutas globales de la aplicación.

* * *

### 5.2. Agent-Led TDD (Red-Green-Refactor)

Algoritmo estricto para la ejecución de Desarrollo Guiado por Pruebas (TDD) por parte del agente:

```
[Inicio] ──> 1. Escribir Test Fallido (Fase RED)
                 │
                 ▼
             2. Ejecutar Runner (`pnpm vitest run`) ──> ¿Pasó el test? ──> Sí ──> [Error en Test]
                 │
                 No (Fallo esperado)
                 ▼
             3. Escribir Código Mínimo (Fase GREEN)
                 │
                 ▼
             4. Re-ejecutar Runner (`pnpm vitest run`) ──> ¿Pasó el test? ──> No ──> [Corregir Código]
                 │
                 Sí
                 ▼
             5. Refactorizar Código (Fase REFACTOR)
                 │
                 ▼
             6. Ejecutar `/trust-but-verify` ──> [Tarea Completada]
```

Código de Prueba Vitest de Ejemplo (`BookingPanel.test.tsx`)

```
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BookingPanel } from './BookingPanel';

describe('BookingPanel Component', () => {
  it('renders correctly with given price and primary CTA', () => {
    render(<BookingPanel price={150} currency="$" />);
    
    expect(screen.getByText('$150')).toBeDefined();
    expect(screen.getByRole('button', { name: /reserve/i })).toBeDefined();
  });
});
```

Comandos de Terminal Utilizados por el Agente

```
# Fase RED: Ejecución de la prueba para verificar fallo inicial esperado
pnpm vitest run apps/web/src/components/BookingPanel.test.tsx

# Generación de pruebas suplementarias
/generate-tests

# Validación global tras la fase REFACTOR
pnpm test --filter=web
/trust-but-verify
```

* * *

### 5.3. Métricas DORA, Observabilidad y CI/CD Pipeline

Relación entre las métricas clave de ingeniería (DORA) y los mecanismos de automatización en la canalización CI/CD:

| Métrica DORA | Mecanismo de Automatización CI/CD |
| --- | --- |
| Deployment Frequency (DF) | Despliegue automático de entornos preview por Pull Request y CD a producción tras merge en main. |
| Lead Time for Changes (LTC) | Pipelines de pruebas en paralelo y validación de tipos/tokens en menos de 5 minutos. |
| Change Failure Rate (CFR) | Ejecución obligatoria de TDD, guardarraíles local con Husky y Lighthouse CI. |
| Time to Restore Service (MTTR) | Rollbacks automatizados en la plataforma de despliegue mediante comprobaciones de salud post-despliegue. |

* * *

### 5.4. Protocolo de Contexto de Modelos (MCP)

Arquitectura del Model Context Protocol (MCP) para conectar el agente de IA con fuentes de datos externas sobre el estándar **JSON-RPC 2.0**.

Componentes del Sistema

-   **Host:** Aplicación contenedora (ej. Claude Code, Cursor, VS Code) que coordina clientes, gestiona permisos y controla el flujo de inferencia.
-   **Cliente:** Instancia creada por el Host que mantiene una conexión punto a punto (1:1) y con estado con un Servidor MCP específico.
-   **Servidor:** Programa local (vía STDIO) o remoto (vía Streamable HTTP) que expone herramientas (_tools_), recursos (_resources_) y plantillas (_prompts_).

Negociación de Capacidades en la Inicialización (`initialize` Handshake)

Durante la apertura de la sesión, el cliente y el servidor negocian explícitamente sus capacidades antes de ejecutar cualquier llamada a herramientas:

```
// Petición del Cliente al Servidor
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2026-07-28",
    "capabilities": {
      "sampling": {},
      "roots": { "listChanged": true }
    },
    "clientInfo": { "name": "CursorHost", "version": "1.0.0" }
  }
}

// Respuesta del Servidor declarando Capacidades
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2026-07-28",
    "capabilities": {
      "tools": { "listChanged": true },
      "resources": { "subscribe": true },
      "prompts": {},
      "notifications": {}
    },
    "serverInfo": { "name": "SentryMCPServer", "version": "2.4.0" }
  }
}
```

Ejecución de Herramienta MCP (`tools/call`)

```
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "query_database",
    "arguments": {
      "sql": "SELECT id, email FROM users WHERE role = 'admin';"
    }
  }
}
```

* * *

## 6\. Guía Paso a Paso de Interacción Humano-IA

### 6.1. Fase 1: Incitación, Gobernanza e Incubación (SDD)

Paso 1: Inicio del Proyecto e Invocación de Especificación

El desarrollador inicia el proyecto cargando la gobernanza establecida en `AGENTS.md` e invocando la habilidad de especificación.

**Prompt Humano:**

```
Carga el contexto desde AGENTS.md e invoca /bb-specify para formalizar la historia de usuario y criterios de aceptación para el módulo de reserva de alojamientos. Registra el contrato en Spec.md.
```

**Respuesta de la IA (Agente):**

```
Contexto leído desde AGENTS.md exitosamente.
Creando `Spec.md` con los requerimientos funcionales, escenarios Gherkin y validaciones de entrada usando la Constitución del Proyecto como límite inmutable.
```

* * *

### 6.2. Fase 2: Configuración de Infraestructura y Contratos

Paso 2: Creación de Esquemas Zod y Reglas Scoped

El desarrollador ordena la creación de los contratos de datos e integración OpenAPI.

**Prompt Humano:**

```
Basándote en Spec.md y Plan.md, genera el esquema Zod de reserva en `packages/shared/src/schemas/booking.ts` registrándolo en OpenAPIRegistry. Asegúrate de aplicar modo estricto de TypeScript y crear una regla `.cursor/rules/booking.mdc` para aplicar las validaciones sólo a las rutas `apps/web/src/booking/**`.
```

**Respuesta de la IA (Agente):**

```
Esquema Zod creado en `@repo/shared` exportando el tipo inferido `Booking` y la especificación OpenAPI. Regla `.cursor/rules/booking.mdc` configurada con el glob pattern correspondiente.
```

* * *

### 6.3. Fase 3: Construcción de UI y Lógica (TDD + Componentes)

Paso 3: Transcripción de Conversación Humano-IA (Ciclo Red-Green-Refactor)

**Humano:**

```
Vamos a implementar el componente visual "Sticky Booking Panel". Revisa los tokens en DESIGN.md, crea la historia en Storybook y ejecuta la Fase RED creando la prueba en Vitest.
```

**IA (Agente):**

```
Entendido.
1. Reviso DESIGN.md: Aplicaré ancho de 370px, sombras compuestas `--elev-raised`, y botón Rausch `#ff385c`.
2. Creo la prueba en `apps/web/src/components/BookingPanel.test.tsx`.
3. Ejecuto el test runner:
```

```
pnpm vitest run apps/web/src/components/BookingPanel.test.tsx
```

```
Resultado: FAIL (Fase RED confirmada: el componente no existe).
Procedo a escribir la implementación mínima del componente en `BookingPanel.tsx` para pasar a Fase GREEN.
```

**IA (Agente):**

```
Código escrito. Vuelvo a ejecutar la prueba:
```

```
pnpm vitest run apps/web/src/components/BookingPanel.test.tsx
```

```
Resultado: PASS (Fase GREEN alcanzada).
Procedo a realizar la refactorización para extraer el sub-componente de precios sin alterar las pruebas.
```

* * *

### 6.4. Fase 4: Auditoría, Verificación Visual y Release

Paso 4: Auditoría, Verificación Visual y Generación de Releases

**Humano:**

```
Ejecuta la verificación del componente construido, realiza la auditoría visual mediante captura de pantalla y genera el historial de cambios para el release.
```

**IA (Agente):**

```
1. Ejecuto el comando de verificación:
```

```
/trust-but-verify
```

```
2. Realizo la captura de pantalla del componente renderizado en Storybook para validación visual contra DESIGN.md.
3. Reviso los diffs de Git con `git diff`.
4. Invoco el generador de changelog para empaquetar la versión:
```

```
/bb-changelog
```

```
Auditoría completada exitosamente. Código validado, pruebas pasadas y notas de versión generadas correctamente. Listos para el despliegue.
```