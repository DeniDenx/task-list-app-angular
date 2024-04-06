var express = require('express');
var app = express();
var fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

app.get('/tasks', function (req, res) {
    fs.readFile("db.json", 'utf-8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка чтения файла');
            return;
        }
        var jsonData = JSON.parse(data);
        var usersData = JSON.stringify(jsonData);
        res.end(usersData);
    });
});

app.put('/tasks', function (req, res) {
    const newTaskList = req.body;
    const jsonContent = JSON.stringify(newTaskList, null, 2);

    fs.writeFile('db.json', jsonContent, 'utf8', function (err) {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка записи в файл');
            return;
        }
        res.status(200).json({ message: 'Список задач успешно обновлен' });
    });
});

app.post('/tasks', function (req, res) {
    const newTask = req.body;
    fs.readFile('db.json', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка чтения файла');
            return;
        }
        const taskList = JSON.parse(data);
        newTask.id = taskList.length;
        taskList.push(newTask);
        const jsonContent = JSON.stringify(taskList, null, 2);
        fs.writeFile('db.json', jsonContent, 'utf8', function (err) {
            if (err) {
                console.error(err);
                res.status(500).send('Ошибка записи в файл');
                return;
            }
            res.status(200).json({ message: 'Список успешно создан' });
        });
    });
});

app.delete('/list', function (req, res) {
    const listId = parseInt(req.query.listId);
    const index = parseInt(req.query.index);

    fs.readFile('db.json', 'utf8', function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).send('Ошибка чтения файла');
            return;
        }

        let taskLists = JSON.parse(data);
        const listIndex = taskLists.findIndex(list => list.id === listId);
        if (listIndex === -1) {
            res.status(404).send('Список с указанным id не найден');
            return;
        }

        taskLists[listIndex].list.splice(index, 1);

        fs.writeFile('db.json', JSON.stringify(taskLists, null, 2), 'utf8', function (err) {
            if (err) {
                console.error(err);
                res.status(500).send('Ошибка записи в файл');
                return;
            }
            res.status(200).json({ message: 'Элемент успешно удален из списка' });
        });
    });
});

// app.delete('/list/:id', function(req, res) {
//     const id = parseInt(req.params.id); // Получаем id списка из параметров запроса

//     fs.readFile('db.json', 'utf8', function(err, data) {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Ошибка чтения файла');
//             return;
//         }

//         let taskLists = JSON.parse(data);
//         const index = taskLists.findIndex(list => list.id === id);
//         if (index === -1) {
//             res.status(404).send('Список с указанным id не найден')
//             return;
//         }

//         taskLists.splice(index, 1);

//         fs.writeFile('db.json', JSON.stringify(taskLists, null, 2), 'utf8', function(err) {
//             if (err) {
//                 console.error(err);
//                 res.status(500).send('Ошибка записи в файл');
//                 return;
//             }
//             res.status(200).json({ message: 'Список успешно удален' });
//         });
//     });
// });


app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
