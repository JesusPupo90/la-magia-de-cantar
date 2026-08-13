"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Loader2,
  CreditCard,
  User,
  ReceiptText,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  buildOrdenSchema,
  DOC_TYPE_OPTIONS,
  type OrdenCompraInput,
} from "@/lib/schemas/orden.schema";
import { submitOrder } from "@/app/actions/ordenes";
import { formatCOP } from "@/utils/formatCurrency";
import type { ServiceItem, Plan } from "@/data/services";
import MpBricks from "@/components/MpBricks";

const STORAGE_KEY = "lmdc_checkout_draft";

interface CheckoutFormProps {
  service: ServiceItem;
  variant: Plan;
}

type PaymentStep = "form" | "processing" | "bricks" | "error";

export default function CheckoutForm({ service, variant }: CheckoutFormProps) {
  const requiresAge = /niños|jóvenes|kids|teens|adolescentes/i.test(
    `${service.title} ${service.metadata.age ?? ""}`
  );

  const schema = useMemo(() => buildOrdenSchema({ requiresAge }), [requiresAge]);  const [step, setStep] = useState<PaymentStep>("form");
  const [submitError, setSubmitError] = useState("");
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [studentIsPayer, setStudentIsPayer] = useState(false);

  // 🍯 Honeypot + rellenado de pagador → estudiante
  const defaultValues = useMemo<OrdenCompraInput>(() => {
    const stored = loadDraft();
    return {
      serviceId: service.id,
      variantId: variant.id,
      studentFirstName: stored?.studentFirstName ?? "",
      studentLastName: stored?.studentLastName ?? "",
      studentAge: typeof stored?.studentAge === "number" ? stored.studentAge : undefined,
      studentNotes: stored?.studentNotes ?? "",
      payerEmail: stored?.payerEmail ?? "",
      payerFirstName: stored?.payerFirstName ?? "",
      payerLastName: stored?.payerLastName ?? "",
      payerDocType: stored?.payerDocType ?? "CC",
      payerDocNumber: stored?.payerDocNumber ?? "",
      payerPhone: stored?.payerPhone ?? "",
      habeasDataAccepted: true as const,
      honeypot: "",
    };
  }, [service.id, variant.id]);

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OrdenCompraInput>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues,
  });

  const values = watch();

  // 🗃️ Auto-guardado en sessionStorage (cap primaria §4.5)
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const t = setTimeout(() => saveDraft(values), 400);
    return () => clearTimeout(t);
  }, [values]);

  // ⚖️ Toggle "el estudiante es el pagador"
  const handleStudentIsPayer = useCallback((checked: boolean) => {
    setStudentIsPayer(checked);
  }, []);

  // Cuando el estudiante ES el pagador, sincronizamos los nombres en vivo
  // (aunque el usuario edite el pagador después de tildar el toggle).
  const payerFirstName = values.payerFirstName;
  const payerLastName = values.payerLastName;
  useEffect(() => {
    if (!studentIsPayer) return;
    setValue("studentFirstName", payerFirstName || "", { shouldValidate: true });
    setValue("studentLastName", payerLastName || "", { shouldValidate: true });
  }, [studentIsPayer, payerFirstName, payerLastName, setValue]);

  const errorMessage =
    Object.values(errors)
      .map((e) => (e && typeof e.message === "string" ? e.message : null))
      .find(Boolean) || submitError;

  const onSubmit = async (data: OrdenCompraInput) => {
    setSubmitError("");
    setStep("processing");

    const payload: OrdenCompraInput = {
      ...data,
      serviceId: service.id,
      variantId: variant.id,
      // Si el estudiante es el pagador, garantizamos consistencia en el backend
      studentFirstName: studentIsPayer ? data.payerFirstName : data.studentFirstName,
      studentLastName: studentIsPayer ? data.payerLastName : data.studentLastName,
    };

    const result = await submitOrder(payload);

    if (!result.success) {
      setSubmitError(result.message || "Ocurrió un error al iniciar el pago. Inténtalo de nuevo.");
      setStep("form");
      return;
    }

    if (!result.clientToken) {
      setSubmitError("La pasarela no devolvió un token de pago. Inténtalo de nuevo.");
      setStep("form");
      return;
    }

    setOrderId(result.orderId ?? null);
    setClientToken(result.clientToken);
    clearDraft();
    setStep("bricks");
  };

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
      {/* ⬅️ FORMULARIO */}
      <div className="rounded-3xl border-2 border-black bg-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {step === "form" && (
          <form
            onSubmit={rhfHandleSubmit(onSubmit)}
            noValidate
            onChange={() => {
              if (submitError) setSubmitError("");
            }}
            onKeyDown={(e) => {
              const tag = (e.target as HTMLElement).tagName;
              if (e.key === "Enter" && (tag === "INPUT" || tag === "SELECT")) {
                e.preventDefault();
              }
            }}
            className="space-y-6"
          >
            {/* 🍯 Honeypot anti-spam */}
            <input
              {...register("honeypot")}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              aria-label="No llenar este campo"
              className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
            />

            {/* 🎓 ESTUDIANTE */}
            <fieldset>
              <legend className="flex items-center gap-2 font-poppins text-sm font-black uppercase text-black">
                <User className="h-4 w-4 text-purple" /> Datos del estudiante
              </legend>

              <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 p-3">
                <input
                  type="checkbox"
                  checked={studentIsPayer}
                  onChange={(e) => handleStudentIsPayer(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-purple"
                />
                <span className="font-jakarta text-xs font-semibold text-gray-700">
                  El estudiante es la persona que realiza el pago (mismo nombre del pagador)
                </span>
              </label>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                    Nombre del estudiante *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Camila"
                    maxLength={80}
                    disabled={studentIsPayer}
                    {...register("studentFirstName")}
                    className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                    Apellido del estudiante *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Pérez"
                    maxLength={80}
                    disabled={studentIsPayer}
                    {...register("studentLastName")}
                    className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                    Edad {requiresAge ? "*" : "(Opcional)"}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={120}
                    placeholder={requiresAge ? "Ej: 8" : "Ej: 25"}
                    {...register("studentAge", {
                      setValueAs: (v: string) => (v === "" ? undefined : Number(v)),
                    })}
                    className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                    Notas (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Es alérgica al polvo"
                    maxLength={2000}
                    {...register("studentNotes")}
                    className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                  />
                </div>
              </div>
            </fieldset>

            {/* 💳 PAGADOR / FACTURACIÓN */}
            <fieldset>
              <legend className="flex items-center gap-2 font-poppins text-sm font-black uppercase text-black">
                <ReceiptText className="h-4 w-4 text-purple" /> Datos de facturación y pago
              </legend>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                    Nombre del pagador *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Andrea"
                    maxLength={80}
                    {...register("payerFirstName")}
                    className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                <div>
                  <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                    Apellido del pagador *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Pérez"
                    maxLength={80}
                    {...register("payerLastName")}
                    className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    maxLength={254}
                    {...register("payerEmail")}
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
                    maxLength={20}
                    {...register("payerPhone")}
                    className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                    Tipo de documento *
                  </label>
                  <select
                    {...register("payerDocType")}
                    className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm font-semibold text-black focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {DOC_TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-poppins text-xs font-black uppercase text-black mb-1.5">
                    Número de documento *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 1010123456"
                    maxLength={30}
                    inputMode="numeric"
                    {...register("payerDocNumber")}
                    className="w-full rounded-xl border-2 border-black bg-gray-50 px-4 py-3 font-jakarta text-sm text-black placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>
            </fieldset>

            {/* ⚖️ HABEAS DATA */}
            <div className="rounded-2xl border-2 border-black bg-mint/30 p-4">
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  defaultChecked
                  {...register("habeasDataAccepted")}
                  className="mt-0.5 h-4 w-4 accent-purple"
                />
                <span className="font-jakarta text-xs font-medium text-gray-800">
                  Autorizo el tratamiento de mis datos personales según la{" "}
                  <a
                    href="/politica-de-privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-purple underline"
                  >
                    política de privacidad
                  </a>{" "}
                  y la{" "}
                  <a
                    href="/tratamiento-de-datos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-purple underline"
                  >
                    política de tratamiento de datos
                  </a>
                  . *
                </span>
              </label>
            </div>

            {/* MENSAJE DE ERROR */}
            <div
              aria-live="polite"
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                errorMessage ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-xl border-2 border-black bg-pink-soft p-3 text-xs font-extrabold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-fadeIn">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-yellow px-6 py-4 font-poppins text-sm font-black uppercase text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Procesando...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" /> Continuar al pago seguro
                </>
              )}
            </button>

            <p className="flex items-center justify-center gap-1.5 text-center font-jakarta text-[10px] text-gray-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Mercado Pago procesa tu pago con encriptación de extremo a extremo. No almacenamos tus datos de tarjeta.
            </p>
          </form>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-purple" />
            <p className="mt-4 font-poppins text-lg font-bold text-black">
              Creando tu intención de pago segura...
            </p>
          </div>
        )}

        {step === "error" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="h-10 w-10 text-red-600" />
            <p className="mt-4 font-jakarta text-sm font-medium text-gray-800">{submitError}</p>
            <button
              type="button"
              onClick={() => {
                setSubmitError("");
                setStep("form");
              }}
              className="mt-6 rounded-xl border-2 border-black bg-yellow px-6 py-3 font-poppins text-xs font-black uppercase text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              Reintentar
            </button>
          </div>
        )}

        {step === "bricks" && clientToken && (
          <MpBricks
            clientToken={clientToken}
            orderId={orderId ?? ""}
            amount={variant.price}
            payer={{
              email: values.payerEmail,
              firstName: values.payerFirstName,
              lastName: values.payerLastName,
            }}
          />
        )}
      </div>

      {/* ➡️ RESUMEN DEL PRODUCTO */}
      <aside className="h-fit rounded-3xl border-2 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] lg:sticky lg:top-24">
        <p className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-pink-soft px-3 py-1 font-poppins text-[10px] font-black uppercase text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Users className="h-3.5 w-3.5" /> Tu selección
        </p>

        <h2 className="mt-4 font-poppins text-2xl font-extrabold text-black">{service.title}</h2>
        <p className="mt-1 font-jakarta text-xs font-semibold text-gray-600">
          Plan {variant.label}
        </p>

        {service.metadata.age && (
          <p className="mt-3 font-jakarta text-xs font-medium text-gray-700">
            {service.metadata.age}
          </p>
        )}
        {service.metadata.mode && (
          <p className="mt-1 font-jakarta text-xs font-medium text-gray-700">
            Modalidad: {service.metadata.mode}
          </p>
        )}

        <div className="mt-5 border-t border-gray-200 pt-4">
          <p className="font-poppins text-xs font-bold text-gray-600 uppercase">Total a pagar</p>
          <p className="mt-1 font-poppins text-3xl font-black text-black">
            {formatCOP(variant.price)}
          </p>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-xl bg-mint/30 p-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="font-jakarta text-[11px] leading-relaxed text-gray-700">
            Pago procesado por Mercado Pago. Métodos disponibles: tarjetas de crédito/débito, PSE
            y efectivo.
          </p>
        </div>

        {service.note && (
          <p className="mt-3 font-jakarta text-[11px] italic text-gray-500">* {service.note}</p>
        )}
      </aside>
    </div>
  );
}

// 🗃️ Helpers de sessionStorage
function loadDraft(): Partial<OrdenCompraInput> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<OrdenCompraInput>) : null;
  } catch {
    return null;
  }
}

function saveDraft(values: OrdenCompraInput) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch {
    // storage lleno o bloqueado: degradar silenciosamente (§4.5)
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
