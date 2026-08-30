# ESPECIFICACIONES TÉCNICAS Y REQUERIMIENTOS DEL PROYECTO
## YANETSIS + LA MAGIA DE CANTAR

> **Documento de Especificaciones Técnicas (PRD / System Requirements)**  
> **Destinatario de lectura:** Opencode / Equipo de Desarrollo Frontend & Backend  
> **Cliente / Proyecto:** Yanetsis + La Magia de Cantar  
> **Versión:** 2.0 (Estructura Simplificada)  

---

## 1. Visión General del Proyecto

### 1.1 Propósito
Desarrollar la plataforma web oficial para **YANETSIS + La Magia de Cantar**. La web opera como el centro del ecosistema comercial y de autoridad de Yanetsis: posiciona la marca, explica la metodología de enseñanza vocal, segmenta a los visitantes por perfil, capta prospectos calificados y facilita transacciones directas (Mercado Pago Colombia) y solicitudes de cotización institucional.

### 1.2 Enfoque Arquitectónico
- **Arquitectura:** Web modular, ultrarrápida, *responsive* (mobile-first), con alto nivel de conversión (CRO) y optimizada para SEO local e internacional.
- **Modelo de Navegación:** Estructura simplificada de 6 secciones principales + Pie de Página (Contacto).
- **Consumo por IA / Devs:** Estructura limpia de componentes reutilizables, rutas semánticas y contratos de API claros para formularios e integraciones.

---

## 2. Mapa de Navegación y Estructura de Secciones

La clienta ha simplificado la navegación del sitio en la siguiente estructura principal:

```
WEBSITE MAIN NAV
├── 1. Inicio (Home)
├── 2. La magia de cantar
├── 3. Método Yanetsis
├── 4. Nuestros servicios (CTA: "Quiero tener la magia")
├── 5. Empresas o instituciones
├── 6. Testimonios - Artistas formados
└── Pie de Página (Footer / Contacto)
```

---

## 3. Especificaciones Detalladas por Sección

### 3.1 Header / Barra de Navegación Superior (Sticky Navbar)
- **Logo:** Identidad visual de YANETSIS + La Magia de Cantar.
- **Enlaces de Menú:**
  1. Inicio
  2. La magia de cantar
  3. Método Yanetsis
  4. Nuestros servicios
  5. Empresas o instituciones
  6. Testimonios
- **Botonera / CTA Global:**  
  - Botón destacado: `"Quiero tener la magia"` (Redirecciona/desplaza a la sección de Servicios o abre modal/formulario de captura).

---

### 3.2 Sección 1: Inicio (Home)
- **Hero Section:**
  - **Título principal (H1):** Promesa de valor sobre la transformación vocal, emocional y artística liderada por Yanetsis.
  - **Subtítulo:** Diferenciación de la plataforma (no es una academia tradicional, es un proceso integral).
  - **CTA Principal:** `"Quiero tener la magia"` (scroll suave a *Nuestros Servicios* o disparador de formulario).
  - **Recurso visual:** Imagen/Video de alta calidad de Yanetsis en escena/coaching.
- **Rutas Rápidas / Fit por Necesidad (Cards interactivos):**
  - "Quiero aprender a cantar" $\rightarrow$ *Nuestros Servicios (Adultos / Principiantes)*
  - "Busco formación para mi hijo/a" $\rightarrow$ *Nuestros Servicios (Niños & Teens)*
  - "Soy artista emergente / profesional" $\rightarrow$ *Nuestros Servicios (Artistas)*
  - "Represento una empresa o colegio" $\rightarrow$ *Empresas o Instituciones*
- **Resumen de la Propuesta / Método:** Breve introducción visual al Método Yanetsis.
- **Prueba Social Rápida:** Banner/Ticker con logotipos, menciones en medios, apariciones en TV o destacados de artistas formados.

---

### 3.3 Sección 2: La magia de cantar
- **Concepto:** Página/sección narrativa sobre el origen, la comunidad y la filosofía de la plataforma.
- **Puntos clave a presentar:**
  - Historia y propósito de la marca.
  - El ambiente seguro, cálido, expresivo y no competitivo.
  - Infraestructura (espacio físico en Bogotá / modalidad virtual).
  - El equipo pedagógico y artístico respaldado por Yanetsis.
