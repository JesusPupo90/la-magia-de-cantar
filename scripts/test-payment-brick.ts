// scripts/test-payment-brick.ts
// End-to-end smoke test for the Mercado Pago Payment Brick.
//
// It answers: "does the brick still initialize and render with the project's
// credentials and the same customization used by components/MpBricks.tsx?"
//
// Usage (from the project root):
//   npx tsx scripts/test-payment-brick.ts              # full check (needs Chrome)
//   npx tsx scripts/test-payment-brick.ts --no-browser # HTTP checks only
//   npx tsx scripts/test-payment-brick.ts --manual     # serve the harness, open it yourself
//
// Optional env vars:
//   PUPPETEER_PATH  Path to a puppeteer install (default: ./node_modules/puppeteer)
//   CHROME_PATH     Chrome/Edge executable (default: auto-detected)
//
// Note: it creates a COP 1.000 preference in the Mercado Pago account. A
// preference does not charge anyone; it only exists so the brick can mount
// with the same `initialization.preferenceId` shape the app uses.

import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

function loadEnv() {
  const file = path.resolve(process.cwd(), ".env.local");
  try {
    const content = readFileSync(file, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !(m[1] in process.env)) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // no .env.local: rely on the real environment
  }
}

loadEnv();

const MP_API = "https://api.mercadopago.com";
const token = process.env.MP_ACCESS_TOKEN ?? "";
const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ?? "";
const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/+$/, "") || "https://www.lamagiadecantar.co";
const amount = 1000;
const args = process.argv.slice(2);
const noBrowser = args.includes("--no-browser");
const manual = args.includes("--manual");

type Json = Record<string, unknown>;
const asObj = (v: unknown): Json => (v && typeof v === "object" ? (v as Json) : {});

const results: { name: string; ok: boolean }[] = [];

function record(name: string, ok: boolean, detail = "") {
  results.push({ name, ok });
  console.log(`${ok ? "[ok]  " : "[FAIL]"} ${name}${detail ? ` — ${detail}` : ""}`);
}

function note(message: string) {
  console.log(`       ${message}`);
}

function envKind(value: string): "producción" | "pruebas" | "desconocido" {
  if (value.startsWith("APP_USR")) return "producción";
  if (value.startsWith("TEST")) return "pruebas";
  return "desconocido";
}

async function mpFetch(pathname: string, init: RequestInit = {}): Promise<{ status: number; data: unknown }> {
  const res = await fetch(`${MP_API}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string> | undefined),
    },
  });
  const text = await res.text();
  let data: unknown = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // keep the raw text for the error message
  }
  return { status: res.status, data };
}

function buildHarness(preferenceId: string): string {
  const key = JSON.stringify(publicKey);
  const pref = JSON.stringify(preferenceId);
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Payment Brick test</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 24px; background: #fafafa; }
    #state { font-size: 14px; margin: 0 0 16px; }
    #payment-brick-container { max-width: 480px; min-height: 320px; }
  </style>
</head>
<body>
  <p id="state">loading</p>
  <div id="payment-brick-container"></div>
  <script src="https://sdk.mercadopago.com/js/v2"></script>
  <script>
    window.__brickState = "loading";
    window.__brickError = null;
    function setState(state, error) {
      window.__brickState = state;
      if (error) {
        window.__brickError = String((error && (error.message || error.cause)) || error);
      }
      document.getElementById("state").textContent = state;
    }
    (async function () {
      try {
        var mp = new MercadoPago(${key}, { locale: "es-CO" });
        await mp.bricks().create("payment", "payment-brick-container", {
          initialization: { preferenceId: ${pref}, amount: ${amount} },
          // Same customization as components/MpBricks.tsx (PSE/bankTransfer omitted on purpose).
          customization: {
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              ticket: "all",
              mercadoPago: "all"
            }
          },
          callbacks: {
            onReady: function () { setState("ready"); },
            onError: function (e) { if (e && e.type === "critical") setState("critical", e); },
            onSubmit: function () {}
          }
        });
      } catch (e) {
        setState("critical", e);
      }
    })();
  </script>
</body>
</html>`;
}

function startHarness(preferenceId: string) {
  const html = buildHarness(preferenceId);
  const server = createServer((_req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  });
  return new Promise<{ server: ReturnType<typeof createServer>; url: string }>((resolve, reject) => {
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as AddressInfo;
      resolve({ server, url: `http://127.0.0.1:${port}/` });
    });
  });
}

