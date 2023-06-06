const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383
const { db } = require('./firebase.js')
const path = require('path');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));



app.get('/getroster', async (req, res) => {
    const students = []
    const date  = req.query.date
    const status  = req.query.status
    const peopleRef = db.collection('attendance').doc(date)
    const doc = await peopleRef.get()
    
  
    if (!doc.exists) {
      return res.sendStatus(400)
    }
  
    const data = doc.data()
    
    for (let k in data) {
      
      if(data[k]["status"] == status){
        students.push(k)
      }

 

     
  }
  
    res.status(200).send(students)
  });


 



  app.post('/addstudent', async (req, res) => {
    const name = req.body.name
    const date = req.body.date 
    const status = req.body.status
    const dateRef = db.collection('attendance').doc(date)
    const res2 = await dateRef.set({
        [name] : {
        "status":status
        }

    }, { merge: true })
    // friends[name] = status
    res.status(200).send("successfully added")
})

app.get('/getstudent', async (req, res) => {
    
    const name = req.query.name
    var dict = {};
    const datesRef = db.collection('attendance');
  const snapshot = await datesRef.orderBy(name).get();
  if (snapshot.empty) {
    res.status(200).send("We could not find " + name + " in our database")
    return;
  }

snapshot.forEach(doc => {
  var date = doc.id 
  const data = doc.data()
  dict[date] = data[name]["status"]
});
  
res.status(200).send(dict)
    
  });

  app.get('/data', (req, res) => {
    db.collection("attendance")
      .get()
      .then(function(querySnapshot) {
        var data = [];
        querySnapshot.forEach(function(doc) {
          data.push([doc.id,doc.data()]);
        });
        res.send(data);
      })
      .catch(function(error) {
        console.log('Error getting Firestore data: ', error);
        res.status(500).send('Error retrieving Firestore data');
      });
  });
  




  app.get('/roster', (req, res) => {
    res.sendFile(path.join(__dirname, 'roster.html'));
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, 'student.html'));
  });

  app.get('/attendance', (req, res) => {
    res.sendFile(path.join(__dirname, 'attendance.html'));
  });

  app.get('/entries', (req, res) => {
    res.sendFile(path.join(__dirname, 'entries.html'));
  });




app.listen(port, () => console.log(`Server has started on port: ${port}`))