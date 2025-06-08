export const requireRole = (...allowedRole) => {
    return (req, res, next) => {
        const role = req.session?.user?.role;
        if (!role || !allowedRole.includes(role)) {
            return res.status(403).json({ error: "Access denied: insufficient priveleges."})
        }
        next();
    };
};

export const limitDays = (maxDays) => (req, res, next) => {
    const { days } = req.body;
    if (days > maxDays) {
        return res.status(400).json({ error: `Only up to ${maxDays} days allowed.`})
    }
    next();
};