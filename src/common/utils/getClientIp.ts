import type { Request } from "express";
import { getTrustedProxiesFromEnv } from "./getTrustedProxies";

const proxyaddr = require("proxy-addr");

export function getClientIp(req: Request): string | undefined {
	return proxyaddr(req, getTrustedProxiesFromEnv());
}
