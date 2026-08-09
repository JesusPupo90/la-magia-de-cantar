"use client";

import { useState } from "react";
import { CheckCircle2, Send, Briefcase } from "lucide-react";

const WORK_AREAS = [
  {
    title: "Voz para liderazgo y comunicación profesional",
    description: "Entrenamiento para proyectar la voz con seguridad, claridad, intención y autoridad en reuniones, presentaciones, escenarios o espacios institucionales.",
    badge: "Liderazgo & Autoridad"
  },
  {
    title: "Vocería, discursos y transmisión de mensaje",
    description: "Preparación para líderes y voceros que necesitan comunicar ideas con estructura, emoción, credibilidad y conexión directa con la audiencia.",
    badge: "Vocería & Medios"
  },
  {
    title: "Seguridad vocal y manejo del miedo escénico",
    description: "Herramientas técnicas para controlar nervios, bloqueos, ansiedad al hablar en público y dificultad para sostener la voz en momentos de alta exposición.",
    badge: "Confianza Vocal"
  },
  {
    title: "Presencia escénica y lenguaje corporal",
    description: "Trabajo integral sobre postura, respiración, mirada, gestualidad, lenguaje no verbal y manejo del espacio frente al público o la cámara.",
    badge: "Expresión Corporal"
  },
  {
    title: "Voz para docentes, conferencistas y formadores",
    description: "Entrenamiento para profesionales que usan su voz de manera intensiva: cuidado vocal, proyección sin fatiga y dinámicas para mantener enganchada a la audiencia.",
    badge: "Formadores & Salud Vocal"
  },
  {
    title: "Experiencias de voz, bienestar y equipo",
    description: "Talleres vivenciales diseñados para fortalecer confianza, escucha activa, cohesión de equipo, respiración y comunicación humana en la organización.",
    badge: "Team Building & Bienestar"
  }
];

const FORMATS = [
  "Conferencias",
  "Talleres empresariales",
  "Entrenamientos grupales",
  "Sesiones para equipos directivos",
  "Preparación de voceros",
  "Programas para docentes",
  "Experiencias de bienestar y voz",
  "Procesos personalizados para líderes"
];

