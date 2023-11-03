export function authHandler(req, res, next) {
    if (!req.session.passport) {
        res.status(400).send({"message": "UNAUTHORIZED"});
    } else {
        next()
    }
}