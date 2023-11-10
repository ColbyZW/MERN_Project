export function authHandler(req, res, next) {
    if (!req.session.passport) {
        res.status(403).send({
            "message": "UNAUTHORIZED",
            "redirect": "/"
        });
    } else {
        next()
    }
}

export function unableToFindAccount(res) {
    res.status(400).send({
        "message": "Unable to locate account",
        "redirect": "/"
    });
}