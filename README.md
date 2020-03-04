﻿# mongodbTODO
 
 ### Stack
- mongoDB
- NodeJS

## Launch

Before starting, replace the path to the mongo instance with yours.

line 3 in index.js

```javascript
const client = new mongo.MongoClient('YOUR_MONGO_INSTANCE', { useNewUrlParser: true, useUnifiedTopology: true });
```

```javascript
node index.js command
```
example

```javascript
node index.js add "write a readme"
```

### Comands
Commands available

          -  add <task name> - adds a new task
          -  letter - will send out a task list
          -  done <task id> - mark the selected task as completed
          -  delete <task id> - delete the selected task
          -  cleanup - delete completed tasks if any
