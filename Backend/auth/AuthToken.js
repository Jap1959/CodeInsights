const jwt = require('jsonwebtoken');
const Schema = require('../Database/Schemas');
const GenerateToken = async (id, usertype) => {
    try {
        let token = jwt.sign({ id: id, usertype: usertype }, 'THISCODEINSIGHTSYOUAREWELCOME');
        const user = await Schema.User.findById(id);
        user.tokens = user.tokens.concat({ token: token });
        const result = await user.save();
        if (result !== null) {
            return token;
        }
        else {
            return null;
        }
    } catch (err) {
        console.log(err);
    }
}
const GetTokenDetails = async (token) => {
    try {
        if (token !== null) {
            const decodedtoken = jwt.verify(token, 'THISCODEINSIGHTSYOUAREWELCOME');
            return ({ login: true, usertype: decodedtoken.usertype, id: decodedtoken.id });
        } else {
            return ({ login: false });
        }
    } catch (error) {
        console.log(error);
        return ({ login: false });
    }

}
module.exports = { GenerateToken, GetTokenDetails };