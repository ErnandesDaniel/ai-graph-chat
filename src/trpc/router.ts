import { publicProcedure, router } from "./init";

export const appRouter = router({
    hello: publicProcedure.query(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return "Hello World";
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;