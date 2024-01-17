module.exports = (length, options = []) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const signs = '!@#$%^&*()|?~[]{}<>+-/';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()|?~[]{}<>+-/';

    if (options.length > 0) {
        chars = '';
        options.forEach(option => {
            if (option === 'letters') {
                chars += letters;
            }
            if (option === 'numbers') {
                chars += numbers;
            }
            if (option === 'signs') {
                chars += signs;
            }
        });
    }

    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}