/**
 * ルーティング
 */
import * as express from 'express';
import * as path from 'path';
import * as authorize from '../controllers/authorize/authorize.controller';
import * as maintenance from '../controllers/maintenance/maintenance.controller';
import * as master from '../controllers/master/master.controller';
import * as purchase from '../controllers/purchase/purchase.controller';

export default (app: express.Application) => {
    app.use((_req, res, next) => {
        res.locals.NODE_ENV = process.env.NODE_ENV;
        next();
    });

    app.get('/api/purchase/getSeatState', purchase.getSeatState);

    app.get('/api/master/getSalesTickets', master.getSalesTickets);
    app.get('/api/master/getTickets', master.getTickets);

    app.get('/api/authorize/getCredentials', authorize.getCredentials);
    app.get('/api/authorize/signIn', authorize.signIn);
    app.get('/api/authorize/signOut', authorize.signOut);
    app.get('/signIn', authorize.signInRedirect);
    app.get('/signOut', authorize.signOutRedirect);

    app.get('/api/maintenance/confirm', maintenance.confirm);

    app.get('*', (_req, res, _next) => {
        const fileName = (process.env.NODE_ENV === 'production') ? 'production.html' : 'index.html';
        res.sendFile(path.resolve(`${__dirname}/../../../client/${process.env.NODE_ENV}/${fileName}`));
    });
};