- **CTA Secundario:** `"Quiero tener la magia"`.

---

### 3.4 Sección 3: Método Yanetsis
- **Concepto:** Explicación visual y didáctica de la metodología propia que diferencia la plataforma de academias convencionales.
- **Pilares del Método (Grilla interactiva o Diagrama):**
  1. **Voz:** Técnica pura, respiración, afinación y salud vocal.
  2. **Técnica & Cuerpo:** Postura, proyección, energía corporal y soporte.
  3. **Emoción & Mente:** Superación del miedo escénico, desbloqueo emocional y autoconfianza.
  4. **Interpretación & Escena:** Manejo de micrófono, proyección escénica y conexión con el público.
  5. **Comunidad:** Red de apoyo, experiencias compartidas y crecimiento colaborativo.
- **CTA:** `"Quiero tener la magia"`.

---

### 3.5 Sección 4: Nuestros servicios
- **Concepto:** Catálogo central unificado de la oferta de valor.
- **Nombre del CTA Principal de la sección:** **`"Quiero tener la magia"`**
- **Categorización interna / Tabs o Filtros:**
  1. **Niños y Adolescentes (Kids & Teens):**
     - Entrenamiento vocal progresivo por edades.
     - Modalidad individual o grupal (evaluada según perfil).
     - Formulario dedicado para acudientes/padres.
  2. **Adultos:**
     - Canto para principiantes, técnica vocal y bienestar a través de la voz.
     - Formulario de inscripción/orientación.
  3. **Formación Complementaria & Especializada:**
     - Técnica vocal personalizada, teatro/expresión corporal, piano, guitarra, producción musical, talleres intensivos.
  4. **Artistas Emergentes & Coach Personalizado con Yanetsis:**
     - Preparación para castings, realities, lanzamientos, desarrollo de identidad artística y dominio escénico.
- **Lógica Comercial y de Pagos:**
  - **Servicios Estandarizados (Cursos, Paquetes, Talleres con precio fijo):** Botón CTA *"Quiero tener la magia"* permite pago directo con **Mercado Pago Colombia** o redirige a checkout.
  - **Servicios Personalizados (Artistas / Coaching Directo Yanetsis):** Botón redirige a formulario de cotización personalizada.

---

### 3.6 Sección 5: Empresas o instituciones (B2B)
- **Concepto:** Página dedicada a solicitudes corporativas, gubernamentales, educativas y de marcas.
- **Sub-líneas de servicio:**
  - **Empresas:** Talleres de comunicación efectiva, manejo de voz para ejecutivos/oradores, integración de equipos (teambuilding a través de la música), conferencias y bienestar laboral.
  - **Instituciones Educativas:** Montaje de coros, talleres extracurriculares de expresión vocal, seminarios para docentes y talleres de técnica vocal infantil/juvenil.

#### 📩 REQUERIMIENTO ESPECIAL DE FORMULARIO B2B (Empresas e Instituciones)
El formulario de esta sección tiene una lógica de negocio y procesamiento técnica diferenciada:
1. **Comportamiento del CTA:** Al hacer clic en el botón de envío (*"Solicitar Propuesta Comercial"* / *"Enviar Cotización"*), el sistema procesa el formulario y gatilla un correo electrónico directo de cotización B2B.
2. **Destinatario de Correo:** `contacto@lamagiadecantar.co`
3. **Asunto sugerido del Email:** `[COTIZACIÓN B2B] Solicitud Institucional de {Nombre de la Empresa/Institución}`
4. **Campos Requeridos del Formulario - Sugerido, puede cambiar conforme se desarrolla el proyecto:**
   - `nombre_entidad` (Texto, obligatorio): Nombre de la empresa o institución educativa.
   - `tipo_entidad` (Select/Dropdown, obligatorio): "Empresa Privada", "Colegio", "Universidad", "Fundación / ONG", "Entidad Pública", "Otro".
   - `nombre_contacto` (Texto, obligatorio): Nombre y apellidos de la persona solicitante.
   - `cargo_contacto` (Texto, obligatorio): Cargo dentro de la organización (ej: Director de Gestión Humana, Coordinador Cultural, etc.).
   - `email` (Email, obligatorio): Correo corporativo/institucional.
   - `whatsapp_telefono` (Tel/Texto, obligatorio): Número de contacto directo.
   - `ciudad` (Texto, obligatorio): Ciudad de realización del evento/taller.
   - `numero_participantes` (Número/Select, obligatorio): Rango de participantes (ej: 1-15, 15-50, 50-200, 200+).
   - `tipo_servicio_interes` (Checkboxes/Select, obligatorio): "Taller de Manejo Vocal / Oratoria", "Teambuilding Musical", "Conferencia / Performance", "Montaje Coros / Talleres Educativos", "Otro".
   - `fecha_estimada` (Fecha / Texto): Fecha o mes tentativo de ejecución.
   - `presupuesto_estimado` (Texto / Select, opcional): Rango presupuestal proyectado.
   - `mensaje_detalles` (Textarea, obligatorio): Descripción del requerimiento o necesidad específica.
   - `habeas_data` (Checkbox, obligatorio): Aceptación de políticas de tratamiento de datos personales.

