# SISTEMA DE DISEÑO Y GUÍA DE ESTILOS UI/UX
## YANETSIS + LA MAGIA DE CANTAR

> **Documento de Especificaciones de Diseño (Design System PRD)**  
> **Destinatario:** Opencode / Equipo de Desarrollo Frontend  
> **Estilo Visual:** Neo-Brutalismo / Pop Retro Vibrant  
> **Archivo de Configuración:** `globals.css` (Tailwind CSS v4)  
> **Versión:** 1.0  

---

## 1. Concepto e Identidad Visual (Pop Retro / Neo-Brutalismo)

El diseño de **YANETSIS + La Magia de Cantar** adopta una estética **Pop Retro Vibrant / Neo-Brutalista**. Este estilo combina energía, dinamismo artístico y autoridad vocal mediante:

- **Bordes gruesos y definidos** (`border-4`, `border-2`, `border-brown` / `border-black`).
- **Sombras sólidas proyectadas / extendidas sin difuminado (Hard Drop Shadows / Box Shadows Offset):** La sombra proyectada tiene el mismo color que el borde o fondo oscuro, dando un efecto 3D tipo cómic/retro.
- **Tipografía de gran impacto en titulares (Display Bold Stack):** Uso de fuentes ultra-condensadas (Bebas Neue) con trazos o sombras integradas en bloques de color interactivos.
- **Decoración flotante de sticker/doodle:** Elementos vectoriales (SVGs del módulo `lib/iconsLibrary.jsx`) posicionados de forma libre en la pantalla (`position: absolute`, `z-index`, `transform: rotate(...)`).
- **Paleta de colores pop audaz:** Fondos con tonos magenta/pink intensos, botones naranja/amarillo con contrastes limpios y texto altamente legible.

---

## 2. Tokens de Diseño y Variables CSS (`globals.css`)

Toda la declaración de tokens sigue el estándar de **Tailwind CSS v4** declarado en `@theme inline` dentro de `globals.css`:

```css
@import "tailwindcss";

@theme inline {
  /* Tipografías */
  --font-bebas: var(--font-bebas-neue);
  --font-poppins: var(--font-poppins);
  --font-jakarta: var(--font-plus-jakarta-sans);
  --font-jetbrains: var(--font-jetbrains-mono);

  /* Paleta de Colores Pop Retro */
  --color-green: #9dc44d;
  --color-brown: #211915;
  --color-purple: #9f3aca;
  --color-violet: #7060c3;
  --color-blue: #5a9ee4;
  --color-yellow: #deb52c;
  --color-orange: #e17828;
  --color-red: #db2b3e;
  --color-dark-purple: #72408d;
  --color-pink: #dc0278;
  --color-black: #09090b;
  --color-gray-950: #18181b;
  --color-gray-900: #27272a;
  --color-gray-100: #f4f4f5;
  --color-gray-400: #a1a1aa;
  --color-lime: #a3e635;

  /* Sombra Sólida Neo-Brutalista (Hard Offset Shadow) */
  --shadow-pop-sm: 3px 3px 0px var(--color-brown);
  --shadow-pop: 5px 5px 0px var(--color-brown);
  --shadow-pop-lg: 8px 8px 0px var(--color-brown);
  --shadow-pop-xl: 12px 12px 0px var(--color-brown);
  
  --shadow-pop-black: 5px 5px 0px #09090b;
}
```

---

## 3. Jerarquía Tipográfica y Reglas de Uso

| Token Tailwind | Variable Fuente | Fuente Base | Uso Primario |
| :--- | :--- | :--- | :--- |
| `font-bebas` | `var(--font-bebas-neue)` | Bebas Neue | Titulares masivos, Hero H1, Badges de impacto, Nombres de Secciones |
| `font-poppins` | `var(--font-poppins)` | Poppins | Subtítulos H2/H3, Botones primarios (CTAs), Navigation Bar |
| `font-jakarta` | `var(--font-plus-jakarta-sans)` | Plus Jakarta Sans | Cuerpo de texto (Paragraphs), descripciones, formularios, modales |
| `font-jetbrains` | `var(--font-jetbrains-mono)` | JetBrains Mono | Etiquetas técnicas, precios, timestamps, metadatos, tags |

### Ejemplos de Clases Combinadas (Basado en Figma Hero)
```tsx
// Titular de Hero Estilo Pop Badge
<h1 className="font-bebas text-6xl md:text-8xl tracking-wide uppercase text-blue drop-shadow-[4px_4px_0px_#211915]">
  DESCUBRE LA MAGIA DE CANTAR
</h1>
```

---

## 4. Componentes Base y Reglas de Estilizado

