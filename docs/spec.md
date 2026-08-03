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
2. **Destinatario de Correo:** `yanetsisvoz@gmail.com`
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
    - Correo general / reservas: `yanetsisvoz@gmail.com`
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
| **`form-b2b-institucional`** | Sección "Empresas o instituciones" | **Email directo a `yanetsisvoz@gmail.com`** + Copia en BD/CRM | Envío de correo vía Serverless API / Nodemailer / Resend / Formspree + Mensaje de confirmación en pantalla ("Página de Gracias"). |
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
   - Configuración de SDK o API de envío de emails (Resend, Nodemailer, SendGrid, o Formspree) autenticado con dominio propio para evitar bandeja de SPAM al enviar a `yanetsisvoz@gmail.com`.
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