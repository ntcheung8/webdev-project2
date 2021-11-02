const { response } = require('express');
const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const path = require('path');

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const connection = mysql.createConnection(credentials);

const service = express();

service.use(express.json());

connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

function rowToPlant(row) {
  return {
    id: row.id,
    nickname: row.nickname,
    type: row.type,
    description: row.description,
    height: row.height,
  };
}

service.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/index.html'));
});

service.get('/report.html', (request, response) => {
  response.sendFile(path.join(__dirname, '/report.html'));
});

service.get('/plants/:nick', (request, response) => {
  const parameters = [
    request.params.nick,
  ];

  const query = 'SELECT * FROM plant WHERE nickname = ? AND is_deleted = 0 ORDER BY height DESC';
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const plants = rows.map(rowToPlant);
      response.json({
        ok: true,
        results: rows.map(rowToPlant),
      });
    }
  });
});

service.post('/plants', (request, response) => {
  if (request.body.hasOwnProperty('nickname') &&
      request.body.hasOwnProperty('type') &&
      request.body.hasOwnProperty('description') &&
      request.body.hasOwnProperty('height')) {

    const parameters = [
      request.body.nickname,
      request.body.type,
      request.body.description,
      request.body.height,
    ];

    const query = 'INSERT INTO plant(nickname, type, description, height) VALUES (?, ?, ?, ?)';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
          results: result.insertId,
        });
      }
    });

  } else {
    response.status(400);
    response.json({
      ok: false,
      results: 'Incomplete memory.',
    });
  }
});

service.patch('/plants/:id', (request, response) => {
  const parameters = [
    request.body.nickname,
    request.body.type,
    request.body.description,
    request.body.height,
    parseInt(request.params.id),
  ];

  const query = 'UPDATE plant SET nickname = ?, type = ?, description = ?, height = ? WHERE id = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

service.delete('/plants/:id', (request, response) => {
  const parameters = [parseInt(request.params.id)];

  const query = 'UPDATE plant SET is_deleted = 1 WHERE id = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

const port = 5001;
service.listen(port, () => {
  console.log(`We're live in port ${port}!`);
});

