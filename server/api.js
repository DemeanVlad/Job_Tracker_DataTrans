const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const dataFilePath = path.join(__dirname, 'applications.json');

app.use(express.json());
app.use(require('cors')());
app.use(express.static(path.join(__dirname, '..', 'client')));

app.get('/api/applications', (req, res) => {
  fs.readFile(dataFilePath, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading data' });
    }
    const applications = JSON.parse(data);
    res.json(applications);
  });
});

app.post('/api/applications', (req, res) => {
  fs.readFile(dataFilePath, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading data' });
    }
    const applications = JSON.parse(data);
    const newApplication = { id: Date.now(), ...req.body };
    applications.push(newApplication);
    fs.writeFile(dataFilePath, JSON.stringify(applications), err => {
      if (err) {
        return res.status(500).json({ message: 'Error saving data' });
      }
      res.status(201).json(newApplication);
    });
  });
});

app.put('/api/applications/:id', (req, res) => {
  fs.readFile(dataFilePath, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading data' });
    }
    let applications = JSON.parse(data);
    applications = applications.map(app =>
      app.id === parseInt(req.params.id, 10) ? { ...app, ...req.body } : app
    );
    fs.writeFile(dataFilePath, JSON.stringify(applications), err => {
      if (err) {
        return res.status(500).json({ message: 'Error saving data' });
      }
      res.status(200).json(req.body);
    });
  });
});

app.delete('/api/applications/:id', (req, res) => {
  fs.readFile(dataFilePath, (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading data' });
    }
    let applications = JSON.parse(data);
    applications = applications.filter(app => app.id !== parseInt(req.params.id, 10));
    fs.writeFile(dataFilePath, JSON.stringify(applications), err => {
      if (err) {
        return res.status(500).json({ message: 'Error saving data' });
      }
      res.status(204).end();
    });
  });
});

module.exports = app;
