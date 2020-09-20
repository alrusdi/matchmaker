import * as dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { AccountModel } from "./db/models/Account";

export const setupPassport = async () => {
    passport.serializeUser((user, done) => {
        /*
        From the user take just the id (to minimize the cookie size) and just pass the id of the user
        to the done callback
        PS: You dont have to do it like this its just usually done like this
        */
        done(null, user);
    });

    passport.deserializeUser(async (userId: number, done) => {
        const user = await AccountModel.getById(userId)
        done(null, user);
    });

    passport.use(new Strategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_COLBACK_URL
        },
        async (_accessToken, _refreshToken, profile, done) => {
            let user = await AccountModel.getByOauthId(profile.id)
            if ( ! user) {
                user = await AccountModel.create({
                    oauthId: profile.id,
                    nickname: profile.displayName,
                    passwordHash: "",
                    isActive: true,
                    isReady: profile.displayName ? true : false
                })
            }
            return done(undefined, user.id);
        }
    ));
}