# SISTEMA DE DISEÑO Y GUÍA DE ESTILOS UI/UX
## YANETSIS + LA MAGIA DE CANTAR

> **Documento de Especificaciones de Diseño (Design System PRD)**  
> **Destinatario:** Impeccable / Opencode / Equipo de Desarrollo Frontend  
> **Estilo Visual:** Pop Minimal Elegante & Vibrant (Modern Consumer / Creative Tech)  
> **Archivo de Configuración:** `globals.css` (Tailwind CSS v4)  
> **Versión:** 2.0 (Rediseño Minimalista & Elegante)  

---

## 1. Concepto e Identidad Visual (Pop Minimal & Orgánico)

El diseño evoluciona hacia una estética **Pop Minimal Elegante**, combinando la calidez y dinamismo artístico de la marca con una interfaz limpia, espaciosa y contemporánea (inspirada en landings modernas de alto nivel):

- **Titulares de Gran Peso y Elegancia:** Uso dominante de **Poppins ExtraBold / Black** en titular principal (`h1`), utilizando capitalización natural (Sentence case o Title case) con `tracking-tight` para lograr un impacto visual limpio, moderno y profesional.
- **Formas Orgánicas y Bloques de Color ("Blobs"):** Imágenes destacadas (como la fotografía de Yanetsis) enmarcadas en contenedores orgánicos redondeados (`rounded-3xl` / máscaras de forma) sostenidos por fondos de color líquido/pastel (`--color-violet`, `--color-yellow`, `--color-pink`).
- **Tarjetas Pulidas y Espaciosas:** Tarjetas con bordes ultra-suaves (`rounded-3xl`), fondos blancos o gris neutro ultraligero (`bg-gray-100` / `bg-white`), bordes sutiles o sombras difuminadas multinivel que aportan profundidad sin recargar.
- **Micro-Decoraciones Vectoriales Flotantes (Doodles & Accents):** Trazos libres en SVG (`lib/iconsLibrary.jsx`) como flechas trazadas a mano apuntando a CTAs, espirales/rizos flotantes, pequeñas estrellas, asteriscos y puntos de acento posicionados de forma libre (`absolute`).

---

## 2. Tokens de Diseño y Variables CSS (`globals.css`)

Tokens de diseño actualizados para **Tailwind CSS v4** declarados en `@theme inline`:

```css
@import "tailwindcss";

@theme inline {
  /* Tipografías */
  --font-poppins: var(--font-poppins);
  --font-jakarta: var(--font-plus-jakarta-sans);
  --font-bebas: var(--font-bebas-neue);
  --font-jetbrains: var(--font-jetbrains-mono);

  /* Paleta de Colores Pop Vibrante & Elegante */
  --color-green: #9dc44d;
  --color-brown: #211915;
  --color-purple: #9f3aca;
  --color-violet: #8b5cf6;
  --color-blue: #5a9ee4;
  --color-yellow: #facc15;
  --color-orange: #f97316;
  --color-red: #ef4444;
  --color-dark-purple: #72408d;
  --color-pink: #ec4899;
  --color-pink-soft: #fce7f3;
  --color-black: #09090b;
  --color-gray-950: #18181b;
  --color-gray-900: #27272a;
  --color-gray-100: #f4f4f5;
  --color-gray-50: #fafafa;
  --color-lime: #a3e635;

  /* Sombras y Elevaciones Elegantes */
  --shadow-soft-sm: 0 4px 12px rgba(9, 9, 11, 0.04);
  --shadow-soft-md: 0 8px 24px rgba(9, 9, 11, 0.08);
  --shadow-soft-lg: 0 16px 40px rgba(9, 9, 11, 0.12);
  --shadow-pop-solid: 4px 4px 0px #09090b;
}
```

---

## 3. Jerarquía Tipográfica y Reglas de Uso

