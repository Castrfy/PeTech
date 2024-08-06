const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const cors = require('cors');
const app = express();
const PORT = 3000;

console.log("sa");
app.get('/', (req, res) => {
    res.send('Merhaba, Express!');
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const USERS_FILE = 'users.json';



const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Kullan�c�lar� dosyadan oku
const readUsersFromFile = () => {
    if (!fs.existsSync(USERS_FILE)) {
        console.log('Users file does not exist. Creating a new one.');
        return [];
    }
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
};

// Kullan�c�lar� dosyaya yaz
const writeUsersToFile = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log('Users file updated successfully.');
    } catch (error) {
        console.error('Error writing to users file:', error);
    }
};

// Kay�t olma endpoint'i
app.post('/register', async (req, res) => {
    const { username, mail, password } = req.body;
    const users = readUsersFromFile();

    if (users.find(user => user.username === username)) {
        return res.status(400).send('Kullan�c� ad� zaten mevcut.');
    }
    if (users.find(user => user.mail === mail)) {
        return res.status(400).send('E-posta zaten mevcut.');
    }

    try {
        const hashedPassword = hashPassword(password);

        users.push({ username, mail: mail, password: hashedPassword });
        writeUsersToFile(users);
        res.send('Kay�t ba�ar�l�.');
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Sunucu hatas�. Kay�t yap�lamad�.');
    }
});

// Giri� yapma endpoint'i
app.post('/login', async (req, res) => {
    const { mail, password } = req.body;
    const users = readUsersFromFile();

    const user = users.find(user => user.mail === mail);
    if (!user) {
        return res.status(400).send('Ge�ersiz kullan�c� ad� veya �ifre.');
    }

    //const isPasswordValid = bcrypt.compare(password, user.password);
    const hashedPassword = hashPassword(password);
    if (hashedPassword == user.password) {
        res.send('Giri� ba�ar�l�.');
    } else {
        res.status(400).send('Ge�ersiz kullan�c� ad� veya �ifre.');
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde �al���yor.`);
});
