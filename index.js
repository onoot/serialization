function serialize(numbers) {
    let result = '';
    for (const num of numbers) {
        let value = num;
        while (true) {
            let byte = value & 0x7F;
            value >>>= 7;
            if (value === 0) {
                result += String.fromCharCode(byte);
                break;
            } else {
                byte |= 0x80;
                result += String.fromCharCode(byte);
            }
        }
    }
    return result;
}

function deserialize(serialized) {
    const numbers = [];
    let num = 0;
    let shift = 0;
    for (const char of serialized) {
        const byte = char.charCodeAt(0);
        num |= (byte & 0x7F) << shift;
        if ((byte & 0x80) === 0) {
            numbers.push(num);
            num = 0;
            shift = 0;
        } else {
            shift += 7;
        }
    }
    return numbers;
}

function compressionRatio(original, compressed) {
    return (original.length - compressed.length) / original.length;
}

const tests = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 
    Array.from({ length: 50 }, () => Math.floor(Math.random() * 300) + 1), 
    Array.from({ length: 100 }, () => Math.floor(Math.random() * 300) + 1),
    Array.from({ length: 500 }, () => Math.floor(Math.random() * 300) + 1),
    Array.from({ length: 1000 }, () => Math.floor(Math.random() * 300) + 1), 
    Array.from({ length: 1000 }, () => Math.floor(Math.random() * 9) + 1), 
    Array.from({ length: 1000 }, () => Math.floor(Math.random() * 90) + 10), 
    Array.from({ length: 1000 }, () => Math.floor(Math.random() * 900) + 100), 
    Array.from({ length: 300 }, (_, index) => index + 1).flatMap(num => [num, num, num]) 
];

tests.forEach(numbers => {
    const originalString = JSON.stringify(numbers);
    const compressedString = serialize(numbers);
    const decompressedNumbers = deserialize(compressedString);
    const ratio = compressionRatio(originalString, compressedString);
    console.log("Оригинал:", originalString.length, "байт");
    console.log("Сериализация:", compressedString.length, "байт");
    console.log("Эффективность:", ratio * 100, "%");
    console.log("Десериализация:", JSON.stringify(numbers) === JSON.stringify(decompressedNumbers));
    console.log("------------------------");
});