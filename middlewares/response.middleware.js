const responseMiddleware = (req, res, next) => {
  if (res.err) {
    const status = res.err.status === 404 ? 404 : 400;

    return res.status(status).json({
      error: true,
      message: res.err.message,
    });
  }

  res.status(200).json(res.data);
};

export { responseMiddleware };
