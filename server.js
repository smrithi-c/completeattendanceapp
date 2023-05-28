const express = require('express')
const { FieldValue } = require('firebase-admin/firestore')
const app = express()
const port = 8383
const { db } = require('./firebase.js')
const path = require('path');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));



app.get('/getroster', async (req, res) => {
    const date  = req.query.date
    const peopleRef = db.collection('attendance').doc(date)
    const doc = await peopleRef.get()
  
    if (!doc.exists) {
      return res.sendStatus(400)
    }
  
    const data = doc.data()
    
  
    res.status(200).send(data)
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





  app.get('/roster', (req, res) => {
    res.sendFile(path.join(__dirname, 'roster.html'));
  });



app.listen(port, () => console.log(`Server has started on port: ${port}`))