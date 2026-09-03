# Escalación a Mercado Pago — PSE 424/9032 (mensaje listo para copiar/pegar)

Cuenta MP: app `5837577013562274` / user `554801618` · Colombia · Producción (APP_USR) y sandbox (TEST).

---

## Mensaje para soporte

**Asunto: PSE no operativo — `424/9032 "BankTransfers Api fail"` persistente al crear el pago**

Hola, al crear un pago PSE vía `POST /v1/payments` con un payload 100% conforme a su documentación y al ejemplo oficial del Payment Brick (editor Node), la API devuelve siempre:

```json
{
  "message": "BankTransfers Api fail",
  "error": "failed_dependency",
  "status": 424,
  "cause": [
    { "code": 9032, "description": "BankTransfers Api fail", "data": "<correlativo>" }
  ]
}
```

**Correlativos (`cause[0].data`) generados por su backend:**

| Entorno | Método | Banco | Correlativo |
|---|---|---|---|
| Sandbox | Flujo web (brick) | 1006 | `28-08-2026T23:46:29UTC;6d091b85-cf61-4c10-b2be-c16ed2572e25` |
| Sandbox | SDK oficial Node v3.6.0 | 1007 | `31-08-2026T01:07:33UTC;45ebdf4b-3630-435e-aef6-d6347d030aa9` |
| Producción | Script API directa | 1007 | `02-09-2026T04:27:26UTC;1e5494a8-2f42-4371-b9ca-fdb47d72a4a8` |
| Producción | Script API directa | 1006 | `02-09-2026T04:27:26UTC;56771d93-d089-424e-809f-e3cc7f31fb90` |

**Evidencia de que no es del integrador:**

1. El payload es el ejemplo oficial del Payment Brick PSE (Node): `payment_method_id:"pse"`, `transaction_details.financial_institution`, `payer.entity_type:"individual"`, `payer.identification`, `additional_info.ip_address`, `callback_url`, `notification_url`, `installments:1`. Cumple además el schema de la SDK (`PaymentCreateRequest`).
2. Se reprodujo con tres clientes distintos: **fetch directo, la SDK oficial de Node que ustedes recomiendan, y Postman** → mismo `9032` en los tres.
3. Probado con varios bancos (1006 Itaú, 1007 Bancolombia, 1051 Davivienda) → mismo `9032`; Nequi (1507) da un error distinto (`500/1090`), lo que indica que MP recibe y procesa la petición.
4. Los pagos con tarjeta aprueban en la misma cuenta/endpoint (ej. payment `1351103547`, monto 2.299.000).
5. El historial de status.mercadopago.com muestra incidentes PSE recurrentes en Colombia (21/08–01/09). La última prueba (02/09, 04:27 UTC), posterior al último "resolved", sigue devolviendo 9032.

**Solicitud:** por favor verificar:
(a) la habilitación de PSE / `bank_transfer` en la cuenta `5837577013562274`;
(b) el estado del servicio BankTransfers para esta app;
(c) si la cuenta requiere bancarización/validación adicional (documento, datos bancarios) para operar PSE;
(d) qué falta exactamente para que `POST /v1/payments` con `payment_method_id:"pse"` cree el pago (status `pending` + `external_resource_url`).

---

## Material de apoyo (si lo piden)

- Payload de ejemplo enviado (idéntico en todos los intentos, solo cambia el banco):
  ```json
  {
    "transaction_amount": 2299000,
    "description": "Pago de prueba PSE (produccion)",
    "payment_method_id": "pse",
    "transaction_details": { "financial_institution": "1007" },
    "installments": 1,
    "callback_url": "https://www.lamagiadecantar.co/checkout/success",
    "notification_url": "https://www.lamagiadecantar.co/api/webhooks/mercadopago",
    "additional_info": { "ip_address": "186.168.208.248" },
    "payer": {
      "email": "comprador.test@example.com",
      "entity_type": "individual",
      "first_name": "Camila",
      "last_name": "Pérez",
      "identification": { "type": "CC", "number": "1012345678" }
    },
    "external_reference": "test-pse-prod-1007-1788323244384"
  }
  ```
- Historial de incidentes PSE Colombia: https://status.mercadopago.com/
- Reproducción con la SDK oficial: `scripts/test-pse-sdk.ts` (mercadopago 3.6.0).
- Resumen completo de pruebas: `docs/pse-pruebas-resumen.md`.