| Token Tailwind | Variable Fuente | Fuente Base | Peso / Estilo | Uso Primario |
| :--- | :--- | :--- | :--- | :--- |
| `font-poppins` | `var(--font-poppins)` | Poppins | **ExtraBold (800) / Black (900)** | **Titulares H1 de Hero, H2 de secciones principales (Sentence case, minimalista)** |
| `font-poppins` | `var(--font-poppins)` | Poppins | SemiBold (600) / Bold (700) | Botones primarios (CTAs), Navigation Bar, títulos de cards |
| `font-jakarta` | `var(--font-plus-jakarta-sans)` | Plus Jakarta Sans | Medium (500) / Regular (400) | Párrafos, cuerpo de texto principal, descripciones, formularios |
| `font-bebas` | `var(--font-bebas-neue)` | Bebas Neue | Regular (Display) | Badges numéricos, estadísticas destacadas ("5M+", "4.9") |
| `font-jetbrains` | `var(--font-jetbrains-mono)` | JetBrains Mono | Medium (500) | Metadata, tags técnicos, códigos de descuento/precios |

### Ejemplos de Implementación Tipográfica Minimalista (Estilo Referencia)

```tsx
// Titular Principal H1 Minimalista & Elegante
<h1 className="font-poppins font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight text-black leading-[1.08]">
  La magia de transformar <br className="hidden sm:inline" />
  tu voz desde el ser.
</h1>

// Bajada / Párrafo descriptivo en alta legibilidad
<p className="font-jakarta font-medium text-lg md:text-xl text-gray-900 leading-relaxed max-w-xl">
  Un método integral donde la técnica vocal, la expresión corporal y las emociones se unen para liberar tu verdadero potencial artístico.
</p>
```

---

## 4. Componentes Base y Reglas de Estilizado

### 4.1 Botones Modernos Pop Minimal
Los botones combinan esquinas redondeadas modernas (`rounded-2xl` o `rounded-full`), pesos tipográficos marcados en `Poppins` y micro-interacciones suaves.

```tsx
// Botón Primario Destacado (Amarillo / Naranja Pop)
<button className="
  font-poppins font-bold text-base md:text-lg text-black
  bg-yellow hover:bg-orange 
  px-8 py-4 rounded-2xl
  shadow-soft-md hover:shadow-soft-lg
  hover:-translate-y-0.5 active:translate-y-0
  transition-all duration-200 ease-out inline-flex items-center gap-2
">
  QUIERO TENER LA MAGIA
</button>

// Botón Secundario (Texto Elegante con Flecha/Subrayado)
<button className="
  font-poppins font-bold text-base text-black 
  hover:text-purple transition-colors 
  inline-flex items-center gap-2 underline underline-offset-4 decoration-2
">
  VER NUESTROS SERVICIOS →
</button>
```

### 4.2 Tarjetas y Cards (Soft Cards & Stats)
Tarjetas limpias con bordes muy suaves (`rounded-3xl`), fondo blanco o gris claro, ideales para mostrar estadísticas o programas de servicio.

```tsx
// Card de Estadísticas / Beneficios
<div className="
  bg-gray-100/80 backdrop-blur-sm 
  p-8 rounded-3xl 
  flex flex-col gap-2 
  border border-gray-200/60
">
  <span className="font-poppins font-black text-4xl lg:text-5xl text-black">
    4.9 ★
  </span>
  <span className="font-jakarta text-sm font-semibold text-gray-900">
    Valoración promedio de más de 500 alumnos formados.
  </span>
</div>
```

---

## 5. Decoración de Iconos Flotantes Libre (`lib/iconsLibrary.jsx`) & Composiciones Orgánicas

Inspirado en el diseño de referencia, la combinación de **bloques orgánicos de color (blobs)** con **iconos trazados a mano** crea dinamismo sin saturate el espacio.

### 5.1 Enmarcado de la Imagen de Yanetsis (Hero Concept)
- **Fondo Bloob:** Figura orgánica o tarjeta redondeada (`rounded-[2.5rem]`) en fondo `--color-violet` o `--color-pink-soft`.
- **Doodles Flotantes:** Flechas trazadas a mano apuntando al botón CTA y garabatos/rizos alrededor del sujeto.

### 5.2 Ejemplo de Código de la Sección Hero (Impeccable Ready)

