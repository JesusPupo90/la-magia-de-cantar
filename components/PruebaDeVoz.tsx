"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Mic,
  RotateCcw,
  Sparkles,
  Activity,
  Music,
  Wind,
} from "lucide-react";

type Status = "idle" | "countdown" | "recording" | "processing" | "result" | "error";

interface Result {
  pitchAcc: number;
  stab: number;
  total: number;
  veredicto: string;
}

const RECORD_SECONDS = 10;
const COUNTDOWN_WORDS = ["Respira", "Afina", "¡Ya!"];
const WHATSAPP_URL =
  "https://wa.me/573053678742?text=Hola%20Yanetsis%2C%20hice%20mi%20prueba%20de%20voz%20con%20IA%20y%20quiero%20dar%20el%20siguiente%20paso%20con%20una%20clase%20de%20prueba";

// --- LÓGICA DE FALLBACK LOCAL (veredicto en la voz de Yanetsis) ---
function localVeredicto(pitchAcc: number, stab: number, total: number): string {
  const open =
    total >= 80
      ? "Se nota una base sólida en tu voz."
      : total >= 55
        ? "Hay una base para trabajar, y eso es justo el punto de partida."
        : "Este es apenas el comienzo, y ahí está lo interesante.";
  const pitchLine =
    pitchAcc >= 75
      ? "Tu afinación se mantiene firme en la mayor parte del pasaje."
      : pitchAcc >= 50
        ? "Tu afinación es irregular: hay tramos precisos y otros que se desvían."
        : "La afinación todavía varía bastante, algo muy normal antes de entrenar el oído.";
  const stabLine =
    stab >= 75
      ? "El control de la respiración sostiene bien la nota."
      : stab >= 50
        ? "El aire se agota antes de tiempo en algunos tramos."
        : "La respiración necesita trabajo para sostener la nota sin temblor.";
  const close =
    total >= 80
      ? "Con técnica de resonancia y escena, esto se proyecta a otro nivel."
      : total >= 55
        ? "Con un plan de técnica vocal enfocado, esto avanza rápido."
        : "Con una guía desde el inicio, esta base se convierte en una voz segura.";
  return `${open} ${pitchLine} ${stabLine} ${close}`;
}

// --- LÓGICA DE DETECCIÓN DE PITCH (autocorrelación) ---
function detectPitch(data: Float32Array, sampleRate: number): number {
  const SIZE = data.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += data[i] * data[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1;

  let r1 = 0,
    r2 = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(data[i]) < thres) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(data[SIZE - i]) < thres) {
      r2 = SIZE - i;
      break;
    }
  }
  const trimmed = data.slice(r1, r2);
  const newSize = trimmed.length;
  const c = new Array(newSize).fill(0);
  for (let lag = 0; lag < newSize; lag++) {
    for (let j = 0; j < newSize - lag; j++) c[lag] += trimmed[j] * trimmed[j + lag];
  }
  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1,
    maxpos = -1;
  for (let i = d; i < newSize; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  if (maxpos <= 0) return -1;
  return sampleRate / maxpos;
}