export default function EmpresasEInstituciones() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    empresa: "",
    tipoEntidad: "Empresa privada",
    contacto: "",
    cargo: "",
    email: "",
    telefono: "",
    ciudad: "",
    lugar: "En las instalaciones de la entidad",
    participantes: "6 a 15 personas",
    servicioInteres: "Voz para liderazgo y comunicación profesional",
    objetivo: "",
    fechaTentativa: "",
    duracionDeseada: "Taller de medio día",
    mensaje: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se conectará el envío por API o EmailJS / Supabase
    setIsSubmitted(true);
  };

  return (
    <section
      id="empresas-e-instituciones"
      aria-labelledby="empresas-titulo"
      className="relative w-full overflow-hidden bg-[#FFFBEB] py-16 sm:py-20 lg:py-24"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 1. ENCABEZADO Y PROPUESTA B2B */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-yellow px-4 py-1.5 font-poppins text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            ✦ EMPRESAS E INSTITUCIONES
          </p>

          <h2
            id="empresas-titulo"
            className="mt-6 font-poppins text-3xl font-extrabold tracking-tight text-black sm:text-5xl"
          >
            Tu voz refleja liderazgo, <br className="hidden sm:inline" />
            <span className="relative inline-block mt-2">
              seguridad y presencia.
            </span>
          </h2>

          <p className="mt-4 font-jakarta text-base leading-relaxed text-gray-800 sm:text-lg">
            En el mundo corporativo e institucional, la voz construye reputación. Diseñamos entrenamientos vocales corporativos y experiencias a la medida con Yanetsis Alfonso para potenciar la comunicación de tus equipos.
          </p>
        </div>

        {/* 2. ÁREAS DE TRABAJO (GRILLA DE SERVICIOS CORPORATIVOS) */}
        <div className="mt-14">
          <div className="mb-8 text-center">
            <h3 className="font-poppins text-2xl font-black text-black sm:text-3xl">
              ¿Qué podemos trabajar con tu equipo?
            </h3>
            <p className="mt-2 font-jakarta text-sm text-gray-600">
              Módulos adaptables según los retos específicos de comunicación de tu organización.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {WORK_AREAS.map((area, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <div>
                  <span className="inline-block rounded-md border border-black bg-pink-soft px-2.5 py-0.5 font-poppins text-[10px] font-black uppercase text-black">
                    {area.badge}
                  </span>
                  <h4 className="mt-3 font-poppins text-lg font-extrabold text-black leading-snug">
                    {area.title}
                  </h4>
                  <p className="mt-2 font-jakarta text-sm leading-relaxed text-gray-700">
                    {area.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. FORMATOS DISPONIBLES (STICKERS) */}
        <div className="mt-12 rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="max-w-md text-center lg:text-left">
              <span className="font-poppins text-xs font-black uppercase text-purple">Formatos Flexibles</span>
              <h4 className="mt-1 font-poppins text-xl font-extrabold text-black">
                Adaptados a la dinámica de tu entidad
              </h4>
              <p className="mt-1 font-jakarta text-xs text-gray-600">
                Desde conferencias magistrales hasta procesos continuos de entrenamiento directivo.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 lg:max-w-xl">
              {FORMATS.map((format, idx) => (
                <span
                  key={idx}
                  className="rounded-xl border-2 border-black bg-mint px-3 py-1.5 font-poppins text-xs font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  ✦ {format}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4. FRASE DE IMPACTO */}
        <div className="mt-12 text-center">
          <div className="mx-auto max-w-3xl rounded-2xl border-2 border-black bg-purple p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white">
            <p className="font-poppins text-lg font-extrabold sm:text-xl leading-snug">
              &ldquo;Una voz entrenada proyecta seguridad, despierta confianza y deja una huella en quienes escuchan.&rdquo;
            </p>
          </div>
        </div>

        {/* 5. BLOQUE DEL FORMULARIO DE COTIZACIÓN */}
        <div id="formulario-cotizacion" className="mt-16 scroll-mt-10">
          <div className="mx-auto max-w-4xl rounded-3xl border-2 border-black bg-white p-6 sm:p-10 lg:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-pink-soft px-3 py-1 font-poppins text-[11px] font-black uppercase text-black">
                <Briefcase className="h-3.5 w-3.5" /> Propuesta Personalizada
              </span>
              <h3 className="mt-4 font-poppins text-2xl font-black text-black sm:text-4xl">
                Diseñemos una experiencia para tu empresa e institución
              </h3>
              <p className="mt-2 font-jakarta text-sm text-gray-700">
                Cuéntanos qué necesita tu equipo y prepararemos una propuesta a la medida con Yanetsis Alfonso.
              </p>
            </div>

            {isSubmitted ? (
              <div className="mt-8 rounded-2xl border-2 border-black bg-mint p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fadeIn">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" />
                <h4 className="mt-4 font-poppins text-2xl font-black text-black">
                  ¡Gracias por escribirnos!
                </h4>
                <p className="mt-2 font-jakarta text-sm font-medium text-gray-800 leading-relaxed">
                  Revisaremos tu solicitud y nos pondremos en contacto muy pronto para construir una propuesta a la medida de tu empresa o institución.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-5 py-2.5 font-poppins text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                
                {/* Fila 1: Datos de Empresa y Entidad */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                      Nombre de la empresa o entidad *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Banco Nacional / Universidad X"
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                      className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                      Tipo de entidad *
                    </label>
                    <select
                      value={formData.tipoEntidad}
                      onChange={(e) => setFormData({ ...formData, tipoEntidad: e.target.value })}
                      className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                    >
                      <option value="Empresa privada">Empresa privada</option>
                      <option value="Institución educativa">Institución educativa</option>
                      <option value="Entidad pública">Entidad pública</option>
                      <option value="Fundación / ONG">Fundación / ONG</option>
                      <option value="Medio de comunicación">Medio de comunicación</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                {/* Fila 2: Datos del Contacto */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                      Persona de contacto *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nombre y Apellido"
                      value={formData.contacto}
                      onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                      className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                      Cargo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Director de RRHH / Gerente"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                      className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                    />
                  </div>
                </div>

                {/* Fila 3: Email, Teléfono y Ciudad */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="correo@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+57 300 000 0000"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                    />
                  </div>

                  <div>
                    <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Bogotá / Barranquilla"
                      value={formData.ciudad}
                      onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                      className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                    />
                  </div>
                </div>

                {/* Fila 4: Lugar, Participantes y Servicio */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                      Lugar de capacitación
                    </label>
                    <select
                      value={formData.lugar}
                      onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                      className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                    >
                      <option value="En las instalaciones de la entidad">En sus instalaciones</option>
                      <option value="En La Magia de Cantar">En La Magia de Cantar</option>
                      <option value="Virtual">Virtual</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Por definir">Por definir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                      Participantes estimados
                    </label>
                    <select
                      value={formData.participantes}
                      onChange={(e) => setFormData({ ...formData, participantes: e.target.value })}
                      className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                    >
                      <option value="1 a 5 personas">1 a 5 personas</option>
                      <option value="6 a 15 personas">6 a 15 personas</option>
                      <option value="16 a 30 personas">16 a 30 personas</option>
                      <option value="Más de 30 personas">Más de 30 personas</option>
                      <option value="Por definir">Por definir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                      Duración deseada
                    </label>
                    <select
                      value={formData.duracionDeseada}
                      onChange={(e) => setFormData({ ...formData, duracionDeseada: e.target.value })}
                      className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                    >
                      <option value="Conferencia">Conferencia</option>
                      <option value="Taller de medio día">Taller de medio día</option>
                      <option value="Taller de un día">Taller de un día</option>
                      <option value="Proceso de varias sesiones">Varias sesiones</option>
                      <option value="Programa mensual">Programa mensual</option>
                      <option value="Por definir">Por definir</option>
                    </select>
                  </div>
                </div>

                {/* Fila 5: Servicio de Interés */}
                <div>
                  <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                    Servicio de interés principal
                  </label>
                  <select
                    value={formData.servicioInteres}
                    onChange={(e) => setFormData({ ...formData, servicioInteres: e.target.value })}
                    className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                  >
                    {WORK_AREAS.map((a, i) => (
                      <option key={i} value={a.title}>{a.title}</option>
                    ))}
                    <option value="Programa personalizado">Programa personalizado</option>
                    <option value="Quiero orientación">Quiero orientación</option>
                  </select>
                </div>

                {/* Fila 6: Objetivos y Mensaje */}
                <div>
                  <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                    Objetivo de la capacitación
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Cuéntanos qué quieren lograr, qué reto tienen o qué tipo de experiencia están buscando."
                    value={formData.objetivo}
                    onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                    className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple"
                  />
                </div>

                {/* Botón de Enviar */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-black bg-yellow px-8 py-4 font-poppins text-base font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-yellow/90 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0"
                  >
                    <Send className="h-5 w-5" /> ENVIAR SOLICITUD
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}