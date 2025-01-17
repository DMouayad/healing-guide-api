import type { NextFunction, Request, Response } from "express";

export default (req: Request, res: Response, next: NextFunction) => {
	const input = req.flash("input");
	const errors = req.flash("errors");
	if (input) {
		res.locals.input = input[0] || {};
	}
	if (errors) {
		res.locals.errors = errors;
	}
	next();
};
