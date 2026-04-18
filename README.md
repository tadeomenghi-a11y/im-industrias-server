# IM Industrias — Servidor MP

## Deploy en Render.com

1. Subí esta carpeta a GitHub
2. En Render: New → Web Service → conectá el repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Variables de entorno:
   - `MP_ACCESS_TOKEN` = tu Access Token de MP
   - `SUCCESS_URL` = URL de tu sitio
   - `FAILURE_URL` = URL de tu sitio

## Endpoint

POST /crear-pago
Body: { "nombre": "Cerradura Pop-Up", "precio": 10000, "cantidad": 3 }
Response: { "link": "https://www.mercadopago.com.ar/checkout/...", "total": 30000 }
