const { JSDOM } = require('jsdom');
const axios = require('axios');
const cheerio = require('cheerio');
const getCodechefData = async (username) => {
    try {
        let response = await axios.get(`https://www.codechef.com/users/${username}`);

        let dom = new JSDOM(response.data);

        let document = dom.window.document;
        let profileData = {
            name: document.querySelector('.user-details-container').children[0].children[1].textContent,
            NumberofProblem: document.querySelector('.problems-solved').children[1].children[0].textContent,
        };
        return (({ status: 200, message: profileData.name }));

    } catch (err) {
        return ({ status: 422, message: 'CodeChef user not found' });
    }
}
const getNoproblemcodehef = async (username) => {
    try {
        let response = await axios.get(`https://www.codechef.com/users/${username}`);
        let dom = new JSDOM(response.data);
        let document = dom.window.document;
        const html = response.data;
        const $ = cheerio.load(html);
        const scriptWithChart = $(`script:contains("Highcharts.chart")`).toString();
        try {
            const regex = /Highcharts\.chart\('submissions-graph',\s*({[\s\S]*?})\);/m;
            const match = scriptWithChart.match(regex);
            // const data = JSON.parse(match[1]);
            const regex2 = /series\s*:\s*\[\s*\{/g;
            let indices = [];
            let match1;
            while ((match1 = regex2.exec(match)) !== null) {
                indices.push(match1.index);
            }
            let ans = "";
            let flag = 0;
            for (let i = indices[0]; i < 2000; i++) {
                if (match[1][i] == 'y') {
                    i++;
                    while (match[1][i] != 'y') {
                        i++;
                    }
                    i += 2;
                    while (match[1][i] != ',') {
                        ans += match[1][i];
                        i++;
                    }
                    break;
                }
            }
            if (ans!==null) {
                return (({ status: 200, message: ans }));
            } else {
                return ({ status: 422, message: 'CodeChef user not found' });
            }
        }
        catch (e) { console.log(e); }

       
    } catch (err) {
        return ({ status: 422, message: 'CodeChef user not found' });
    }
}
const GetCodehefUserDetail = async (username) => {
    try {
        let data = await axios.get(`https://www.codechef.com/users/${username}`);
        let dom = new JSDOM(data.data);
        let document = dom.window.document;
        const numberofproblem = await getNoproblemcodehef(username);
        let color = 'white';
        switch (document.querySelector('.rating').textContent) {
            case '3\u2605':
                color = '#3366CC';
                break;
            case '2\u2605':
                color = '#1E7D22';
                break;
            case '1\u2605':
                color = '#666666';
                break;
            case '4\u2605':
                color = '#684273';
                break;
            case '5\u2605':
                color = '#FFBF00';
                break;
            case '6\u2605':
                color = '#FF7F00';
                break;
            case '7\u2605':
                color = '#D0011B';
                break;
            default:
            // code block
        }
        return ({
            success: true,
            Data: {
                profile: document.querySelector('.user-details-container').children[0].children[0].src,
                currentRating: parseInt(document.querySelector(".rating-number").textContent),
                highestRating: parseInt(document.querySelector(".rating-number").parentNode.children[4].textContent.split('Rating')[1]),
                countryFlag: document.querySelector('.user-country-flag').src,
                countryName: document.querySelector('.user-country-name').textContent,
                globalRank: parseInt(document.querySelector('.rating-ranks').children[0].children[0].children[0].children[0].innerHTML),
                countryRank: parseInt(document.querySelector('.rating-ranks').children[0].children[1].children[0].children[0].innerHTML),
                stars: document.querySelector('.rating').textContent || "unrated",
                color: color,
                numberofproblem: numberofproblem.message,
            }
        });
    } catch (err) {
        res.send({ success: false, error: err });
    }
}
module.exports = { getCodechefData, getNoproblemcodehef, GetCodehefUserDetail };

/*
const axios = require('axios');
const jsdom = require("jsdom");
const express = require('express')
const app = express();
const { JSDOM } = jsdom;

app.get('/:handle', async (req, res) => {
    try {
        let data = await axios.get(`https://www.codechef.com/users/${req.params.handle}`);
        let dom = new JSDOM(data.data);
        let document = dom.window.document;
        res.status(200).send({
            success: true,
            profile: document.querySelector('.user-details-container').children[0].children[0].src,
            name: document.querySelector('.user-details-container').children[0].children[1].textContent,
            currentRating: parseInt(document.querySelector(".rating-number").textContent),
            highestRating: parseInt(document.querySelector(".rating-number").parentNode.children[4].textContent.split('Rating')[1]),
            countryFlag: document.querySelector('.user-country-flag').src,
            countryName: document.querySelector('.user-country-name').textContent,
            globalRank: parseInt(document.querySelector('.rating-ranks').children[0].children[0].children[0].children[0].innerHTML),
            countryRank: parseInt(document.querySelector('.rating-ranks').children[0].children[1].children[0].children[0].innerHTML),
            stars: document.querySelector('.rating').textContent || "unrated",
        });
    } catch (err) {
        res.send({ success: false, error: err });
    }
})
app.get('/', (req, res) => {
    res.status(200).send("Hi you are at right endpoint just add /handle_of_user at the end of url\n Developer: Github-repo(https://github.com/deepaksuthar40128/Codechef-API)");
})
const PORT = process.env.PORT || 8800;
app.listen(PORT);
*/