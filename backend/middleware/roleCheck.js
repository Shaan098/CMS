const roleCheck = (requiredRole = 'Admin') => {
    return (req, res, next) => {
        try {
            // Check if user exists (should be attached by auth middleware)
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Check if user has required role
            if (req.user.role !== requiredRole) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. ${requiredRole} role required.`
                });
            }

            next();
        } catch (error) {
            console.error('Role check error:', error.message);
            res.status(500).json({
                success: false,
                message: 'Role verification failed'
            });
        }
    };
};

module.exports = roleCheck;
