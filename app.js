class Assignment {
    //oh my god! its a class declaration! CRAZY!

    //ThIs Is A cOnStRuCtOr
    constructor (course, assignmentName, type, dueMonth, dueDay, dueYear, dueHour, dueMin, pm, color, completed = false) {
        this.course = course;
        this.name = assignmentName;
        this.type = type;
        this.pm = pm;
        this.dueDate = new Date(dueYear, dueMonth - 1, dueDay, dueHour, dueMin);
        this.color = color;
        this.completed = completed;
    }

    //and whats this? a mutator method? no way!
    complete() {
        this.completed = true;
    }

    //2 MUTATOR METHODS?? WHAT THE FUCK?
    incomplete() {
        this.completed = false;
    }

    //no. it cant be. 3????
    updateFullDueDate(newMonth, newDay, newYear, newHour, newMin, newPm) {
        if (newPm) {
            newHour += 12;
        }
        this.dueDate = new Date(newYear, newMonth - 1, newDay, newHour, newMin);
    }

    //im gonna lose it, thats four!
    updateDueDate(newMonth, newDay) {
        this.dueDate.setMonth(newMonth - 1);
        this.dueDate.setDate(newDay);
    }

    //stop. please. my brain. 5 mutator methods is too much
    updateDueTime(newHour, newMin, newPm) {
        if (newPm) {
            newHour += 12;
        }
        this.dueDate.setHours(newHour);
        this.dueDate.setMinutes(newMin);
    }

    //why 6? cause why not
    changeColor(newColor) {
        this.color = newColor;
    }

    //glorified toString but for just one fucking instance varible lmao I HATE DATES
    date(expanded = false) {
        var stringDate = '';
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let currHour;
        let currAmPm;
        if (this.dueDate.getHours() == 0) {
            currHour = 12;
            currAmPm = 'AM';
        } else if (this.dueDate.getHours() < 12) {
            currHour = this.dueDate.getHours();
            currAmPm = 'AM';
        } else if (this.dueDate.getHours() == 12) {
            currHour = 12;
            currAmPm = 'PM';
        } else if (this.dueDate.getHours() > 12) {
            currHour = this.dueDate.getHours() - 12;
            currAmPm = 'PM';
        }
        if (expanded) {
            stringDate += days[this.dueDate.getDay()];
            stringDate += ', ';
            stringDate += months[this.dueDate.getMonth()];
            stringDate += ' ';
            stringDate += this.dueDate.getDate();
            stringDate += ', ';
            stringDate += this.dueDate.getFullYear();
            stringDate += ' at ';
            stringDate += currHour;
            stringDate += ':';
            stringDate += this.dueDate.getMinutes();
            stringDate += ' ';
            stringDate += currAmPm;
        } else {
            stringDate += (this.dueDate.getMonth() + 1);
            stringDate += '/';
            stringDate += this.dueDate.getDate();
            stringDate += '/';
            stringDate += this.dueDate.getFullYear();
            stringDate += ' @ ';
            stringDate += currHour;
            stringDate += ':';
            stringDate += this.dueDate.getMinutes();
            stringDate += ' ';
            stringDate += currAmPm;
        }

        return stringDate;
    }
}

//another class in the format and order of the list.pug page cause it makes life easy and im bored of formatting date and time strings
class Row {
    //this is a constructor. if you need this comment in braille, please go fuck yourself.
    constructor (id, course, type, name, date, time, completed) {
        this.id = id;
        this.course = course;
        this.type = type;
        this.name = name;
        this.date = `${String(date).substring(5, 7)}/${String(date).substring(8, 10)}/${String(date).substring(2, 4)}`;
        this.time = String(time).substring(0, 5);
        if (completed === true || completed > 0) {
            this.color = 'green';
        } else {
            this.color = 'red';
        }
    }
}

//package imports/setups:
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql');

//defines the connection to the database and tells the program what database were working with from the mysql server on this computer
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', //super secret password
    database: 'assignments'
});
connection.connect(function(err) { //connects node to the database itself
    if (err) throw err;
    console.log('connected');
});

//i dont actually know what this does in a literal sense, but it makes request.body work when getting user inputs from pug
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(request, response) { //when user goes to main page:
    response.render('index.pug'); //render the index page
});

app.get('/view', function(request, response) {
    connection.query("SELECT * FROM list", function (err, result, fields) { //selects everything from the database and stores the results in result, and the schema data in fields
        if (err) throw err; //checks for errs
        console.log(result); //debug step: prints the raw data from db
        //result is now basically an array of data objects that we can pipe to pug with result[1].ID for example to get the second items id
        var tableData = ``;
        let rowsArr = [];
        for (let i = 0; i < result.length; i++) {
            const currRow = new Row(result[i].ID, result[i].Course, result[i].Type, result[i].Name, result[i].Date, result[i].Time, result[i].Completed);
            rowsArr.push(currRow);
        }
        for (let i = 0; i < rowsArr.length; i++) {
            tableData += `<tr><td>${rowsArr[i].course}</td><td>${rowsArr[i].type}</td><td>${rowsArr[i].name}</td><td>${rowsArr[i].date}</td><td>${rowsArr[i].time}</td><td style='background-color: ${rowsArr[i].color}'></td></tr>`;
        }
        console.log(tableData);
        response.render('list.pug', {
            tdata: tableData
        });
    });
});

app.get('/create', function(request, response) {
    response.render('create.pug');
});

app.post('/new', function(req, res) {

    //when node gets a post request of type new from pug, creates a new Assignment object and stores all of the users data
    const newAssignment = new Assignment(
        req.body.course, 
        req.body.assignment, 
        req.body.type, 
        req.body.dueDate.substring(5, 7), 
        req.body.dueDate.substring(8), 
        req.body.dueDate.substring(0, 4), 
        req.body.dueTime.substring(0, 2), 
        req.body.dueTime.substring(3), 
        req.body.dueTime.substring(0, 2) > 11, 
        req.body.color
    );

    //temp var for checking if the assignment is marked as completed or not
    let com = 0;
    if (newAssignment.completed) {
        com = 1;
    }

    //super long sql code that basically just formats some stuff and tells mysql what to insert where in the table
    var sql = `INSERT INTO list (Course, Type, Name, Date, Time, Completed) VALUES ('${newAssignment.course}', '${newAssignment.type}', '${newAssignment.name}', '${newAssignment.dueDate.getFullYear()}-${newAssignment.dueDate.getMonth() + 1}-${newAssignment.dueDate.getDate()}', '${newAssignment.dueDate.getHours()}:${newAssignment.dueDate.getMinutes()}:00', ${com})`;

    //the actual request to the mysql server with the above sql code
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log('new assignment added');
        console.log(result);
    });
});

//this basically just turns the node program on thru express
//like it makes it actually like network (<- thats a verb now ig)
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});