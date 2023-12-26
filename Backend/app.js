const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const auth = require('./auth/auth');
const cookieparser = require('cookie-parser');
const token = require('../Backend/auth/AuthToken');
const leaderboard = require('./Database/GetData/GetUserData');
// const GetData = require('./GetData/GetUserData');
// const Contest = require('./GetData/GetContestData');
// const Problem = require('./GetData/GetProblemData');
// const session = require('express-session');
// const AddContest = require('./AddContest');
// const multer = require('multer');
// const Problemsubmit = require('./compiler');
// const AddProblem = require('./Addproblem');
const expressSession = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(expressSession);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser());
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
mongoose.connect("mongodb://127.0.0.1:27017/CodeInsights", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connection sucessfull.....')).catch((err) => console.log(err));
const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/CodeInsights',
    collection: 'sessions',
});
app.use(
    expressSession({
        secret: 'TheCodinsightsSession',
        resave: false,
        saveUninitialized: true,
        store: store,
        cookie: { maxAge: 24 * 3600000 },
    })
);
app.get('/token', async (req, res) => {
    if (req.session) {
        const sessiontoken = req.session.token;
        const result = await token.GetTokenDetails(sessiontoken);
        res.send(result);
    } else {
        res.send({ login: false });
    }
});
app.post('/SignUP', async (req, res) => {
    const data = req.body;
    const result = await auth.register(data);
    res.send(result);
});
app.post('/Login', async (req, res) => {
    const data = req.body;
    const result = await auth.login(data, req, res);
    if (result.status === 200) {
        req.session.token = result.token;
    }
    res.send({ status: result.status, message: result.message });
});
app.get('/logout', (req, res) => {
    req.session.token = null;
    res.send({ status: 200, message: "Logged out successfully" });
});
app.get('/UserList', async (req, res) => {
    const result = await leaderboard.getuserdata();
    result.sort((a, b) => b.total - a.total);
    res.send({ status: 200, Data: result });
});
app.get('/Profile/:id', async (req, res) => {
    const id = req.params.id;
    const result = await leaderboard.GetParticularUserData(id);
    res.send({ status: 200, Data: result });
});
app.get('/UserProfile', async (req, res) => {
    if (req.session) {
        const TokenDetails = await token.GetTokenDetails(req.session.token);
        const result = await leaderboard.GetParticularUserData(TokenDetails.id);
        if (result.status === 422) {
            res.send(result);
        } else {
            res.send({ status: 200, Data: result });
        }
    } else {
        res.send({ status: 422, Data: 'Login Required' });
    }
});
app.listen(5000, () => {
    console.log('Listening on port 5000...............');
});