```tsx
import Image from 'next/image';
import { 
  IconArrowHand, 
  IconCurlyDoodle, 
  IconStarPop, 
  IconSparkle 
} from '@/lib/iconsLibrary';

export default function HeroSection() {
  return (
    <section className="relative bg-white min-h-[90vh] px-6 py-12 lg:py-20 overflow-hidden flex items-center">
      
      {/* 1. DECORACIÓN FLOTANTE (ABSOLUTE STACKING) */}
      
      {/* Flecha trazada a mano que apunta al CTA */}
      <div className="absolute top-[68%] left-[18%] z-20 rotate-[-12deg] pointer-events-none hidden lg:block">
        <IconArrowHand className="w-20 h-20 text-pink stroke-[2.5]" />
      </div>

      {/* Rizos / Doodles cerca de la foto principal */}
      <div className="absolute top-16 right-[38%] z-10 rotate-12 pointer-events-none opacity-80 hidden md:block">
        <IconCurlyDoodle className="w-24 h-24 text-purple" />
      </div>

      {/* Estrellita de acento */}
      <div className="absolute bottom-16 left-12 z-10 animate-pulse">
        <IconSparkle className="w-10 h-10 text-yellow" />
      </div>

      {/* 2. GRID PRINCIPAL */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Columna Izquierda: Mensaje & CTA */}
        <div className="lg:col-span-7 flex flex-col gap-6 items-start">
          <h1 className="font-poppins font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight text-black leading-[1.08]">
            Descubre la magia <br />
            de cantar con libertad.
          </h1>
          
          <p className="font-jakarta font-medium text-lg sm:text-xl text-gray-900 leading-relaxed max-w-xl">
            Entrenamiento vocal integral que conecta tu voz, cuerpo y emociones. Aprende a interpretar sin miedos y con técnica profesional.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button className="font-poppins font-bold text-base md:text-lg text-black bg-yellow hover:bg-orange px-8 py-4 rounded-2xl shadow-soft-md hover:shadow-soft-lg transition-all duration-200">
              QUIERO TENER LA MAGIA
            </button>
            <button className="font-poppins font-bold text-base text-black hover:text-purple transition-colors px-4 py-4 underline underline-offset-4">
              Ver programas →
            </button>
          </div>
        </div>

        {/* Columna Derecha: Foto de Yanetsis + Backdrop Orgánico */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          {/* Fondo Orgánico (Blob Container) */}
          <div className="absolute inset-0 bg-violet rounded-[3rem] rotate-3 scale-105 z-0" />
          
          {/* Imagen Principal */}
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.5rem]">
            <Image
              src="/assets/yanetsis.webp"
              alt="Yanetsis - Coach Vocal"
              width={600}
              height={700}
              quality={100}
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </div>

      </div>

    </section>
  );
}
```

---

## 6. Adaptación Móvil & Responsive Design

- En pantallas pequeñas (`< 768px`), el tamaño del titular H1 baja a `text-4xl` a `text-5xl` para garantizar que no haya saltos de línea incómodos.
- Los elementos flotantes secundarios (`IconCurlyDoodle`, `IconArrowHand`) se ocultan en móvil mediante `hidden lg:block` para preservar un diseño despejado y de alta velocidad de lectura.
- Los botones principales adoptan ancho completo (`w-full sm:w-auto`) en móvil para mejorar la tasa de conversión (CRO).

---

## 7. Instrucciones para Impeccable (Dev Guidelines)

1. **Uso estricto de Poppins Black:** Para todos los titulares de sección (`h1`, `h2`), usa `font-poppins font-black tracking-tight text-black`.
2. **Cuerpo de texto en Plus Jakarta Sans:** Toda lectura larga, descripciones de cards y labels deben usar `font-jakarta`.
3. **Consistencia de Tokens:** Consume únicamente los nombres de variables de color declarados en `globals.css` (`bg-violet`, `bg-yellow`, `text-purple`, etc.).
4. **Respetar la librería de iconos:** Importa la decoración flotante siempre desde `@/lib/iconsLibrary`.