const mongo = require("mongodb");

const client = new mongo.MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

function showAllTodos(todosCollection) {
    todosCollection.find({}).toArray((err, todos) => {
        if (err) {
            console.log('Błąd podczas pobierania', err)
        } else {
            const todosToDo = todos.filter(todo => !todo.done)
            const todosDone = todos.filter(todo => todo.done)

            console.log(`# Lista zadań do zrobienia (niezakończone): ${todosToDo.length}`)
            for (const todo of todosToDo) {
                console.log(`- [${todo._id}] ${todo.title}`)
            }

            console.log(`# Lista zadań do zrobienia (zakończone): ${todosDone.length}`)
            for (const todo of todosDone) {
                console.log(`- [${todo._id}] ${todo.title}`)
            }

        }
    })
    client.close();
}

function addNewToDo(todosCollection, title) {
    todosCollection.insertOne({
        title,
        done: false
    }, err => {
        if (err) {
            console.log('Błąd podczas dodawania', err)
        } else {
            console.log('Dodano zadanie')
        }
    })
    client.close();
}

function markTaskAsDone(todosCollection, id) {
    todosCollection.find({
        _id: mongo.ObjectID(id),
    }).toArray((err, todos) => {
        if (err) {
            console.log('Błąd podczas pobierania', err)
        } else if (todos.length !== 1) {
            console.log(`Nie ma takiego zadania`);
            client.close();
        } else if (todos[0].done === true) {
            console.log(`To zadanie było już zakończone`);
            client.close();
        } else {
            todosCollection.updateOne({
                _id: mongo.ObjectID(id),
            }, {
                $set: {
                    done: true,
                },
            }, err => {
                if (err) {
                    console.log('Błąd podczas ustawiania zakończenia', err)
                } else {
                    console.log('Zadanie oznaczone jako zakończone')
                }
                client.close();
            })
        }
    })
}

function deleteTask(todosCollection, id) {
    todosCollection.find({
        _id: mongo.ObjectID(id),
    }).toArray((err, todos) => {
        if (err) {
            console.log('Błąd podczas pobierania', err)
        } else if (todos.length !== 1) {
            console.log(`Nie ma takiego zadania`);
            client.close();
        } else {
            todosCollection.deleteOne({
                _id: mongo.ObjectID(id),
            }, err => {
                if (err) {
                    console.log('Błąd podczas usuwania zadania', err)
                } else {
                    console.log('Zadanie usunięte')
                }
                client.close();
            })
        }
    })
}

function deleteAllDoneTasks(todosCollection) {
    todosCollection.deleteMany({
        done: true,
    }, err => {
        if (err) {
            console.log('Błąd podczas usuwania zadania', err)
        } else {
            console.log('Wyczyszczone zakończone zadania o ile takie były')
        }
        client.close();
    })
}

function doTheToDo(todosCollection) {
    const [command, ...args] = process.argv.splice(2)

    switch (command) {
        case 'add': {
            addNewToDo(todosCollection, args[0]);
            break;
        }
        case 'list': {
            showAllTodos(todosCollection)
            break;
        }
        case 'done': {
            markTaskAsDone(todosCollection, args[0])
            break;
        }
        case 'delete': {
            deleteTask(todosCollection, args[0])
            break;
        }
        case 'cleanup': {
            deleteAllDoneTasks(todosCollection)
            break;
        }
        default: {
            console.log(`
            ### List TODO - Mondo DB z Samurajem Programowania
            
            Dostępne komendy:

            add <nazwa zadania> - dodaje nowe zadanie
            list - wyswietla liste zadań
            done <id zdania>  - oznacz wybrane zadanie jako zakończone
            delete <id zdania> - usuń wybrane zadanie
            cleanup - usuń zakończone zadania jeśli istnieją
            `)
            client.close();
            break;
        }
    }

    client.close();
}

client.connect(err => {
    if (err) {
        console.log('Bład połączenia:', err)
    } else {
        console.log('Połączenie z bazą');
        const db = client.db('test');
        const todosCollection = db.collection('todos');
        doTheToDo(todosCollection);
    }
});