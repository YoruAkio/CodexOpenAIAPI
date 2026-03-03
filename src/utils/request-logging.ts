import type { MiddlewareHandler } from "hono";

function getClientIp(headers: {
  forwardedFor?: string;
  realIp?: string;
  cfIp?: string;
}): string {
  if (headers.forwardedFor) {
    const [first] = headers.forwardedFor.split(",").map((item) => item.trim());
    if (first) {
      return first;
    }
  }

  if (headers.realIp) {
    return headers.realIp;
  }

  if (headers.cfIp) {
    return headers.cfIp;
  }

  return "unknown";
}

export const requestLogger: MiddlewareHandler = async (c, next) => {
  const requestId = crypto.randomUUID().slice(0, 8);
  const method = c.req.method;
  const path = c.req.path;
  const clientIp = getClientIp({
    forwardedFor: c.req.header("x-forwarded-for"),
    realIp: c.req.header("x-real-ip"),
    cfIp: c.req.header("cf-connecting-ip"),
  });
  const userAgent = c.req.header("user-agent") || "unknown";
  const hasAuthHeader = Boolean(c.req.header("authorization"));

  console.info(
    `[request:${requestId}] -> ${method} ${path} ip=${clientIp} auth=${hasAuthHeader ? "yes" : "no"} ua=\"${userAgent}\"`
  );

  await next();
};
