const Schemas = require('../Schemas');
const codechef = require('D:/Code_insights/Backend/Codechef/codechef.js');
const codeforces = require('D:/CodeInsights/Backend/codeforces/codeforces');
const leetcode = require('D:/CodeInsights/Backend/Leetcode/leetcode');


const getuserdata = async () => {
  try {
    const leaderboarddata = [];
    const result = await Schemas.User.find();
    await Promise.all(result.map(async (user) => {
      const resultcodechef = await codechef.getNoproblemcodehef(user.codechef);
      const resultcodeforces = await codeforces.NumberofProblemCodeforces(user.codeforces);
      const resultleetcode = await leetcode.getLeetCodeData(user.leetocde);
      const username = user.Email.substring(0, 7);
      var codeforcessolved = parseInt(resultcodeforces.message);
      var codechefsolved = parseInt(resultcodechef.message);
      var leetcodesolved = parseInt(resultleetcode.data.totalSolved);
      var totalsolved = codechefsolved + codeforcessolved + leetcodesolved;
      leaderboarddata.push({
        codeforces: resultcodeforces.status === 500 ? resultcodeforces.error : resultcodeforces.message,
        codechef: resultcodechef.message,
        leetcode: resultleetcode.data.totalSolved,
        total: totalsolved,
        codechefuser: user.codechef,
        codeforcesuser: user.codeforces,
        leetcodeuser: user.leetocde,
        username: username,
        id: user._id,
      });
    }));
    return leaderboarddata;
  } catch (error) {
    console.error("Error in getuserdata:", error);
    throw error;
  }
};
const GetParticularUserData = async (id) => {
  try {
    const user = await Schemas.User.findById(id);
    if (user != null) {
      try {
        const ParticularUserData = [];
        const resultcodechef = await codechef.GetCodehefUserDetail(user.codechef);
        const resultcodeforces = await codeforces.GetCodeforcesUserDetail(user.codeforces);
        const resultleetcode = await leetcode.getLeetCodeData(user.leetocde);
        ParticularUserData.push({
          status: 200,
          codeforces: resultcodeforces.message.status !== 'OK' ? 'Temporialy Not Available' : resultcodeforces.message,
          codeforcesSolved: resultcodeforces.message.status !== 'OK' ? 'Temporialy Not Available' : resultcodeforces.NumberOfProblem,
          codeforcesColor: resultcodeforces.message.status !== 'OK' ? 'Temporialy Not Available' : resultcodeforces.Color,
          codeforcesmaxColor: resultcodeforces.message.status !== 'OK' ? 'Temporialy Not Available' : resultcodeforces.Maxcolor,
          codechef: resultcodechef.Data,
          leetcode: resultleetcode.data,
          codechefuser: user.codechef,
          codeforcesuser: user.codeforces,
          leetcodeuser: user.leetocde
        });

        return (ParticularUserData);
      } catch (error) {
        console.error("Error in getuserdata:", error);
        throw error;
      }
    } else {
      return ({ status: 422, message: 'User Do Not Exist' });
    }
  } catch (e) {
    console.log(e);
  }

};


module.exports = { getuserdata, GetParticularUserData };
