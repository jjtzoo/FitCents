export const requireRole = (...allowedRole) => {
    return (req, res, next) => {
        const role = req.session?.user?.role;
        if (!role || !allowedRole.includes(role)) {
            return res.status(403).json({ error: "Access denied: insufficient priveleges."})
        }
        next();
    };
};

export const limitDaysByRole = () => (req, res, next) => {
    const role = req.session?.user?.role;
    const days = req.body?.dietDuration_days;

    if (!days) {
        return res.status(400).json({error: "Missing key fields in the request submitted."})
    }

    const maxByRole = {
        regular: 7,
        premium: 30,
        developer: 30,
    };

    const allowed = maxByRole[role];

    if (!allowed) {
        return res.status(403).json({ error: "Access denied."});
    }

    if (days > allowed) {
        return res.status(400).json({ error: `Your current plan only allows ${allowed} days`});
    }

    next();
}