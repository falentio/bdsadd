import { listenAndServe } from "https://deno.land/std@0.122.0/http/server.ts";
import { sprintf } from "https://deno.land/std@0.122.0/fmt/printf.ts";

function getEnv<
	// deno-lint-ignore no-explicit-any
	T extends (s: string) => any,
>(name: string, def: string, fn: T): ReturnType<T> {
	return fn(Deno.env.get(name) ?? def);
}

const port = getEnv("PORT", "8080", Number);

await listenAndServe({ port }, (req) => {
	const { searchParams, pathname } = new URL(req.url);
	if (pathname != "/") {
		return new Response("not found", { status: 404 });
	}

	const address = searchParams.get("address") || "127.0.0.1";
	const name = searchParams.get("name") || address;
	const port = searchParams.get("port") || "19132";
	const server = sprintf("%s|%s:%s", name, address, port);

	const mc = new URL("minecraft://");
	mc.searchParams.set("addExternalServer", server);

	return Response.redirect(mc.href.replace(/\+/g, "%20"));
});
