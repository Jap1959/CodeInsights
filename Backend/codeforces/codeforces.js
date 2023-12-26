const axios = require('axios');
const ValidationCodeforces = async (username) => {
    try {

        let response = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
        const result = await response.json();
        if (result.status == 'FAILED') {
            return (({ status: 422, message: result.comment }));
        }
        else {

            return (({ status: 200, message: result.handle }));
        }
    } catch (e) {
        return (({ status: 422, message: e }));
    }
}
const NumberofProblemCodeforces = async (username) => {
    try {

        const result = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);
        const response = result.data;
        if (response.status !== 'OK') {
            return ({ status: 500, message: 0, error: "Temporialiy unavailable." })
        }
        const res = result.data;
        const solved = new Set();

        res.result.forEach((item, index) => {
            const { id, problem, author, verdict, timeConsumedMillis } = item;

            if (verdict == 'OK') {
                solved.add(problem.name);
            }
        });
        return (({ status: 200, message: solved.size }));
    } catch (e) {
        return (({ status: 422, message: e }));
    }
}
const GetCodeforcesUserDetail = async (username) => {
    try {
        const result = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
        const response = result.data;
        if (response.status !== 'OK') {
            return ({ status: 500, message: 0, error: "Temporialiy unavailable." })
        }
        if (response.status === 'OK') {
            const nump = await NumberofProblemCodeforces(username);
            let color = 'grey';
            let maxcolor='';
            switch (response.result[0].rank) {
                case 'legendary grandmaster':
                    color = 'red';
                    break;
                case 'international master':
                    color = '#FF8C00';
                    break;
                case 'candidate master':
                    color = '#AA00AA';
                    break;
                case 'expert':
                    color = '#0000FF';
                    break;
                case 'newbie':
                    color = '#808080';
                    break;
                case 'pupil':
                    color = '#008000';
                    break;
                case 'specialist':
                    color = '#03A89E';
                    break;
                default:
                // code block
            }
            switch (response.result[0].maxRank) {
                case 'legendary grandmaster':
                    maxcolor = 'red';
                    break;
                case 'international master':
                    maxcolor = '#FF8C00';
                    break;
                case 'candidate master':
                    maxcolor = '#AA00AA';
                    break;
                case 'expert':
                    maxcolor = '#0000FF';
                    break;
                case 'newbie':
                    maxcolor = '#808080';
                    break;
                case 'pupil':
                    maxcolor = '#008000';
                    break;
                case 'specialist':
                    maxcolor = '#03A89E';
                    break;
                default:
                // code block
            }
            return ({ status: 200, message: response, NumberOfProblem: nump.message, Color: color,Maxcolor:maxcolor });
        }
        else {
            return ({ status: 200, message: "Temporialiy unavailable." })
        }
    } catch (e) {
        return (({ status: 422, message: e }));
    }
}
module.exports = { ValidationCodeforces, NumberofProblemCodeforces, GetCodeforcesUserDetail };