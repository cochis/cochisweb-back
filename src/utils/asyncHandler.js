/**
 * Wrap async route handlers to automatically forward errors
 * to Express error middleware.
 *
 * Usage:
 *   router.get('/route', asyncHandler(async (req, res) => {
 *     const data = await somethingAsync();
 *     res.json(data);
 *   }));
 */

export const asyncHandler = (fn) => {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};