---

### 3.7 Sección 6: Testimonios - Artistas formados
- **Concepto:** Galería de prueba social, autoridad y casos de éxito.
- **Elementos a mostrar:**
  - **Artistas destacados:** Galería de tarjetas con foto, nombre del artista, logros (aparición en TV, lanzamientos musicales, realities, musicales) y testimonio en texto/video.
  - **Testimonios de Alumnos Adultos y Padres (Kids/Teens):** Reseñas en texto/video sobre el impacto emocional, vocal y personal del Método Yanetsis.
  - **Widgets o Embeds:** Integración de videos Cortos (Reels/Shorts) o audios del "Antes y Después".

---

### 3.8 Pie de Página (Footer) / Sección de Contacto
- **Estructura del Footer:**
  - **Columna 1 - Marca & Info:** Logo de YANETSIS + La Magia de Cantar, breve síntesis de la propuesta.
  - **Columna 2 - Links Rápidos:** Navegación interna directas a cada sección.
  - **Columna 3 - Contacto Directo:**
    - Correo general / reservas: `contacto@lamagiadecantar.co`
    - WhatsApp Business (Enlace directo con mensaje prellenado).
    - Ubicación física (Bogotá, Colombia) + mapa modal o embebido.
    - Horarios de atención.
  - **Columna 4 - Métodos de Pago & Seguridad:** Logotipos de Mercado Pago Colombia (PSE, Tarjetas de Crédito, Efecty).
- **Legales Footer:**
  - Enlaces a *Política de Tratamiento de Datos (Habeas Data Colombia - Ley 1581)*.
  - *Términos y Condiciones del Servicio*.
  - *Política de Cancelación y Reposición de Clases*.
  - Copyright © {Año Actual} Yanetsis. Todos los derechos reservados.

---

## 4. Formularios y Backend Requirements (Resumen Técnico)

| Identificador Formulario | Ubicación / Sección | Destino de los datos | Mecanismo Técnico / CTA |
| :--- | :--- | :--- | :--- |
| **`form-b2b-institucional`** | Sección "Empresas o instituciones" | **Email directo a `cotizaciones@lamagiadecantar.co`** + Copia en BD/CRM | Envío de correo vía Serverless API / Nodemailer / Resend / Formspree + Mensaje de confirmación en pantalla ("Página de Gracias"). |
| **`form-general-servicios`** | Sección "Nuestros servicios" / Modales | Base de Datos (Supabase / CRM) + Notificación Email | Captura de lead por nivel (Kids, Adultos, Artistas) con redirección a WhatsApp o Mercado Pago. |
| **`form-contacto-footer`** | Pie de Página | Email + Base de datos | Mensaje directo de consulta general. |

---

## 5. Integraciones Requeridas

1. **Mercado Pago Colombia (Checkout Pro / Payment Links):**
   - Habilitado para paquetes estándar en "Nuestros Servicios".
   - Soporte para PSE, Tarjetas de Crédito, Nequi/Daviplata vía Mercado Pago.
2. **WhatsApp Business Integration:**
   - Botón flotante persistente con UTM tracking o detección de sección actual para personalizar el mensaje prellenado (ej: *"Hola, estoy viendo la sección de Clases para Adultos y quiero más información"*).
3. **Mailing Engine (para Formulario B2B):**
   - Configuración de SDK o API de envío de emails (Resend, Nodemailer, SendGrid, o Formspree) autenticado con dominio propio para evitar bandeja de SPAM al enviar a `contacto@lamagiadecantar.co`.
