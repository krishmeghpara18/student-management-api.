const http = require('http');
const { getPostData, readData, writeData, validateStudent } = require('./utils');

const server = http.createServer(async (req, res) => {
    const { method, url } = req;
    res.setHeader('Content-Type', 'application/json');

    if (url === '/students' && method === 'GET') {
        res.writeHead(200);
        return res.end(JSON.stringify(readData()));
    }

    if (url === '/students' && method === 'POST') {
        try {
            const body = await getPostData(req);
            const error = validateStudent(body);
            if (error) {
                res.writeHead(400);
                return res.end(JSON.stringify({ success: false, message: error }));
            }
            const students = readData();
            const newStudent = { id: Date.now().toString(), ...body };
            students.push(newStudent);
            writeData(students);
            res.writeHead(201);
            return res.end(JSON.stringify(newStudent));
        } catch (e) {
            res.writeHead(400);
            return res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
        }
    }

    if (url.startsWith('/students/') && url.split('/').length === 3) {
        const id = url.split('/')[2];
        let students = readData();
        const index = students.findIndex(s => s.id === id);

        if (index === -1) {
            res.writeHead(404);
            return res.end(JSON.stringify({ success: false, message: "Student not found" }));
        }

        if (method === 'PUT') {
            const body = await getPostData(req);
            students[index] = { ...students[index], ...body };
            writeData(students);
            res.writeHead(200);
            return res.end(JSON.stringify(students[index]));
        }

        if (method === 'DELETE') {
            students.splice(index, 1);
            writeData(students);
            res.writeHead(200);
            return res.end(JSON.stringify({ success: true, message: "Deleted" }));
        }
    }

    res.writeHead(404);
    res.end(JSON.stringify({ success: false, message: "Route not found" }));
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));