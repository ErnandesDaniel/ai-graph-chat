import { validateRequest } from "@/app/auth";
import { cache } from "react";
import superjson from "superjson";
import { TRPCError, initTRPC } from "@trpc/server";

export const createTRPCContext = cache(async () => {
    /**
     * @see: https://trpc.io/docs/server/context
     */
        // Your custom auth logic here
    const { session, user } = await validateRequest();

    return {
        session,
        user,
    };
});
type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

export const authenticatedProcedure = t.procedure.use(async (opts) => {
    if (!opts.ctx.user || !opts.ctx.session) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Unauthorized",
        });
    }
    return opts.next({
        ctx: {
            user: opts.ctx.user,
            session: opts.ctx.user,
        },
    });
});
