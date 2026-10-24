const { randomUUID } = require("crypto");
const { trace, context } = require("@opentelemetry/api");
const { registro } = require("./registro");

function idsDeTraza() {
  const span = trace.getSpan(context.active());
  if (!span) return {};
  const { traceId, spanId } = span.spanContext();
  return { traceId, spanId };
}

function correlacion(req, res, next) {
  req.idCorrelacion = req.get("x-correlation-id") || randomUUID();
  res.set("x-correlation-id", req.idCorrelacion);

  req.registro = registro.child({
    idCorrelacion: req.idCorrelacion,
    ruta: req.path,
    metodo: req.method,
    ...idsDeTraza(),
  });

  next();
}

module.exports = { correlacion };
