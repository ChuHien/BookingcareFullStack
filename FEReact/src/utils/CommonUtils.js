class CommonUtils {
    static isNumber1 (number) {
        if (number === 1) return true;
        return false;
    }
    static getBase64(file) {
        return new Promise((resovle, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resovle(reader.result);
            reader.onerror = error => reject(error);
        });
    }
}

export default CommonUtils;
