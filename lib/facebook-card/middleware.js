
module.exports = function middleware(req, res, next) {
	if (!req.headers['user-agent']) return next();
	if (/facebookexternalhit/.test(req.headers['user-agent'])) {
		req.url = "/facebook-card/" + req.url;
	}
	next();
}
