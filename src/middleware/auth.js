const jwt = require('jsonwebtoken');

const getToken = (req) => {
  const authorization = req.header('Authorization');
  if (!authorization) return null;

  return authorization.replace(/^Bearer\s+/i, '').trim();
};

const auth = (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      return res.status(401).json({ message: 'Token nao fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.usuarioId || decoded.id;
    req.user = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token invalido ou expirado',
      error: error.message
    });
  }
};

module.exports = auth;
