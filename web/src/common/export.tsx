export class ExportUtil {

    static export2Word(html = '', filename = '') {

        let preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        let postHtml = "</body></html>";
        let fullHtml = preHtml + html + postHtml;

        let blob = new Blob(['\ufeff', fullHtml], {
            type: 'application/msword'
        });

        // Specify link url
        let url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(fullHtml);

        // Specify file name
        filename = filename ? filename + '.doc' : 'document.doc';

        // Create download link element
        let downloadLink = document.createElement("a");

        document.body.appendChild(downloadLink);

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            // Create a link to the file
            downloadLink.href = url;

            // Setting the file name
            downloadLink.download = filename;

            //triggering the function
            downloadLink.click();
        }

        document.body.removeChild(downloadLink);
    }

    static export2Pdf(html = '') {
        const WindowPrt = window.open('', '', '');
        WindowPrt!.document.write(html);
        WindowPrt!.document.close();

        WindowPrt!.focus();
        WindowPrt!.print();
        WindowPrt!.close();
    }
}