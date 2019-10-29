const argCollector = require('./actions/arg-collector');
const generateQR = require('./actions/generate-qr');
const createPDF = require('./actions/create-pdf');

const numberOfQRCodes = 10;

function main() {
    let argumentsForQR = {};
    const maxPositionHorizontal = 600;
    const dteNow = Date.now();
    const PDFFILENAME = 'QRCode' + dteNow + '.pdf';


    const questions = [
        {
            question: "Enter number of labels per row: ",
            questionLabel: 'noPerRow',
            default: 4
        },
        {
            question: "Enter number of labels per column: ",
            questionLabel: 'noPerColumn',
            default: 4
        },
        {
            question: "Padding per page: ",
            questionLabel: 'pagePadding',
            default: 5
        },
        {
            question: "Number of copies for each label: ",
            questionLabel: 'copiesPerLabel',
            default: 1
        },
        {
            question: "Prefix of Label: ",
            questionLabel: 'labelPrefix',
            default: 'Label'
        }
    ];


    argCollector(questions)
        .then(args => {
            argumentsForQR = args;

            const qrCodePromises = Array.from(Array(numberOfQRCodes).keys()).map((item, index) => {
                const qrLabel = argumentsForQR.labelPrefix + index;
                return generateQR(qrLabel);
            });

            return Promise.all(qrCodePromises);
        })
        .then(files => {
            const dups = [];
            files.forEach(item => {

                for (let i = 0; i < argumentsForQR.copiesPerLabel; i++) {
                    dups.push(item);
                }

            });
            return createPDF(PDFFILENAME, dups, argumentsForQR);
        })
        .then(() => {
            console.log("Your QR Codes are now available in ", PDFFILENAME);
        });

}


main();