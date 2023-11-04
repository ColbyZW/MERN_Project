const redirectURL = process.env.REDIRECT_URL

export function authHandler(req, res, next) {
    if (!req.session.passport) {
        res.redirect(redirectURL);
    } else {
        next()
    }
}