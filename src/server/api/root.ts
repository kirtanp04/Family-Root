
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { FamilyRoute } from "./routers/Family";
import { UserRoute } from "./routers/User";


export const appRouter = createTRPCRouter({
  // post: postRouter,
  Family: FamilyRoute,
  User: UserRoute
});


export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
