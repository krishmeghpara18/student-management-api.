const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'data', 'students.json');

const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => body += chunk.toString());
        req.on('end', () => {
            try { resolve(JSON.parse(body)); } 
            catch (err) { reject(err); }
        });
    });
};

const readData = () => {
    try {
        return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    } catch (e) { return []; }
};

const writeData = (data) => fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

const validateStudent = (student) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!student.name || !student.email || !student.course || !student.year) return "All fields are required";
    if (!emailRegex.test(student.email)) return "Invalid email format";
    if (student.year < 1 || student.year > 4) return "Year must be between 1 and 4";
    return null;
};

module.exports = { getPostData, readData, writeData, validateStudent };