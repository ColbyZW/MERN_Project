export function authHandler(response, navigate) {
    if (response.status === 403) {
        navigate(response.redirect)
        return false;
    }
    return true;
}