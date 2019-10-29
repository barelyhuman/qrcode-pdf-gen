const readline = require('readline');

function ask(rl, question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        })
    });
}


module.exports = function (questions) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const rlQuestions = {};

    const argsFromQuestionPromise = questions.reduce((acc, item, index) => {
        return acc
            .then(() => {
                return ask(rl, item.question);
            })
            .then(answer => {
                rlQuestions[item.questionLabel] = answer || item.default;
            });
    }, Promise.resolve());

    return argsFromQuestionPromise.then(() => {
        rl.close();
        return rlQuestions;
    });

}