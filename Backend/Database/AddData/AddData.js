
const Userschema = require("../Schemas");
const bcrypt = require('bcrypt');
const Adduser = async (email, password, Codechef, Codeforces, Leetcode) => {
    const result = await Userschema.User.find({ Email: email });
    if (result.length !== 0) {
        return ({ status: 422, message: "User Already Exists" });
    }
    else {
        const saltRounds = 10;
        const hashed = bcrypt.hashSync(password, saltRounds);
        if (hashed != null) {
            try {
                const newuser = new Userschema.User({
                    Email: email,
                    Password: hashed,
                    codechef: Codechef,
                    codeforces: Codeforces,
                    leetocde: Leetcode,
                });
                const result = await newuser.save();
                if (result != null) {
                    return ({ status: 200, message: "data added sucessfully" });
                }
                else {
                    return ({ status: 422, message: "Some Error ocuured" });
                }
            }
            catch (err) {
                console.log(err);
                return ({ status: 422, message: err });
            }
        }
        else {
            return ({ status: 422, message: 'Try again later' });
        }
    }
}
module.exports = { Adduser };