export default function PruebaDeVoz() {
  const [status, setStatus] = useState<Status>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [countdownIdx, setCountdownIdx] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const audioRef = useRef<{
    ctx: AudioContext;
    source: MediaStreamAudioSourceNode;
    processor: ScriptProcessorNode;
    stream: MediaStream;
  } | null>(null);
  const samplesRef = useRef<number[]>([]);
  const collectingRef = useRef(false);
  const countdownTimerRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) window.clearInterval(countdownTimerRef.current);
      if (timerRef.current) window.clearInterval(timerRef.current);
      const audio = audioRef.current;
      if (audio) {
        audio.processor.disconnect();
        audio.source.disconnect();
        audio.stream.getTracks().forEach((track) => track.stop());
        if (audio.ctx.state !== "closed") void audio.ctx.close();
      }
    };
  }, []);

  const cleanup = () => {
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    collectingRef.current = false;
    const audio = audioRef.current;
    if (audio) {
      audio.processor.disconnect();
      audio.source.disconnect();
      audio.stream.getTracks().forEach((track) => track.stop());
      if (audio.ctx.state !== "closed") void audio.ctx.close();
      audioRef.current = null;
    }
  };

  const startRecording = async () => {
    setErrorMsg("");
    setResult(null);
    setElapsed(0);
    samplesRef.current = [];
    collectingRef.current = false;

    window.scrollTo({ top: 0, behavior: "smooth" });

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setStatus("error");
      setErrorMsg(
        "Necesitamos acceso a tu micrófono para analizar tu voz. Permítelo desde el navegador y vuelve a intentarlo."
      );
      return;
    }

    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtor) {
      stream.getTracks().forEach((track) => track.stop());
      setStatus("error");
      setErrorMsg("Tu navegador no soporta la grabación de audio. Prueba con otro dispositivo.");
      return;
    }

    const ctx = new AudioCtor();
    if (ctx.state === "suspended") void ctx.resume();
    const source = ctx.createMediaStreamSource(stream);
    const processor = ctx.createScriptProcessor(4096, 1, 1);
    const sampleRate = ctx.sampleRate;

    processor.onaudioprocess = (event) => {
      if (!collectingRef.current) return;
      const data = event.inputBuffer.getChannelData(0);
      const pitch = detectPitch(data, sampleRate);
      if (pitch > 0 && Number.isFinite(pitch)) {
        samplesRef.current.push(pitch);
      }
    };

    source.connect(processor);
    processor.connect(ctx.destination);

    audioRef.current = { ctx, source, processor, stream };

    setStatus("countdown");
    setCountdownIdx(0);
    let word = 0;
    countdownTimerRef.current = window.setInterval(() => {
      word++;
      if (word < COUNTDOWN_WORDS.length) {
        setCountdownIdx(word);
      } else {
        if (countdownTimerRef.current) {
          window.clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        startSampling();
      }
    }, 1000);
  };

  const startSampling = () => {
    collectingRef.current = true;
    let seconds = 0;
    timerRef.current = window.setInterval(() => {
      seconds++;
      setElapsed(Math.min(seconds, RECORD_SECONDS));
      if (seconds >= RECORD_SECONDS) {
        computeAndAnalyze();
      }
    }, 1000);
    setStatus("recording");
  };

  const computeAndAnalyze = () => {
    cleanup();
    setElapsed(RECORD_SECONDS);

    const samples = samplesRef.current.filter((p) => Number.isFinite(p) && p > 0);
    if (samples.length < 2) {
      setStatus("error");
      setErrorMsg(
        "No logramos detectar tu voz en la grabación. Acércate al micrófono, canta una nota sostenida y vuelve a intentarlo."
      );
      return;
    }

    const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const variance = samples.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / samples.length;
    const sd = Math.sqrt(variance);
    const cv = sd / mean;
    const stab = Math.max(0, Math.min(100, Math.round(100 - cv * 300)));

    let semitoneJumps = 0;
    for (let i = 1; i < samples.length; i++) {
      const st = Math.abs(12 * Math.log2(samples[i] / samples[i - 1]));
      if (st < 2) semitoneJumps++;
    }
    const pitchAcc = Math.max(
      0,
      Math.min(100, Math.round((semitoneJumps / (samples.length - 1)) * 100))
    );
    const total = Math.round(pitchAcc * 0.6 + stab * 0.4);

    setStatus("processing");
    void fetchVeredicto(pitchAcc, stab, total);
  };

  const fetchVeredicto = async (pitchAcc: number, stab: number, total: number) => {
    let veredicto = localVeredicto(pitchAcc, stab, total);
    try {
      const res = await fetch("/api/veredicto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pitchAcc, stab, total }),
      });
      const data = (await res.json()) as { veredicto?: string; error?: string };
      if (
        data &&
        typeof data.veredicto === "string" &&
        data.veredicto.trim() !== "" &&
        data.error !== "fallback"
      ) {
        veredicto = data.veredicto;
      }
    } catch {
      // Silencioso: se mantiene el veredicto local.
    }
    setResult({ pitchAcc, stab, total, veredicto });
    setStatus("result");
  };

  const remaining = Math.max(0, RECORD_SECONDS - elapsed);

  return (
    <main className="flex flex-1 flex-col bg-[#FFFBEB]">
      <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* ================= HERO ================= */}
        <div className="flex flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-yellow px-4 py-1.5 font-poppins text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="h-3.5 w-3.5" /> Prueba gratuita · Con IA
          </p>
          <h1 className="mt-4 font-poppins text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
            Prueba con IA tu voz
          </h1>
          <p className="mt-3 max-w-xl font-jakarta text-base font-medium leading-relaxed text-gray-700 sm:text-lg">
            Graba tu voz por 10 segundos, analizamos tu afinación y tu estabilidad respiratoria,
            y Yanetsis te deja un veredicto personalizado.
          </p>
        </div>

        {/* ================= TARJETA PRINCIPAL ================= */}
        <div className="mt-10 rounded-3xl border-[3px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:p-8">
          {status === "idle" && (
            <div className="flex flex-col items-center py-6 text-center sm:py-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-black bg-mint/30">
                <Mic className="h-8 w-8 text-black" />
              </div>
              <h2 className="mt-5 font-poppins text-xl font-extrabold text-black sm:text-2xl">
                ¿Lista para escuchar tu voz?
              </h2>
              <p className="mt-2 max-w-md font-jakarta text-sm font-medium text-gray-600">
                Busca un lugar tranquilo, acerca el micrófono y canta una nota sostenida o una
                frase corta. Tienes 10 segundos.
              </p>
              <button
                type="button"
                onClick={() => void startRecording()}
                className="mt-8 inline-flex items-center gap-2 rounded-xl border-[3px] border-black bg-pink px-6 py-4 font-poppins text-sm font-black uppercase tracking-wide text-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]"
              >
                <Mic className="h-5 w-5" /> Grabar mi voz
              </button>
              <p className="mt-4 flex items-center gap-1.5 font-jakarta text-[11px] text-gray-500">
                <AlertCircle className="h-3.5 w-3.5" /> El audio se procesa en tu dispositivo y no
                se guarda en ningún servidor.
              </p>
            </div>
          )}

          {status === "countdown" && (
            <div className="flex flex-col items-center py-6 text-center sm:py-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-black bg-mint/30">
                <Mic className="h-8 w-8 animate-pulse text-black" />
              </div>
              <h2
                key={countdownIdx}
                className="mt-5 animate-fadeIn font-poppins text-4xl font-extrabold tracking-tight text-black sm:text-5xl"
              >
                {COUNTDOWN_WORDS[countdownIdx]}
              </h2>
              <p className="mt-3 max-w-md font-jakarta text-sm font-medium text-gray-600">
                {countdownIdx < COUNTDOWN_WORDS.length - 1
                  ? "Prepárate: acerca el micrófono y respira con calma."
                  : "Empieza a cantar una nota sostenida, con tu voz firme."}
              </p>
              <div className="mt-6 flex items-center gap-2">
                {COUNTDOWN_WORDS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-2.5 rounded-full border-2 border-black transition-colors ${
                      i <= countdownIdx ? "bg-pink" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {status === "recording" && (
            <div className="flex flex-col items-center py-6 text-center sm:py-10">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-2xl border-[3px] border-pink/40" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-black bg-pink">
                  <Mic className="h-8 w-8 animate-pulse text-white" />
                </div>
              </div>
              <h2 className="mt-5 font-poppins text-xl font-extrabold text-black sm:text-2xl">
                Grabando... {remaining}s
              </h2>
              <p className="mt-2 max-w-md font-jakarta text-sm font-medium text-gray-600">
                Canta una nota sostenida manteniendo tu voz firme. Respira con calma.
              </p>
              <div className="mt-6 h-5 w-full max-w-sm overflow-hidden rounded-full border-2 border-black bg-gray-100">
                <div
                  className="h-full bg-pink transition-[width] duration-300 ease-linear"
                  style={{ width: `${(elapsed / RECORD_SECONDS) * 100}%` }}
                />
              </div>
            </div>
          )}

          {status === "processing" && (
            <div className="flex flex-col items-center py-10 text-center sm:py-14">
              <Loader2 className="h-12 w-12 animate-spin text-purple" />
              <h2 className="mt-5 font-poppins text-xl font-extrabold text-black sm:text-2xl">
                Procesando IA...
              </h2>
              <p className="mt-2 max-w-md font-jakarta text-sm font-medium text-gray-600">
                Analizamos tu afinación y tu estabilidad respiratoria para que Yanetsis prepare tu
                veredicto.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center py-8 text-center sm:py-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-black bg-pink-soft">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="mt-5 font-poppins text-xl font-extrabold text-black sm:text-2xl">
                Algo salió mal
              </h2>
              <p className="mt-2 max-w-md font-jakarta text-sm font-medium text-gray-600">
                {errorMsg}
              </p>
              <button
                type="button"
                onClick={() => void startRecording()}
                className="mt-8 inline-flex items-center gap-2 rounded-xl border-[3px] border-black bg-yellow px-6 py-4 font-poppins text-sm font-black uppercase tracking-wide text-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]"
              >
                <RotateCcw className="h-5 w-5" /> Intentar de nuevo
              </button>
            </div>
          )}

          {status === "result" && result && (
            <div className="animate-fadeIn">
              <div className="text-center">
                <h2 className="font-poppins text-xl font-extrabold text-black sm:text-2xl">
                  Este es tu resultado
                </h2>
                <p className="mt-1 font-jakarta text-sm font-medium text-gray-600">
                  Esto es lo que tu voz contó hoy. Repítela en unos días para ver tu avance.
                </p>
              </div>

              {/* STATS */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border-[3px] border-black bg-yellow p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="font-poppins text-[10px] font-black uppercase tracking-wider text-black">
                    Puntaje
                  </p>
                  <p className="mt-1 font-poppins text-4xl font-black text-black">
                    {result.total}
                  </p>
                  <p className="font-jakarta text-[11px] font-semibold text-gray-700">/100</p>
                </div>
                <div className="rounded-2xl border-[3px] border-black bg-mint/30 p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="flex items-center justify-center gap-1 font-poppins text-[10px] font-black uppercase tracking-wider text-black">
                    <Music className="h-3.5 w-3.5" /> Afinación
                  </p>
                  <p className="mt-1 font-poppins text-4xl font-black text-black">
                    {result.pitchAcc}
                  </p>
                  <p className="font-jakarta text-[11px] font-semibold text-gray-700">%</p>
                </div>
                <div className="rounded-2xl border-[3px] border-black bg-pink-soft p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="flex items-center justify-center gap-1 font-poppins text-[10px] font-black uppercase tracking-wider text-black">
                    <Wind className="h-3.5 w-3.5" /> Estabilidad
                  </p>
                  <p className="mt-1 font-poppins text-4xl font-black text-black">{result.stab}</p>
                  <p className="font-jakarta text-[11px] font-semibold text-gray-700">%</p>
                </div>
              </div>

              {/* VEREDICTO */}
              <div className="mt-6 rounded-2xl border-[3px] border-black bg-pink-soft p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:p-6">
                <p className="flex items-center gap-2 font-poppins text-[10px] font-black uppercase tracking-wider text-black">
                  <Activity className="h-4 w-4" /> Veredicto de Yanetsis
                </p>
                <p className="mt-3 font-jakarta text-sm font-medium leading-relaxed text-gray-800 sm:text-base">
                  “{result.veredicto}”
                </p>
              </div>

              {/* CTA FINAL */}
              <div className="mt-6 flex flex-col items-center gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-[3px] border-black bg-yellow px-8 py-4 font-poppins text-base font-black uppercase tracking-wide text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:bg-orange hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:w-auto"
                >
                  Quiero tener la magia <ArrowRight className="h-5 w-5" />
                </a>
                <button
                  type="button"
                  onClick={() => void startRecording()}
                  className="inline-flex items-center gap-2 font-jakarta text-xs font-bold text-purple underline-offset-4 hover:underline"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Volver a grabar mi voz
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= NOTA DE CONFIANZA ================= */}
        {status !== "recording" && status !== "processing" && (
          <p className="mt-8 text-center font-jakarta text-[11px] text-gray-500">
            Prueba orientativa para conocerte mejor. El veredicto no sustituye una evaluación vocal
            en clase.
          </p>
        )}
      </div>
    </main>
  );
}
