"use client";

import { useState } from "react";
import { CheckCircle2, Send, Briefcase, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";

const WORK_AREAS = [
  {
    num: "01",
    title: "Voz para liderazgo y comunicación profesional",
    description: "Entrenamiento para proyectar la voz con seguridad, claridad e intención en reuniones, presentaciones y escenarios de alto nivel.",
    badge: "Liderazgo & Autoridad",
    bg: "bg-pink-soft",
    cols: "md:col-span-2 lg:col-span-2",
    rotate: "-rotate-1"
  },
  {
    num: "02",
    title: "Vocería, discursos y medios",
    description: "Estructura, emoción y credibilidad para conectar directamente con la audiencia y prensa.",
    badge: "Vocería",
    bg: "bg-mint",
    cols: "md:col-span-1 lg:col-span-1",
    rotate: "rotate-1"
  },
  {
    num: "03",
    title: "Seguridad vocal y miedo escénico",
    description: "Control de nervios, bloqueos y ansiedad al hablar en público para sostener la voz con soltura.",
    badge: "Confianza Vocal",
    bg: "bg-[#FEF9C3]",
    cols: "md:col-span-1 lg:col-span-1",
    rotate: "-rotate-1"
  },
  {
    num: "04",
    title: "Presencia escénica y lenguaje corporal",
    description: "Trabajo integral de postura, respiración, mirada y gestualidad frente al público o la cámara.",
    badge: "Expresión Corporal",
    bg: "bg-[#F3E8FF]",
    cols: "md:col-span-2 lg:col-span-2",
    rotate: "rotate-1"
  },
  {
    num: "05",
    title: "Voz para docentes, conferencistas y formadores",
    description: "Cuidado vocal intensivo, proyección sin fatiga y dinámicas de engagement.",
    badge: "Formadores",
    bg: "bg-white",
    cols: "md:col-span-1 lg:col-span-1",
    rotate: "rotate-0"
  },
  {
    num: "06",
    title: "Experiencias de bienestar y equipo",
    description: "Talleres vivenciales de cohesión, escucha activa y comunicación humana corporativa.",
    badge: "Team Building",
    bg: "bg-yellow",
    cols: "md:col-span-2 lg:col-span-2",
    rotate: "-rotate-1"
  }
];

const FORMATS = [
  "Conferencias",
  "Talleres empresariales",
  "Entrenamientos grupales",
  "Sesiones directivas",
  "Preparación de voceros",
  "Programas para docentes",
  "Experiencias de bienestar"
];

const ENTITY_TYPES = ["Empresa privada", "Institución educativa", "Entidad pública", "Fundación / ONG", "Otro"];
const LOCATION_OPTIONS = ["En sus instalaciones", "En La Magia de Cantar", "Virtual", "Híbrido"];
const PARTICIPANT_OPTIONS = ["1 a 5 personas", "6 a 15 personas", "16 a 30 personas", "Más de 30 personas"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,30}$/;

export default function EmpresasEInstituciones() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState("");

  const [formData, setFormData] = useState({
    empresa: "",
    tipoEntidad: "",
    nombreContacto: "",
    cargo: "",
    email: "",
    telefono: "",
    ciudad: "",
    lugar: "",
    participantes: "",
    servicioInteres: "",
    objetivo: "",
    duracionDeseada: "",
  });

  const validateStep = (step: number) => {
    setStepError("");
    if (step === 1) {
      if (!formData.tipoEntidad) {
        setStepError("Por favor selecciona el tipo de entidad.");
        return false;
      }
      if (!formData.empresa.trim()) {
        setStepError("Por favor ingresa el nombre de la empresa o entidad.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setStepError("");
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    setStepError("");
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nombreContacto = formData.nombreContacto.trim();
    const cargo = formData.cargo.trim();
    const email = formData.email.trim();
    const telefono = formData.telefono.trim();
    const ciudad = formData.ciudad.trim();
    const empresa = formData.empresa.trim();
    const objetivo = formData.objetivo.trim();

    if (!nombreContacto || !cargo || !email || !telefono || !ciudad) {
      setStepError("Por favor completa los campos de contacto requeridos (*).");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setStepError("Por favor ingresa un correo válido.");
      return;
    }
    if (!PHONE_RE.test(telefono)) {
      setStepError("Por favor ingresa un teléfono válido (dígitos, espacios, + y -).");
      return;
    }
    setStepError("");
    setFormData({ ...formData, nombreContacto, cargo, email, telefono, ciudad, empresa, objetivo });
    setIsSubmitted(true);
  };

  return (
    <section
      id="empresas-e-instituciones"
      aria-labelledby="empresas-titulo"
      className="relative w-full overflow-hidden bg-[#FFFBEB] py-16 sm:py-20 lg:py-24"
    >
      {/* 📍 Fondo Vectorial Repetido */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-15 bg-[url('/assets/patron-2.svg')] bg-repeat bg-top-left [background-size:1400px] md:bg-auto"
      ></div>

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

        {/* 2. ÁREAS DE TRABAJO (BENTO BOX CON NÚMEROS GIGANTES) */}
        <div className="mt-14">
          <div className="mb-8 text-center">
            <h3 className="font-poppins text-2xl font-black text-black sm:text-3xl">
              ¿Qué podemos trabajar con tu equipo?
            </h3>
            <p className="mt-2 font-jakarta text-sm text-gray-600">
              Módulos adaptables según los retos específicos de comunicación de tu organización.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {WORK_AREAS.map((area) => (
              <div
                key={area.num}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-black ${area.bg} ${area.cols} ${area.rotate} p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
              >
                <span className="pointer-events-none absolute -right-2 -top-4 select-none font-poppins text-8xl font-black opacity-10 text-black">
                  {area.num}
                </span>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block rounded-md border border-black bg-white px-2.5 py-0.5 font-poppins text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {area.badge}
                    </span>
                    <span className="font-poppins text-xs font-black text-black/60">
                      #{area.num}
                    </span>
                  </div>

                  <h4 className="mt-4 font-poppins text-xl font-extrabold text-black leading-snug">
                    {area.title}
                  </h4>
                  <p className="mt-2 font-jakarta text-sm leading-relaxed text-gray-800 font-medium">
                    {area.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. FORMATOS DISPONIBLES: CINTA BANNER CONTINUA */}
        <div className="mt-16 rounded-2xl border-2 border-black bg-purple py-3.5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white">
          <p className="mb-2 text-center font-poppins text-[10px] font-black uppercase tracking-widest text-yellow">
            ✦ FORMATOS DISPONIBLES Y A LA MEDIDA ✦
          </p>
          
          <div className="flex w-full overflow-x-auto no-scrollbar py-1">
            <div className="flex shrink-0 items-center gap-2 px-3">
              {FORMATS.concat(FORMATS).map((format, idx) => (
                <span
                  key={idx}
                  className="whitespace-nowrap rounded-lg border border-white/20 bg-white/10 px-3 py-1 font-poppins text-xs font-bold text-white backdrop-blur-sm"
                >
                  ✦ {format}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4. FRASE DE IMPACTO */}
        <div className="mt-14 text-center">
          <div className="mx-auto max-w-3xl rounded-3xl border-2 border-black bg-pink-soft p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            <p className="font-poppins text-lg font-black text-black sm:text-2xl leading-snug">
              &ldquo;Una voz entrenada proyecta seguridad, despierta confianza y deja una huella en quienes escuchan.&rdquo;
            </p>
          </div>
        </div>

        {/* 5. FORMULARIO PASO A PASO */}
        <div id="formulario-cotizacion" className="mt-16 scroll-mt-10">
          <div className="relative mx-auto max-w-3xl rounded-3xl border-2 border-black bg-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-mint px-3.5 py-1 font-poppins text-[11px] font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Briefcase className="h-3.5 w-3.5" /> Cotización Rápida
              </span>
              <h3 className="mt-3 font-poppins text-2xl font-black text-black sm:text-3xl">
                Diseñemos una experiencia para tu organización
              </h3>
            </div>

            {isSubmitted ? (
              <div className="mt-8 rounded-2xl border-2 border-black bg-mint p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fadeIn">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" />
                <h4 className="mt-4 font-poppins text-2xl font-black text-black">
                  ¡Solicitud recibida con éxito!
                </h4>
                <p className="mt-2 font-jakarta text-sm font-medium text-gray-800 leading-relaxed">
                  Revisaremos tus requerimientos y nos pondremos en contacto contigo a la brevedad.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentStep(1);
                    setFormData({
                      empresa: "",
                      tipoEntidad: "",
                      nombreContacto: "",
                      cargo: "",
                      email: "",
                      telefono: "",
                      ciudad: "",
                      lugar: "",
                      participantes: "",
                      servicioInteres: "",
                      objetivo: "",
                      duracionDeseada: "",
                    });
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-5 py-2.5 font-poppins text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <div className="mt-6">
                
                {/* BARRA DE PROGRESO */}
                <div className="mb-6">
                  <div className="flex items-center justify-between font-poppins text-xs font-black text-gray-500 uppercase mb-2">
                    <span>Paso {currentStep} de 3</span>
                    <span>
                      {currentStep === 1 && "1. Tu Entidad"}
                      {currentStep === 2 && "2. La Capacitación"}
                      {currentStep === 3 && "3. Contacto"}
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full border-2 border-black bg-gray-100 p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div
                      className="h-full rounded-full bg-purple transition-all duration-300"
                      style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  onKeyDown={(e) => {
                    const tag = (e.target as HTMLElement).tagName;
                    if (e.key === "Enter" && (tag === "INPUT" || tag === "SELECT")) {
                      e.preventDefault();
                    }
                  }}
                  className="space-y-6"
                >
                  
                  {/* PASO 1: TU ENTIDAD */}
                  {currentStep === 1 && (
                    <div className="space-y-5 animate-fadeIn">
                      
                      <div>
                        <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                          Tipo de entidad *
                        </label>
                        <select
                          value={formData.tipoEntidad}
                          onChange={(e) => {
                            setFormData({ ...formData, tipoEntidad: e.target.value });
                            setStepError("");
                          }}
                          className={`w-full rounded-xl border-2 border-black px-4 py-3 font-jakarta text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                            formData.tipoEntidad === "" ? "bg-gray-50 text-gray-500" : "bg-gray-50 text-black"
                          }`}
                        >
                          <option value="" disabled hidden>
                            -- Selecciona el tipo de entidad --
                          </option>
                          {ENTITY_TYPES.map((type) => (
                            <option key={type} value={type} className="text-black">
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                          Nombre de la empresa o entidad *
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Banco Nacional / Universidad X"
                          maxLength={120}
                          value={formData.empresa}
                          onChange={(e) => {
                            setFormData({ ...formData, empresa: e.target.value });
                            setStepError("");
                          }}
                          className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        />
                      </div>

                      <div>
                        <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                          Número estimado de participantes
                        </label>
                        <select
                          value={formData.participantes}
                          onChange={(e) => setFormData({ ...formData, participantes: e.target.value })}
                          className={`w-full rounded-xl border-2 border-black px-4 py-3 font-jakarta text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                            formData.participantes === "" ? "bg-gray-50 text-gray-500" : "bg-gray-50 text-black"
                          }`}
                        >
                          <option value="" disabled hidden>
                            -- Selecciona participantes estimados (Opcional) --
                          </option>
                          {PARTICIPANT_OPTIONS.map((p) => (
                            <option key={p} value={p} className="text-black">
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>
                  )}

                  {/* PASO 2: LA CAPACITACIÓN */}
                  {currentStep === 2 && (
                    <div className="space-y-5 animate-fadeIn">
                      
                      <div>
                        <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                          Lugar preferido para la capacitación
                        </label>
                        <select
                          value={formData.lugar}
                          onChange={(e) => {
                            setFormData({ ...formData, lugar: e.target.value });
                            setStepError("");
                          }}
                          className={`w-full rounded-xl border-2 border-black px-4 py-3 font-jakarta text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                            formData.lugar === "" ? "bg-gray-50 text-gray-500" : "bg-gray-50 text-black"
                          }`}
                        >
                          <option value="" disabled hidden>
                            -- Selecciona lugar preferido --
                          </option>
                          {LOCATION_OPTIONS.map((loc) => (
                            <option key={loc} value={loc} className="text-black">
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                            Área de interés principal
                          </label>
                          <select
                            value={formData.servicioInteres}
                            onChange={(e) => {
                              setFormData({ ...formData, servicioInteres: e.target.value });
                              setStepError("");
                            }}
                            className={`w-full rounded-xl border-2 border-black px-4 py-3 font-jakarta text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                              formData.servicioInteres === "" ? "bg-gray-50 text-gray-500" : "bg-gray-50 text-black"
                            }`}
                          >
                            <option value="" disabled hidden>
                              -- Selecciona un área --
                            </option>
                            {WORK_AREAS.map((a) => (
                              <option key={a.num} value={a.title} className="text-black">
                                {a.title}
                              </option>
                            ))}
                            <option value="Programa personalizado" className="text-black">
                              Programa integral a la medida
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                            Duración o formato deseado
                          </label>
                          <select
                            value={formData.duracionDeseada}
                            onChange={(e) => setFormData({ ...formData, duracionDeseada: e.target.value })}
                            className={`w-full rounded-xl border-2 border-black px-4 py-3 font-jakarta text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                              formData.duracionDeseada === "" ? "bg-gray-50 text-gray-500" : "bg-gray-50 text-black"
                            }`}
                          >
                            <option value="" disabled hidden>
                              -- Selecciona duración (Opcional) --
                            </option>
                            <option value="Conferencia" className="text-black">Conferencia (1 a 2 horas)</option>
                            <option value="Taller de medio día" className="text-black">Taller de medio día (4 horas)</option>
                            <option value="Taller de un día" className="text-black">Taller full day (8 horas)</option>
                            <option value="Proceso de varias sesiones" className="text-black">Proceso continuo</option>
                            <option value="Por definir" className="text-black">Por definir</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                          ¿Qué objetivo o reto quieren resolver? (Opcional)
                        </label>
                        <textarea
                          rows={2}
                          maxLength={1000}
                          placeholder="Ej: Preparar a nuestros voceros para una rueda de prensa..."
                          value={formData.objetivo}
                          onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                          className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        />
                      </div>
                    </div>
                  )}

                  {/* PASO 3: CONTACTO */}
                  {currentStep === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                            Persona de contacto *
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Laura Pérez"
                            maxLength={120}
                            value={formData.nombreContacto}
                            onChange={(e) => {
                              setFormData({ ...formData, nombreContacto: e.target.value });
                              setStepError("");
                            }}
                            className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          />
                        </div>

                        <div>
                          <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                            Cargo *
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Gerente de RRHH"
                            maxLength={80}
                            value={formData.cargo}
                            onChange={(e) => {
                              setFormData({ ...formData, cargo: e.target.value });
                              setStepError("");
                            }}
                            className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                            Correo corporativo *
                          </label>
                          <input
                            type="email"
                            placeholder="contacto@empresa.com"
                            maxLength={254}
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value });
                              setStepError("");
                            }}
                            className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          />
                        </div>

                        <div>
                          <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                            Teléfono / WhatsApp *
                          </label>
                          <input
                            type="tel"
                            placeholder="+57 300 000 0000"
                            maxLength={30}
                            value={formData.telefono}
                            onChange={(e) => {
                              setFormData({ ...formData, telefono: e.target.value });
                              setStepError("");
                            }}
                            className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Bogotá / Barranquilla"
                          maxLength={80}
                          value={formData.ciudad}
                          onChange={(e) => {
                            setFormData({ ...formData, ciudad: e.target.value });
                            setStepError("");
                          }}
                          className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        />
                      </div>
                    </div>
                  )}

                  {/* MENSAJE DE ERROR DINÁMICO */}
                  <div
                    aria-live="polite"
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      stepError ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      {stepError && (
                        <div className="flex items-center gap-2 rounded-xl border-2 border-black bg-pink-soft p-3 text-xs font-extrabold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-fadeIn">
                          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                          <span>{stepError}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CONTROLES DE NAVEGACIÓN */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center gap-1 rounded-xl border-2 border-black bg-white px-4 py-2.5 font-poppins text-xs font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100"
                      >
                        <ChevronLeft className="h-4 w-4" /> Anterior
                      </button>
                    ) : <div />}

                    <button
                      type="button"
                      onClick={nextStep}
                      className={
                        currentStep === 3
                          ? "hidden"
                          : "inline-flex items-center gap-1 rounded-xl border-2 border-black bg-yellow px-6 py-2.5 font-poppins text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow/90"
                      }
                    >
                      Siguiente <ChevronRight className="h-4 w-4" />
                    </button>

                    <button
                      type="submit"
                      className={
                        currentStep < 3
                          ? "hidden"
                          : "inline-flex items-center gap-2 rounded-xl border-2 border-black bg-yellow px-6 py-3 font-poppins text-xs font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow/90"
                      }
                    >
                      <Send className="h-4 w-4" /> SOLICITAR PROPUESTA
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}