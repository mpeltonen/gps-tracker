import { AppRouter } from "../../server/trpc/routers";
import { createReactQueryHooks } from "@trpc/react";

export const trpc = createReactQueryHooks<AppRouter>();