4. **Analítica & Tracking:**
   - Google Tag Manager (GTM)
   - Google Analytics 4 (GA4) con eventos configurados: `click_cta_quiero_la_magia`, `submit_form_b2b`, `initiate_checkout_mercadopago`, `click_whatsapp`.
   - Meta Pixel (Facebook/Instagram Pixel).

---

## 6. SEO y Metadatos Requeridos

- **Estructura H1/H2/H3:** Un solo `<h1>` por sección o vista principal.
- **Palabras Clave Primarias:**
  - `clases de canto en bogota`, `coach vocal en bogota`, `tecnica vocal bogota`, `entrenamiento vocal integral`, `clases de canto para niños bogota`, `clases de canto adultos bogota`, `vocal coach para artistas colombia`.
- **Datos Estructurados JSON-LD:**
  - `Organization` & `LocalBusiness` (con dirección y coordenadas en Bogotá).
  - `Person` (para Yanetsis como figura de autoridad/Coach).
  - `Service` (para programas y B2B).
  - `FAQPage` (para resolver dudas frecuentes).

---

## 7. Funcionalidad de Marketing: Prueba de Voz IA

> **Ruta:** `/prueba-de-voz`
> **Objetivo:** Lead-magnet que capta prospectos grabando su voz en el navegador (10 segundos), calcula métricas locales de afinación y estabilidad y las envía a un modelo de Anthropic (Claude) que genera un veredicto en la voz de Yanetsis, cerrando con un CTA a WhatsApp.

### 7.1 Flujo de Estados (UI)

| Estado | Descripción |
| :--- | :--- |
| `idle` | Pantalla inicial esperando el clic en "Grabar mi voz". |
| `recording` | Grabación activa durante **10 segundos** (con temporizador visible). |
| `processing` | Procesando métricas y consultando la IA ("Procesando IA..."). |
| `result` | Muestra las 3 métricas (Puntaje, Afinación, Estabilidad) y el veredicto. |
| `error` | Micrófono denegado o no se detectó voz (RMS < 0.01 / sin muestras válidas). |

**Requisitos de audio:**
- `AudioContext` y `getUserMedia` deben dispararse únicamente dentro del evento de **click** del botón "Grabar mi voz" para funcionar en navegadores estrictos (iOS/Safari).
- Captura con `ScriptProcessorNode` (bufferSize 4096, 1 entrada); cada chunk se analiza con `detectPitch` (autocorrelación) y los pitches válidos se acumulan en un array de muestras durante los 10 segundos.

### 7.2 Contrato de la API — `POST /api/veredicto`

**Request body:**
```json
{ "pitchAcc": 87, "stab": 72, "total": 81 }
```
- `pitchAcc`, `stab`, `total`: números finitos entre `0` y `100`.
- Si algún valor no es un número finito o está fuera de `[0, 100]` → **400** `{ error: "invalid metrics" }`.

**Response success (200):**
```json
{ "veredicto": "Texto del veredicto generado por Claude..." }
```

**Fallback crítico (SIEMPRE status 200, NUNCA 500):**
```json
{ "error": "fallback" }
```
Se devuelve si: no existe `process.env.ANTHROPIC_API_KEY`, el `fetch` a Anthropic falla, la respuesta no es `ok`, o el cuerpo no contiene texto. El frontend usa entonces su texto local (`localVeredicto`) sin que el usuario note la falla.

**Consumo de Anthropic:**
- Endpoint: `https://api.anthropic.com/v1/messages` (fetch nativo).
- Modelo: `claude-haiku-4-5`.
- Headers: `x-api-key`, `anthropic-version: 2023-06-01`, `content-type: application/json`.
- Body: `{ model, max_tokens, system, metadata, messages: [{ role: "user", content: MÉTRICAS }] }`.
- **Stateless por diseño:** la API es sin estado; cada `POST` es una sesión nueva e independiente. El prompt de instrucciones va en `system` y el mensaje de `user` contiene **solo** las métricas de esa grabación, por lo que nunca hay contaminación entre usuarios.
- `metadata.user_id`: hash opaco (SHA-256 de IP + user-agent, sin PII) para el tracking de abuso de Anthropic.
- `sessionId` aleatorio (`crypto.randomUUID()`): solo para correlacionar logs del servidor.
- Extraer el texto de `data.content[0].text`.

