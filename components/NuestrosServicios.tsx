"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  ShieldCheck,
  Sparkles,
  Crown,
  Clock,
  MapPin,
  Users,
  Calendar
} from "lucide-react";
import type { ServiceItem } from "@/data/services";
import { formatCOP } from "@/utils/formatCurrency";

interface NuestrosServiciosProps {
  services: ServiceItem[];
}

export default function NuestrosServicios({ services }: NuestrosServiciosProps) {
  const CATEGORIES = [...new Set(services.map(s => s.category))];
  const [activeFilter, setActiveFilter] = useState(CATEGORIES[0]);
  const [selectedPlanIndexes, setSelectedPlanIndexes] = useState<{ [serviceId: string]: number }>({});
  const [expandedCards, setExpandedCards] = useState<{ [serviceId: string]: boolean }>({});
  const lastScrolled = useRef<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const matchedService = services.find(s => s.id === hash);
        if (matchedService) {
          setActiveFilter(matchedService.category);
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [services]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash || lastScrolled.current === hash) return;
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      lastScrolled.current = hash;
    }
  }, [activeFilter]);

  const filteredServices = services.filter(s => s.category === activeFilter);

  const handleSelectPlan = (serviceId: string, idx: number) => {
    setSelectedPlanIndexes(prev => ({ ...prev, [serviceId]: idx }));
  };

  const toggleExpandCard = (serviceId: string) => {
    setExpandedCards(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };

  return (
    <section
      id="nuestros-servicios"
      aria-labelledby="servicios-titulo"
      className="relative w-full overflow-hidden bg-mint py-16 sm:py-20 lg:py-24"
    >
      {/* 📍 Fondo Vectorial con Opacidad Suavizada para No Interferir con la Lectura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-15 bg-[url('/assets/patron-1.svg')] bg-repeat bg-top-left [background-size:1400px] md:bg-auto"
      ></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 1. ENCABEZADO DENTRO DE "STICKER CARD" PARA MÁXIMO CONTRASTE */}
        <div className="mx-auto max-w-3xl text-center rounded-3xl border-2 border-black bg-white p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-pink-soft px-4 py-1.5 font-poppins text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            ✦ NUESTROS SERVICIOS
          </p>

          <h2
            id="servicios-titulo"
            className="mt-6 font-poppins text-3xl font-extrabold tracking-tight text-black sm:text-5xl"
          >
            Elige cómo quieres empezar <br className="hidden sm:inline" />
            <span className="relative inline-block mt-2">
              a entrenar tu voz.
            </span>
          </h2>

          <p className="mt-4 font-jakarta text-base leading-relaxed text-gray-800 font-medium sm:text-lg">
            En La Magia de Cantar cada voz tiene una ruta. Encuentra el proceso que necesitas e invierte en línea de forma fácil y segura.
          </p>

          {/* Badges en Cajas Sólidas con Borde Negro */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#F8FAFC] px-3.5 py-1.5 font-poppins text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Pago seguro
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#F8FAFC] px-3.5 py-1.5 font-poppins text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="h-4 w-4 text-amber-500" /> Planes flexibles
            </span>
          </div>
        </div>

        {/* 2. NAVEGACIÓN DE CATEGORÍAS */}
        <div className="mt-8 sm:hidden sticky top-4 z-20 px-2">
  <div className="rounded-2xl border-2 border-black bg-yellow p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
    <label
      htmlFor="mobile-category-select"
      className="mb-1.5 flex items-center justify-center gap-1.5 font-poppins text-[11px] font-black uppercase tracking-wider text-black"
    >
      <span>✨ ESTOY BUSCANDO:</span>
    </label>
    <div className="relative">
      <select
        id="mobile-category-select"
        value={activeFilter}
        onChange={(e) => setActiveFilter(e.target.value)}
        className="w-full rounded-xl border-2 border-black bg-white px-3.5 py-2.5 font-poppins text-xs font-extrabold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-purple"
      >
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

        <div className="mt-10 hidden sm:block">
          <p className="mb-3 text-center font-poppins text-xs font-black uppercase tracking-wider text-black">
            Estoy buscando:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 justify-center no-scrollbar px-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`whitespace-nowrap shrink-0 rounded-xl border-2 border-black px-4 py-2 font-poppins text-xs font-bold transition-all duration-200 ${activeFilter === category
                  ? "bg-purple text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                  : "bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 3. GRILLA DE TARJETAS */}
        <div className={`mt-8 grid gap-4 ${filteredServices.length === 1
          ? "max-w-md mx-auto grid-cols-1"
          : filteredServices.length === 2
            ? "max-w-3xl mx-auto grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}>
          {filteredServices.map((service) => {
            const isExpanded = !!expandedCards[service.id];

            const recommendedIdx = service.plans.findIndex(p => p.isRecommended);
            const defaultIdx = recommendedIdx !== -1 ? recommendedIdx : 0;
            const currentPlanIdx = selectedPlanIndexes[service.id] ?? defaultIdx;
            const selectedPlan = service.plans[currentPlanIdx] || service.plans[0];

            return (
              <article
                key={service.id}
                id={service.id}
                className={`group relative flex flex-col justify-between rounded-3xl border-2 border-black bg-white p-5 transition-all duration-300 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${service.isSpecial ? "bg-[#FEF9C3] border-amber-500" : ""
                  }`}
              >
                <div>
                  {/* Encabezado Tarjeta */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block rounded-md border border-black bg-pink-soft/80 px-2.5 py-0.5 font-poppins text-[10px] font-black uppercase text-black">
                        {service.microTitle}
                      </span>
                      <h3 className="mt-2 font-poppins text-xl font-extrabold text-black sm:text-2xl">
                        {service.title}
                      </h3>
                    </div>
                    {service.isSpecial && (
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-black bg-yellow text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Crown className="h-5 w-5" />
                      </span>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 flex flex-wrap gap-2 font-jakarta text-xs font-semibold text-gray-700">
                    {service.metadata.age && (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-1">
                        <Users className="h-3.5 w-3.5 text-gray-500" /> {service.metadata.age}
                      </span>
                    )}
                    {service.metadata.schedule && (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" /> {service.metadata.schedule}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-1">
                      <MapPin className="h-3.5 w-3.5 text-gray-500" /> {service.metadata.mode}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-1">
                      <Clock className="h-3.5 w-3.5 text-gray-500" /> {service.metadata.intensityOrDuration}
                    </span>
                  </div>

                  {/* Selector de Planes */}
                  {service.plans.length > 1 && (
                    <div className="mt-6">
                      <p className="mb-2 font-poppins text-[11px] font-bold text-gray-500 uppercase">
                        Selecciona tu plan:
                      </p>
                      <div className="grid grid-cols-3 gap-1.5 rounded-xl border-2 border-black bg-gray-100 p-1">
                        {service.plans.map((planOpt, idx) => {
                          const isSelected = currentPlanIdx === idx;
                          return (
                            <button
                              key={planOpt.id}
                              onClick={() => handleSelectPlan(service.id, idx)}
                              className={`relative rounded-lg py-1.5 font-poppins text-xs font-black transition-all ${isSelected
                                ? "border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                : "text-gray-600 hover:text-black"
                                }`}
                            >
                              {planOpt.label}
                              {planOpt.isRecommended && (
                                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-black bg-amber-400 px-1.5 py-0.2 text-[8px] font-black uppercase text-black">
                                  ★ Recomendado
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Display de Precio */}
                  {selectedPlan && (
                    <div className="mt-5 rounded-2xl border-2 border-black bg-mint/30 p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="font-poppins text-xs font-bold text-gray-600 uppercase">Inversión ({selectedPlan.label}):</span>
                          <div className="font-poppins text-2xl font-black text-black sm:text-3xl">
                            {formatCOP(selectedPlan.price)}
                          </div>
                        </div>
                        {selectedPlan.tag && (
                          <span className="max-w-[150px] text-right font-jakarta text-[11px] font-extrabold text-purple leading-tight">
                            ✨ {selectedPlan.tag}
                          </span>
                        )}
                      </div>
                      {service.note && (
                        <p className="mt-2 font-jakarta text-[10px] text-gray-600 italic">
                          * {service.note}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Reveal Details */}
                  <div className="mt-4">
                    <button
                      onClick={() => toggleExpandCard(service.id)}
                      className="inline-flex items-center gap-1 font-poppins text-xs font-black uppercase tracking-wider text-purple hover:underline"
                    >
                      {isExpanded ? "Ocultar detalles" : "Ver qué aprende y descripción"}
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-4 space-y-3 border-t border-gray-200 pt-3 animate-fadeIn">
                        <p className="font-jakarta text-xs leading-relaxed text-gray-700 sm:text-sm">
                          {service.description}
                        </p>
                        <div>
                          <p className="font-poppins text-xs font-bold text-black uppercase mb-1.5">
                            {service.id === "asesoria-yanetsis" ? "Aquí obtienes:" : "Aquí aprende:"}
                          </p>
                          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                            {service.learnList.map((item, i) => (
                              <li key={i} className="flex items-center gap-1.5 font-jakarta text-xs font-medium text-gray-800">
                                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 pt-2">
                  <a
                    href={
                      service.isCustomQuote
                        ? "#formulario-cotizacion"
                        : `/checkout?service=${service.id}&variant=${selectedPlan?.id || "mensual"}`
                    }
                    className="flex w-full items-center justify-center rounded-xl border-2 border-black bg-mint px-6 py-3.5 font-poppins text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-mint/80 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0"
                  >
                    {service.isCustomQuote ? "COTIZAR" : "LO QUIERO"}
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* 4. FRASE DE CIERRE DE SECCIÓN DENTRO DE STICKER BOX */}
        <div className="mt-12 text-center">
          <div className="mx-auto max-w-xl rounded-2xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-jakarta text-xs font-black text-black uppercase tracking-widest">
              &ldquo;Tu voz puede empezar desde cualquier lugar. Lo importante es entrenarla con intención y llevarla más lejos.&rdquo;
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}