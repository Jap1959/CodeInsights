const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: true,
    },
    Password: String,
    codechef: String,
    codeforces: String,
    leetocde: String,
    usertype: {
        type: String,
        default: "Normal"
    },
    tokens: [{
        token: {
            type: String, required: true
        }
    }],
    submissions: [{
        ProblemName: String,
        Code: String,
        result: String,
        Time: String,
        ContestName: String,
        date: Date,
        CompilationError: String,
    }],
});
const LeadberboardSchema = new mongoose.Schema({
    Rank: Number,
    codechefsolved: Number,
    codeforcessolved: Number,
    leetcodesolved: Number,
    totalsolved: Number,
    id: String,
});
const StandingSchema = new mongoose.Schema({
    ProblemName: [{
        ProblemName: String,
        Score: { type: Number, default: 0 },
    }],
    id: String,
    penalty: Number,
    TotalScore: Number,

});
const RankLists = new mongoose.Schema({
    ContestName: String,
    Ranks: [StandingSchema],
});
const Problems = new mongoose.Schema({
    ProblemName: String,
    ProblemDescrption: String,
    SampleInput: String,
    SampleOutput: String,
    TestcasesInput: [],
    TestcasesOutput: [],
    TimeLimit: mongoose.Types.Decimal128,
    Constraints: String,
    NumberSubmission: { type: Number, default: 0 },
});
const contest = new mongoose.Schema({
    contestname: String,
    ProblemList: [Problems],
    constesttime: Date,
    ConstestEndTime: Date,
});
const Contest = mongoose.model("contest", contest);
const Standing = mongoose.model("Standing", StandingSchema);
const RankList = mongoose.model("RankList", RankLists);
const Leaderboard = mongoose.model("Leaderboard", LeadberboardSchema);
const Problem = mongoose.model("Problem", Problems);
const User = mongoose.model("User", UserSchema);
module.exports = { User, Leaderboard, Problem, Contest, Standing, RankList };