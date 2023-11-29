import { AuthCredentialsValidator } from "@/lib/validators/account-cred-validator";
import { publicProcedure, router } from "./trpc";

export const authRouter = router({
    createPayloadUser: publicProcedure.input(AuthCredentialsValidator).mutation(() => {
        //signup
    })
});