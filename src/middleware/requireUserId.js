const getExplicitUserId = (req) => {
  const body = req.body || {};
  const query = req.query || {};

  return req.header('x-user-id') || body.usuarioId || body.userId || query.usuarioId || query.userId;
};

const requireUserId = (req, res, next) => {
  const explicitUserId = getExplicitUserId(req);

  if (!explicitUserId) {
    return res.status(401).json({
      message: 'ID do usuario deve ser informado na requisicao'
    });
  }

  if (String(explicitUserId) !== String(req.userId)) {
    return res.status(403).json({
      message: 'ID do usuario nao corresponde ao token informado'
    });
  }

  return next();
};

module.exports = requireUserId;