### 7.3 Prompt para la IA (con métricas interpoladas)

**`system` (instrucciones/rol — fijas):**
> Eres el asistente de redacción de Yanetsis Alfonso, coach vocal de televisión y fundadora de La Magia de Cantar. Escribe veredictos breves (entre 80 y 120 palabras), en español, en primera persona como si los dijera Yanetsis: cálidos, cercanos, profesionales, nunca condescendientes. Menciona un aspecto fuerte y un aspecto a mejorar, basados únicamente en las métricas dadas. No inventes datos que no estén en las métricas (no menciones rango vocal, tono de voz, género musical, ni nada que no puedas saber de esos tres números). No uses lenguaje técnico de ingeniería de audio. Cierra invitando, de forma natural, a dar el siguiente paso con una clase de prueba. Responde solo con el texto del veredicto, sin título ni comillas.

**`user` (datos de esta grabación — variables):**
> Alguien acaba de hacer una prueba de voz en la página web. Estas son las únicas métricas reales que tienes sobre esa grabación: afinación {pitchAcc}%, estabilidad de la respiración {stab}%, puntaje total {total}/100.

### 7.4 Lógica de Métricas (Exacta, NO modificar)

- **`detectPitch(data, sampleRate)`**: autocorrelación (cortes por umbral `0.2`, búsqueda de lag del máximo; retorna `-1` si RMS < 0.01).
- **`stab`**: `mean` y `variance` de las muestras de pitch → `sd = sqrt(variance)` → `cv = sd / mean` → `stab = clamp(round(100 - cv * 300), 0, 100)`.
- **`pitchAcc`**: saltos de semitonos `st = abs(12 * log2(s[i]/s[i-1]))`; si `st < 2` suma uno; `pitchAcc = clamp(round(semitoneJumps / (len-1) * 100), 0, 100)`.
- **`total`**: `round(pitchAcc * 0.6 + stab * 0.4)`.

**Veredicto local de respaldo (`localVeredicto(pitchAcc, stab, total)`):**
```js
const open = total >= 80 ? "Se nota una base sólida en tu voz." : total >= 55 ? "Hay una base para trabajar, y eso es justo el punto de partida." : "Este es apenas el comienzo, y ahí está lo interesante.";
const pitchLine = pitchAcc >= 75 ? "Tu afinación se mantiene firme en la mayor parte del pasaje." : pitchAcc >= 50 ? "Tu afinación es irregular: hay tramos precisos y otros que se desvían." : "La afinación todavía varía bastante, algo muy normal antes de entrenar el oído.";
const stabLine = stab >= 75 ? "El control de la respiración sostiene bien la nota." : stab >= 50 ? "El aire se agota antes de tiempo en algunos tramos." : "La respiración necesita trabajo para sostener la nota sin temblor.";
const close = total >= 80 ? "Con técnica de resonancia y escena, esto se proyecta a otro nivel." : total >= 55 ? "Con un plan de técnica vocal enfocado, esto avanza rápido." : "Con una guía desde el inicio, esta base se convierte en una voz segura.";
// Devuelve: `${open} ${pitchLine} ${stabLine} ${close}`
```

### 7.5 Diseño (Neo-Brutalista, igual al resto del sitio)

- **Fondo:** crema `bg-[#FFFBEB]`.
- **Hero:** titular llamativo "Prueba con IA tu voz" con `font-poppins font-extrabold`.
- **Tarjeta principal:** contenedor blanco `rounded-3xl border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`.
- **Stats (resultado):** 3 cajas pequeñas individuales neo-brutalistas (Puntaje, Afinación, Estabilidad).
- **Veredicto:** bloque destacado `bg-pink-soft` (o `bg-mint/30`).
- **CTA final:** botón grande `bg-yellow` con texto "Quiero tener la magia" → `https://wa.me/573053678742?text=...`.
- Tipografías `font-poppins` / `font-jakarta`; iconos de `lucide-react`. Sin CSS en línea.

### 7.6 Variables de Entorno

- `ANTHROPIC_API_KEY` — clave de la API de Anthropic. Si no existe, el endpoint responde `{ error: "fallback" }` con 200 y la página usa el veredicto local.