### 4.1 Botones Neo-Brutalistas / Pop Retro
Los botones tienen bordes gruesos del tono oscuro (`--color-brown` o `--color-black`), esquinas ligeramente redondeadas (`rounded-xl` o `rounded-2xl`) y sombra sólida desplazada hacia abajo-derecha. Al hacer `:hover` o `:active`, el botón se desplaza (*translate*), simulando una pulsación física.

```tsx
// Botón Principal CTA ("Quiero tener la magia" / "Descubre tu voz ahora!")
<button className="
  font-poppins font-bold text-lg md:text-xl text-brown
  bg-orange hover:bg-yellow 
  border-3 border-brown 
  shadow-[4px_4px_0px_#211915] active:shadow-none
  hover:translate-x-[2px] hover:translate-y-[2px] 
  active:translate-x-[4px] active:translate-y-[4px]
  px-8 py-4 rounded-xl transition-all duration-150 ease-out
">
  Descubre tu voz ahora!
</button>
```

### 4.2 Tarjetas y Cards de Servicios
Las tarjetas utilizan bordes de `3px` o `4px`, fondo claro u opinado por categoría, y `box-shadow` duro.

```tsx
// Card Neo-Brutalista
<div className="
  bg-white border-3 border-brown 
  rounded-2xl p-6 
  shadow-[6px_6px_0px_#211915]
  hover:-translate-y-1 hover:shadow-[8px_8px_0px_#211915]
  transition-all duration-200 relative overflow-hidden
">
  {/* Contenido de Card */}
</div>
```

---

## 5. Decoración de Iconos Flotantes Libre (`lib/iconsLibrary.jsx`)

Para lograr el dinamismo visual Pop/Retro mostrado en el diseño de Figma (doodles de fondo, flechas dibujadas a mano, asterisco, corazones, likes, hashtags), utilizaremos las funciones del módulo `lib/iconsLibrary.jsx`.

### 5.1 Regla de Posicionamiento Libre (Absolute Canvas Stacking)
Los iconos de la librería se colocarán de forma libre e independiente a la cuadrícula (*grid/flex*) de la página.

#### Directrices de implementación:
1. El contenedor padre directo debe tener la clase `relative` u `overflow-hidden` (o `overflow-visible` si el sticker sobresale del bloque).
2. Los iconos SVG importados desde `lib/iconsLibrary.jsx` se envuelven en un contenedor con `absolute`, `z-index` ajustado y transformación de rotación aleatoria/deliberada (`rotate-12`, `-rotate-6`, etc.).
3. Se pueden animar con levitación suave (`animate-bounce` o `hover:scale-110`).

### 5.2 Ejemplo de Código con Iconos de `lib/iconsLibrary.jsx`

```tsx
import { 
  IconArrowHand, 
  IconHeart, 
  IconHashtag, 
  IconLike, 
  IconAsterisk 
} from '@/lib/iconsLibrary';

export default function HeroSection() {
  return (
    <section className="relative bg-pink min-h-screen p-8 overflow-hidden">
      
      {/* BACKGROUND DOODLES / DECORACIÓN FLOTANTE */}
      
      {/* 1. Flecha apuntando al CTA */}
      <div className="absolute bottom-24 left-[45%] z-20 rotate-[-15deg] pointer-events-none hidden md:block">
        <IconArrowHand className="w-24 h-24 text-orange stroke-[3]" />
      </div>

      {/* 2. Asterisco flotante arriba a la derecha */}
      <div className="absolute top-12 right-16 z-10 rotate-12 pointer-events-none animate-pulse">
        <IconAsterisk className="w-16 h-16 text-yellow" />
      </div>

      {/* 3. Corazón Pop cerca de la foto de Yanetsis */}
      <div className="absolute top-1/3 right-8 z-10 rotate-[-20deg] hover:scale-125 transition-transform">
        <IconHeart className="w-12 h-12 text-lime drop-shadow-[2px_2px_0px_#211915]" />
      </div>

      {/* 4. Hashtag en la esquina inferior izquierda */}
      <div className="absolute bottom-8 left-8 z-10 rotate-45 opacity-80">
        <IconHashtag className="w-14 h-14 text-purple" />
      </div>

      {/* CONTENIDO PRINCIPAL DE LA HERO (GRID/FLEX) */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Bloque Texto */}
        {/* Bloque Imagen con borde y shadow */}
      </div>
      
    </section>
  );
}
```

---

## 6. Adaptación Móvil y Responsividad

- En dispositivos móviles (`< 768px`), las sombras sólidas pesadas se reducen ligeramente (ej: de `shadow-[8px_8px_0px_#211915]` a `shadow-[4px_4px_0px_#211915]`) para evitar colisiones visuales.
- Los iconos flotantes libres (`absolute`) que interfieran con la lectura del texto en pantalla chica deberán ocultarse mediante `hidden md:block` o reducir su tamaño (`w-8 h-8`).