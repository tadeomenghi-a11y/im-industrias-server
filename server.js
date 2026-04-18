const express = require('express');
const cors    = require('cors');
const fetch   = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const app = express();
app.use(cors());
app.use(express.json());

const MP_TOKEN = process.env.MP_ACCESS_TOKEN;
const SUCCESS_URL = process.env.SUCCESS_URL || 'https://imindustrias.netlify.app';
const FAILURE_URL = process.env.FAILURE_URL || 'https://imindustrias.netlify.app';

// Health check
app.get('/', (req, res) => res.json({ status: 'IM Industrias Server OK' }));

// Crear preferencia de pago
app.post('/crear-pago', async (req, res) => {
  const { nombre, precio, cantidad } = req.body;

  if (!nombre || !precio || !cantidad) {
    return res.status(400).json({ error: 'Faltan datos: nombre, precio, cantidad' });
  }

  const total = parseFloat(precio) * parseInt(cantidad);

  const preference = {
    items: [
      {
        title:      nombre,
        quantity:   parseInt(cantidad),
        unit_price: parseFloat(precio),
        currency_id: 'ARS'
      }
    ],
    back_urls: {
      success: SUCCESS_URL + '?pago=aprobado',
      failure: FAILURE_URL + '?pago=rechazado',
      pending: SUCCESS_URL + '?pago=pendiente'
    },
    auto_return: 'approved',
    statement_descriptor: 'IM INDUSTRIAS',
    external_reference: `${nombre}-${cantidad}-${Date.now()}`
  };

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_TOKEN}`,
        'Content-Type':  'application/json'
      },
      body: JSON.stringify(preference)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MP Error:', data);
      return res.status(500).json({ error: 'Error al crear preferencia', detail: data });
    }

    res.json({
      link:     data.init_point,      // link real
      link_sandbox: data.sandbox_init_point, // link de prueba
      id:       data.id,
      total:    total
    });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`IM Industrias server corriendo en puerto ${PORT}`));
