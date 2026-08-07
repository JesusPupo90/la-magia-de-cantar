import React from 'react';

// Ejemplo de componente con la estética Pop-Elegante usando tu paleta
export default function PropuestaPopElegante() {
  const servicios = [
    {
      title: "Técnica Vocal Saludable",
      desc: "Desarrolla afinación, potencia y control sin lastimar tu voz en el proceso.",
      color: "var(--color-pink)",
      badgeBg: "var(--color-pink-soft)",
      badgeText: "var(--color-pink)"
    },
    {
      title: "Confianza & Seguridad",
      desc: "Vence el miedo escénico al cantar en público y conecta con tu autenticidad.",
      color: "var(--color-yellow)",
      badgeBg: "#FEF9C3",
      badgeText: "#A16207"
    },
    {
      title: "Interpretación & Escena",
      desc: "Domina la expresión corporal, presencia e interpretación emocional arriba del escenario.",
      color: "var(--color-violet)",
      badgeBg: "var(--color-lilac)",
      badgeText: "var(--color-dark-purple)"
    },
    {
      title: "Proyección Artística",
      desc: "Prepárate para audiciones exigentes, grabaciones en estudio o realities de televisión.",
      color: "var(--color-mint)",
      badgeBg: "#CCFBF1",
      badgeText: "#0F766E"
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-black)', color: 'var(--color-gray-100)' }} className="min-h-screen font-sans selection:bg-[#dc0278] selection:text-white">
      
      {/* 1. HERO: IMPACTO POP RETRO */}
      <section className="relative pt-12 pb-20 border-b-4 border-[var(--color-gray-900)] overflow-hidden">
        
        {/* SVG Místico / Holístico de fondo (Ejemplo de Aura/Destello) */}
        <div className="absolute top-10 right-10 w-96 h-96 opacity-15 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-[var(--color-pink)]">
            <path d="M100 0 L123 77 L200 100 L123 123 L100 200 L77 123 L0 100 L77 77 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div 
              style={{ backgroundColor: 'var(--color-yellow)', color: 'var(--color-black)' }}
              className="inline-block px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_var(--color-gray-900)]"
            >
              ✦ Coach Vocal de Televisión ✦
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none uppercase">
              Descubre la <br />
              <span 
                style={{ color: 'var(--color-pink)' }}
                className="underline decoration-[var(--color-yellow)] decoration-wavy decoration-2"
              >
                Magia de Cantar
              </span>
            </h1>

            <p className="text-lg text-[var(--color-gray-400)] max-w-xl font-medium leading-relaxed">
              Prepara tu voz y domina el escenario con <strong className="text-white">Yanetsis Alfonso</strong>. Un entrenamiento integral diseñado para activar tu energía artística.
            </p>

            <div className="pt-2 flex gap-4">
              <button 
                style={{ 
                  backgroundColor: 'var(--color-pink)', 
                  boxShadow: '4px 4px 0px 0px var(--color-yellow)' 
                }}
                className="px-8 py-4 rounded-xl font-bold text-white hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all border-2 border-[var(--color-black)]"
              >
                Quiero tener la magia ✦
              </button>
            </div>
          </div>

          {/* Retrato con toque Brutalista Suave */}
          <div className="lg:col-span-5 flex justify-center">
            <div 
              style={{ 
                borderColor: 'var(--color-gray-900)', 
                boxShadow: '8px 8px 0px 0px var(--color-purple)' 
              }}
              className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border-4 bg-[var(--color-gray-950)]"
            >
              <img 
                src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800" 
                alt="Yanetsis Alfonso" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. CINTA MARQUEE (Divisor con toque Retro) */}
      <div 
        style={{ backgroundColor: 'var(--color-yellow)', color: 'var(--color-black)' }}
        className="py-3 font-black text-sm uppercase tracking-widest overflow-hidden whitespace-nowrap border-b-4 border-[var(--color-gray-900)]"
      >
        <div className="flex gap-8 animate-marquee">
          <span>★ LA VOZ KIDS</span>
          <span>★ YO ME LLAMO</span>
          <span>★ A OTRO NIVEL</span>
          <span>★ LA DESCARGA</span>
          <span>★ LA REINA DEL FLOW</span>
          <span>★ LA VOZ KIDS</span>
          <span>★ YO ME LLAMO</span>
          <span>★ A OTRO NIVEL</span>
        </div>
      </div>

      {/* 3. TRANSICIÓN A LO PULIDO: FILOSOFÍA Y SERVICIOS */}
      <section className="py-20 relative bg-[var(--color-gray-950)]">
        
        {/* Elemento Místico Discreto */}
        <div className="text-center mb-16 space-y-3 max-w-3xl mx-auto px-6">
          <div className="flex justify-center items-center gap-2 text-[var(--color-purple)] mb-2">
            <span>✧</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-lilac)]">Nuestra Filosofía</span>
            <span>✧</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Somos más que una escuela musical
          </h2>
          
          <p className="text-[var(--color-gray-400)] text-base sm:text-lg leading-relaxed">
            La magia de cantar es la conexión entre técnica, alma y presencia. Acompañamos tu proceso respetando tu esencia artística.
          </p>
        </div>

        {/* Tarjetas: Estructura Pulida con Acentos Pop */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicios.map((s, idx) => (
            <div 
              key={idx}
              style={{ 
                backgroundColor: 'var(--color-black)',
                borderColor: 'var(--color-gray-900)'
              }}
              className="p-6 rounded-2xl border-2 hover:border-[var(--color-purple)] transition-all hover:-translate-y-1 group relative"
            >
              {/* Badge sutil con color pop */}
              <div 
                style={{ backgroundColor: s.badgeBg, color: s.badgeText }}
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg mb-4"
              >
                0{idx + 1}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
              <p className="text-sm text-[var(--color-gray-400)] leading-relaxed">{s.desc}</p>

              {/* Detalle místico en hover */}
              <span className="absolute top-4 right-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-yellow)]">
                ✦
              </span>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
}