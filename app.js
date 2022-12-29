class Assignment {
    constructor (course, assignmentName, type, dueMonth, dueDay, dueYear, dueHour, dueMin, pm, color, completed = false) {
        this.course = course;
        this.name = assignmentName;
        this.type = type;
        this.pm = pm;
        this.dueDate = new Date(dueYear, dueMonth - 1, dueDay, dueHour, dueMin);
        this.color = color;
        this.completed = completed;
        this.test = false;
    }

    complete() {
        this.completed = true;
    }

    incomplete() {
        this.completed = false;
    }

    updateFullDueDate(newMonth, newDay, newYear, newHour, newMin, newPm) {
        if (newPm) {
            newHour += 12;
        }
        this.dueDate = new Date(newYear, newMonth - 1, newDay, newHour, newMin);
    }

    updateDueDate(newMonth, newDay) {
        this.dueDate.setMonth(newMonth - 1);
        this.dueDate.setDate(newDay);
    }

    updateDueTime(newHour, newMin, newPm) {
        if (newPm) {
            newHour += 12;
        }
        this.dueDate.setHours(newHour);
        this.dueDate.setMinutes(newMin);
    }

    changeColor(newColor) {
        this.color = newColor;
    }

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

const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql');
var con;
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(request, response) {
    response.render('index.pug');
});

app.get('/view', function(request, response) {
    response.render('list.pug');
});

app.get('/create', function(request, response) {
    response.render('create.pug');
});

app.post('/new', function(req, res) {
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
    
    
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});