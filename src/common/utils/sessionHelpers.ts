import type { Request } from "express";

export async function destroySession(req: Request) {
	return new Promise((resolve, reject) => {
		req.session.destroy((err) => {
			if (err) return reject(err);
			resolve(true);
		});
	});
}
