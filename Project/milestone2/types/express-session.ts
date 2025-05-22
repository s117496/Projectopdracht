import { User, FlashMessage } from "../types";

declare module "express-session" {
    export interface SessionData {
        visited: number,
        user: User,
        message: FlashMessage
    }
}
