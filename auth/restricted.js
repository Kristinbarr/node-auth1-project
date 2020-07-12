function restricted(req, res, next) {
  return async (req, res, next) => {
    try {
      if (req.session && req.session.user) {
        next()
      } else {
        res.status(401).json({ message: 'Invalid Credentials' })
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = restricted
