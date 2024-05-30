import {RegisterOrLoginGoogleUser} from './userService';
import {OAuth2Client} from 'google-auth-library';

const config = useRuntimeConfig();

const oauth2Client = new OAuth2Client(
    config.google_client_id,
    config.google_client_secret,
    config.google_redirect_uri
);

export async function AuthGoogle(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token ?? '',
        audience: config.google_client_id,
    });
    const payload = ticket.getPayload();

    if(!payload) throw new Error("Invalid Google Token");

    const email = payload['email'];
    const picture = payload['picture'];

    if(!email || !picture) throw new Error("Invalid Google Payload");

    const user = RegisterOrLoginGoogleUser(email, picture);
    return user;
}

export default {
    AuthGoogle
}