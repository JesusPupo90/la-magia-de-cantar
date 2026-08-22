// lib/ip.ts
// Normaliza y selecciona la primera IP PÚBLICA de los headers del cliente
// (x-forwarded-for suele traer varias IPs en cadenas de proxy/CDN).

function isPrivateIp(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length === 4 && parts.every((p) => /^\d+$/.test(p))) {
    const a = Number(parts[0]);
    const b = Number(parts[1]);
    if (a === 10) return true; // 10.x
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16-31.x
    if (a === 192 && b === 168) return true; // 192.168.x
    if (a === 127) return true; // loopback
  }
  if (
    ip === "::1" ||
    ip === "::" ||
    ip === "0.0.0.0" ||
    ip.startsWith("fe80:") || // link-local
    ip.startsWith("fc") || // unique local fc00::/7
    ip.startsWith("fd") // unique local fd00::/7
  ) {
    return true;
  }
  return false;
}

function normalize(ip: string): string | null {
  let v = ip.trim();
  if (!v) return null;
  // Quitar prefijo IPv4-mapped IPv6 (::ffff:190.0.0.1 → 190.0.0.1)
  if (v.startsWith("::ffff:")) v = v.slice(7);
  // Quitar zona/interfaz (fe80::1%eth0)
  const zone = v.indexOf("%");
  if (zone !== -1) v = v.slice(0, zone);
  return v || null;
}

// Recibe los valores de x-forwarded-for, x-real-ip, cf-connecting-ip (en ese
// orden) y devuelve la primera IP pública válida.
export function firstPublicIp(headerValues: (string | null)[]): string | undefined {
  for (const raw of headerValues) {
    if (!raw) continue;
    for (const candidate of raw.split(",")) {
      const ip = normalize(candidate);
      if (!ip) continue;
      if (!isPrivateIp(ip)) return ip;
    }
  }
  return undefined;
}
