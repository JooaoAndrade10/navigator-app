
const express = require('express');

const router = express.Router();

const NOMINATIM_URL =
  'https://nominatim.openstreetmap.org/search';

const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

let lastRequestAt = 0;

router.get('/', async (req, res) => {
  const query =
    typeof req.query.q === 'string'
      ? req.query.q.trim()
      : '';

  if (!query) {
    return res.status(400).json({
      error: 'Informe um destino para pesquisar.',
    });
  }

  if (query.length > 200) {
    return res.status(400).json({
      error: 'O destino deve ter até 200 caracteres.',
    });
  }

  const cacheKey = query.toLowerCase();
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return res.json(cached.data);
  }

  // Respeita o intervalo mínimo entre consultas ao serviço.
  const elapsed = Date.now() - lastRequestAt;

  if (elapsed < 1100) {
    return res.status(429).json({
      error: 'Aguarde um instante antes de pesquisar novamente.',
    });
  }

  lastRequestAt = Date.now();

  try {
    const url = new URL(NOMINATIM_URL);

    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '1');
    url.searchParams.set('q', query);

    const contactEmail =
      process.env.NOMINATIM_CONTACT_EMAIL;

    const userAgent = contactEmail
      ? `Navigator/1.0 (contact: ${contactEmail})`
      : 'Navigator/1.0 (personal learning project)';

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': userAgent,
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error(
        'Nominatim respondeu com HTTP',
        response.status
      );

      return res.status(502).json({
        error:
          response.status === 403
            ? 'O serviço de pesquisa recusou a consulta.'
            : 'O serviço de pesquisa está indisponível.',
        upstreamStatus: response.status,
      });
    }

    const results = await response.json();

    const data = results.map((item) => ({
      lat: item.lat,
      lon: item.lon,
      display_name: item.display_name,
    }));

    cache.set(cacheKey, {
      time: Date.now(),
      data,
    });

    return res.json(data);
  } catch (error) {
    console.error('Erro na consulta Nominatim:', error);

    return res.status(502).json({
      error: 'Não foi possível consultar o serviço de pesquisa.',
    });
  }
});

module.exports = router;
