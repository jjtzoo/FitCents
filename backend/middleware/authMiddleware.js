export const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user && req.session.user._id) {
        return next();
    }

    return res.status(401).json({ error: "Unauthorized access." });
};

export const isAuthorized = (req, res, next) => {
    const sessionUser = req.session?.user;
    const targetUsername = req.params.username;

    if (!sessionUser) {
        return res.status(401).json( { error: "Not Logged in."})
    }

    if(sessionUser.role === "developer") {
        return next();
    }

    if (targetUsername) {
        if (sessionUser.auth?.username !== targetUsername) {
            return res.status(403).json({ error: "Forbidden: You are not the owner of this resource." });
        }
    }

    return next();
}
