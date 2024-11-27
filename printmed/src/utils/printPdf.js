export const printPdf = (url) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = () => {
        iframe.contentWindow.print();
    };

    iframe.onafterprint = () => {
        document.body.removeChild(iframe);
    }
};