interface PuppeteerPage {
  setViewport(size: { width: number; height: number }): Promise<void>;
  on(event: "console", handler: (message: { type(): string; text(): string }) => void): void;
  on(event: "pageerror", handler: (error: unknown) => void): void;
  goto(url: string, options?: Record<string, unknown>): Promise<unknown>;
  waitForFunction(fn: string, options?: Record<string, unknown>): Promise<unknown>;
  evaluate<T>(fn: () => T): Promise<T>;
}

interface PuppeteerBrowser {
  newPage(): Promise<PuppeteerPage>;
  close(): Promise<void>;
}

interface PuppeteerModule {
  launch(options: Record<string, unknown>): Promise<PuppeteerBrowser>;
}

function loadPuppeteer(): PuppeteerModule | null {
  const req = createRequire(import.meta.url);
  const candidates = [process.env.PUPPETEER_PATH, path.join(process.cwd(), "node_modules", "puppeteer")].filter(
    (candidate): candidate is string => Boolean(candidate)
  );
  for (const candidate of candidates) {
    try {
      return req(candidate) as PuppeteerModule;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

function findChrome(): string | null {
  const explicit = process.env.CHROME_PATH;
  if (explicit && existsSync(explicit)) return explicit;

  // chrome-headless-shell cached by puppeteer (~/.cache/puppeteer)
  const cacheRoot = path.join(homedir(), ".cache", "puppeteer", "chrome-headless-shell");
  if (existsSync(cacheRoot)) {
    for (const dir of readdirSync(cacheRoot).sort().reverse()) {
      const exe = path.join(cacheRoot, dir, "chrome-headless-shell-win64", "chrome-headless-shell.exe");
      if (existsSync(exe)) return exe;
    }
  }

  const known = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  return known.find((candidate) => existsSync(candidate)) ?? null;
}

async function renderCheck(
  puppeteer: PuppeteerModule,
  chrome: string,
  preferenceId: string
): Promise<{ ok: boolean; detail: string }> {
  const { server, url } = await startHarness(preferenceId);
  let browser: PuppeteerBrowser | undefined;
  try {
    const isHeadlessShell = /chrome-headless-shell/i.test(chrome);
    browser = await puppeteer.launch({
      headless: isHeadlessShell ? "shell" : true,
      executablePath: chrome,
      args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 1400 });

    const pageErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") pageErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(String(error)));

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    let timedOut = false;
    try {
      await page.waitForFunction('window.__brickState !== "loading"', { timeout: 45000, polling: 500 });
    } catch {
      timedOut = true;
    }

    const state = String(
      await page.evaluate(() => (window as unknown as { __brickState?: string }).__brickState ?? "")
    );
    const brickError = String(
      await page.evaluate(() => (window as unknown as { __brickError?: string }).__brickError ?? "")
    );

    if (state === "ready") return { ok: true, detail: "" };
    const detail = timedOut
      ? "timeout esperando onReady (45 s)"
      : `estado=${state}${brickError ? ` · ${brickError}` : ""}${pageErrors.length ? ` · consola: ${pageErrors.slice(0, 3).join(" | ")}` : ""}`;
    return { ok: false, detail };
  } finally {
    await browser?.close().catch(() => undefined);
    server.close();
  }
}

async function main() {
  console.log("\n=== Prueba del Payment Brick (Mercado Pago) ===\n");

  record("MP_ACCESS_TOKEN configurado", token.length > 0);
  record("NEXT_PUBLIC_MP_PUBLIC_KEY configurada", publicKey.length > 0);
  if (token && publicKey) {
    const sameEnvironment = envKind(token) === envKind(publicKey) && envKind(token) !== "desconocido";
    record(
      "Access token y public key del mismo entorno",
      sameEnvironment,
      `${envKind(token)} / ${envKind(publicKey)}${sameEnvironment ? "" : " (mezclar TEST con APP_USR rompe el brick)"}`
    );
  }
  if (!token || !publicKey) {
    console.log("\nRESULTADO: FALLÓ (faltan credenciales)\n");
    process.exit(1);
  }

  // 1. Credentials work and belong to a Colombian account.
  const meRes = await mpFetch("/users/me");
  const me = asObj(meRes.data);
  record(
    "Credenciales aceptadas por Mercado Pago",
    meRes.status === 200 && Boolean(me.id),
    meRes.status === 200 ? `cuenta ${String(me.id)}` : `HTTP ${meRes.status}: ${String(me.message ?? "")}`
  );
  record("Cuenta de Colombia (site MCO)", me.site_id === "MCO", String(me.site_id ?? "?"));

  // 2. Create the same kind of preference the checkout creates.
  const httpsApp = appUrl.startsWith("https://");
  const preferenceBody: Json = {
    items: [
      {
        id: "brick-test",
        title: "Prueba Payment Brick",
        description: "Prueba automática del brick de pagos",
        category_id: "services",
        quantity: 1,
        currency_id: "COP",
        unit_price: amount,
      },
    ],
    external_reference: `brick-test-${Date.now()}`,
  };
  if (httpsApp) {
    preferenceBody.notification_url = `${appUrl}/api/webhooks/mercadopago`;
    preferenceBody.back_urls = {
      success: `${appUrl}/checkout/success`,
      failure: `${appUrl}/checkout/failure`,
      pending: `${appUrl}/checkout/success`,
    };
    preferenceBody.auto_return = "approved";
  }
  const prefRes = await mpFetch("/checkout/preferences", {
    method: "POST",
    headers: { "X-Idempotency-Key": `brick-test-${Date.now()}` },
    body: JSON.stringify(preferenceBody),
  });
  const preference = asObj(prefRes.data);
  const preferenceId = typeof preference.id === "string" ? preference.id : "";
  record(
    "Preferencia de prueba creada",
    Boolean(preferenceId),
    preferenceId ? `preferenceId=${preferenceId}` : `HTTP ${prefRes.status}: ${JSON.stringify(prefRes.data).slice(0, 200)}`
  );

  // 3. Which payment methods does the account actually expose?
  const methodsRes = await mpFetch("/v1/payment_methods?site_id=MCO");
  const methods = Array.isArray(methodsRes.data) ? (methodsRes.data as Json[]) : [];
  const active = methods.filter((method) => method.status === "active").map((method) => String(method.id));
  record("Métodos de pago consultables", methodsRes.status === 200 && methods.length > 0, `${methods.length} métodos`);
  record(
    "Tarjetas habilitadas (visa/master)",
    active.includes("visa") || active.includes("master"),
    active.filter((id) => ["visa", "master", "amex"].includes(id)).join(", ") || "ninguna"
  );
  const pse = methods.find((method) => method.id === "pse");
  note(`PSE: ${pse ? `status=${String(pse.status)}` : "no aparece en la cuenta"} (oculto en el brick a propósito)`);
  note(`Activos: ${active.slice(0, 25).join(", ")}`);

  if (manual) {
    const { url } = await startHarness(preferenceId || "preference-id-missing");
    console.log(`\nHarness disponible en ${url} (Ctrl+C para terminar)\n`);
    await new Promise(() => undefined);
    return;
  }

  // 4. Render the brick in a real browser.
  if (noBrowser) {
    note("(--no-browser) Se omite la prueba de render.");
  } else if (!preferenceId) {
    note("Sin preferenceId no se puede montar el brick: se omite la prueba de render.");
  } else {
    const puppeteer = loadPuppeteer();
    const chrome = findChrome();
    if (!puppeteer) {
      note("puppeteer no encontrado: instala con `npm i -D puppeteer` o define PUPPETEER_PATH.");
    } else if (!chrome) {
      note("No se encontró Chrome/Edge: define CHROME_PATH.");
    } else {
      const check = await renderCheck(puppeteer, chrome, preferenceId);
      record("El brick se renderiza (onReady)", check.ok, check.detail);
    }
  }

  const failed = results.filter((result) => !result.ok).length;
  console.log(`\nRESULTADO: ${failed === 0 ? "PASÓ" : `FALLÓ (${failed} comprobación(es))`}\n`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error("\nERROR:", error instanceof Error ? error.message : error);
  process.exit(1);
});
