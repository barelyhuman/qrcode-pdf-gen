const PDFDocument = require('pdfkit');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const folderPath = path.join(__dirname, '..', 'pdfs');
mkdirp(folderPath);

module.exports = function (fileName, filesToAdd, options) {
    const doc = new PDFDocument({
        bufferPages: true
    });

    if (!fileName.match(/\.pdf$/)) {
        fileName += '.pdf';
    }

    doc.pipe(fs.createWriteStream(path.join(folderPath, fileName)));

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    const imageWidths = (pageWidth / options.noPerRow) - (options.pagePadding * 2);
    const imageHeights = (pageHeight / options.noPerColumn) - (options.pagePadding * 2);

    let positionX = 0;
    let positionY = parseInt(options.pagePadding);

    let currentRow = 0;
    let currentColumn = 0;
    let currentPage = 0;

    const configs = filesToAdd.map((file) => {
        positionX = (imageWidths * currentColumn) + +options.pagePadding;

        if (currentColumn >= options.noPerRow) {
            currentRow += 1;
            currentColumn = 0;
            positionX = parseInt(options.pagePadding);
            positionY = parseInt(options.pagePadding) + (imageHeights * currentRow);
        }

        if (currentRow >= options.noPerColumn) {
            currentRow = 0;
            positionX = parseInt(options.pagePadding);
            positionY = parseInt(options.pagePadding);
            currentColumn = 0;
            currentPage += 1;
            doc.addPage();
        }

        currentColumn += 1;

        return {
            file: file,
            page: currentPage,
            positionX: positionX,
            positionY: positionY
        };

    });

    configs.forEach(function (config) {
        doc.switchToPage(config.page);
        doc.image(config.file.filePath, config.positionX, config.positionY, {
            fit: [imageWidths, imageHeights],
            align: 'center'
        }).text(config.file.label, config.positionX, config.positionY, {
            width: imageWidths,
            height: 10,
            align: 'center'
        });
    });


    doc.end();

}