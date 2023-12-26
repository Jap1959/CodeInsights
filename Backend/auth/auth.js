const leetcode = require('../Leetcode/leetcode');
const codechef = require('../Codechef/codechef');
const codeforces = require('../codeforces/codeforces');
const AddData = require('../Database/AddData/AddData');
const Schemas = require('../Database/Schemas');
const token = require('../auth/AuthToken');
const bcrypt = require('bcrypt');
const register = async (data) => {
    const resultleetcode = await leetcode.getLeetCodeData(data.leetcode);
    const resultcodechef = await codechef.getCodechefData(data.codechef);
    const resultcodeforces = await codeforces.ValidationCodeforces(data.codeforces);
    if (resultleetcode.status != 200) {
        return ({ status: 422, message: "leetcode" + resultleetcode.message });
    }
    if (resultcodechef.status != 200) {
        return ({ status: 422, message: "codechef" + resultcodechef.message });
    }
    if (resultcodeforces.status != 200) {
        return ({ status: 422, message: "codeforces" + resultcodeforces.message });
    }
    else {
        const result = await AddData.Adduser(data.Email, data.password, data.codechef, data.codeforces, data.leetcode);
        if (result.status === 200) {

            return ({ status: 200, message: "registered Sucessfully" });
        }
        else {
            return ({ status: 422, message: result.message });
        }
    }
}
const login = async (data) => {
    const currentuser = await Schemas.User.findOne({ Email: data.Email });
    if (currentuser === null) {
        return ({ status: 422, message: "Account does not exist" });
    } else {
        const result = bcrypt.compareSync(data.Password, currentuser.Password);
        if (result === true) {
            const id = currentuser._id.toString();
            const tokengenerator = await token.GenerateToken(id, currentuser.usertype);
            if (tokengenerator !== null) {
                try {
                    return ({ status: 200, message: "Logged in successfully", token: tokengenerator });
                } catch (error) {
                    console.log(error);
                }
            } else {
                return ({ status: 422, message: "Some Error Ocurred" });
            }
        }
        else {
            return ({ status: 422, message: "Incorrect password" });
        }
    }
}
module.exports = { register, login }