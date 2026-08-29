// app/api/veredicto/route.ts
// Recibe las métricas de la Prueba de Voz IA y pide un veredicto a Anthropic (Claude).
// Fallback crítico: si no hay ANTHROPIC_API_KEY, el fetch falla o no hay texto,
// responde { error: "fallback" } con status 200 (nunca 500).

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface VeredictoBody {
  pitchAcc: number;
  stab: number;
  total: number;
}

function isValidMetric(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { pitchAcc, stab, total } = (body ?? {}) as Partial<VeredictoBody>;

  if (!isValidMetric(pitchAcc) || !isValidMetric(stab) || !isValidMetric(total)) {
    return NextResponse.json({ error: "invalid metrics" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn("[veredicto] ANTHROPIC_API_KEY no configurada, usando fallback.");
    return NextResponse.json({ error: "fallback" }, { status: 200 });
  }

  const prompt = `Eres el asistente de redacción de Yanetsis Alfonso, coach vocal de televisión y fundadora de La Magia de Cantar. Alguien acaba de hacer una prueba de voz en la página web. Estas son las únicas métricas reales que tienes sobre esa grabación: afinación ${pitchAcc}%, estabilidad de la respiración ${stab}%, puntaje total ${total}/100. Escribe un veredicto breve (entre 80 y 120 palabras), en español, en primera persona como si lo dijera Yanetsis: cálido, cercano, profesional, nunca condescendiente. Menciona un aspecto fuerte y un aspecto a mejorar, basados únicamente en las métricas dadas. No inventes datos que no estén en las métricas (no menciones rango vocal, tono de voz, género musical, ni nada que no puedas saber de estos tres números). No uses lenguaje técnico de ingeniería de audio. Cierra invitando, de forma natural, a dar el siguiente paso con una clase de prueba. Responde solo con el texto del veredicto, sin título ni comillas.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      console.warn(`[veredicto] Anthropic respondió ${res.status}, usando fallback.`);
      return NextResponse.json({ error: "fallback" }, { status: 200 });
    }

    const data = (await res.json()) as { content?: Array<{ text?: string }> };
    const text = data?.content?.[0]?.text;

    if (!text || typeof text !== "string" || text.trim() === "") {
      console.warn("[veredicto] Respuesta sin texto, usando fallback.");
      return NextResponse.json({ error: "fallback" }, { status: 200 });
    }

    return NextResponse.json({ veredicto: text });
  } catch (err) {
    console.error("[veredicto] Error consultando Anthropic:", err);
    return NextResponse.json({ error: "fallback" }, { status: 200 });
  }
}
