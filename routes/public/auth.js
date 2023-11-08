import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import passport from 'passport';


router.post('/login', function (req, res) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info || 'Something went wrong',
                user: user
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) { res.send(err); }
            const token = jwt.sign(user, 'your_jwt_secret'); // to-do: put the secret in .env // 1 hour lifetime
            return res.json({ user, token });
        });
    })(req, res);
});

router.post('/signup', function (req, res) {
    passport.authenticate('local-signup', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info || 'Something went wrong'
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) { res.send(err); }
            const token = jwt.sign(user, 'your_jwt_secret'); // to-do: put the secret in .env // 1 hour lifetime
            return res.json({ email: user, token });
        });
    }
    )(req, res);
});

export default router;