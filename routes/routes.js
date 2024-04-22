const express = require('express');
const router = express.Router();
const { createEpic } = require('../controllers/epicController');

const { createIssue, getIssues } = require('../controllers/issueController');
const { readExcel } = require('../controllers/readExcel');

router.get('/issues',async (req,res)=>{
  try{
    let issues = await getIssues()
    console.log(issues)
  }catch(err){
    console.log(err)
  }
})

const { createIssues } = require('../controllers/issueController');


// Ruta para crear una nueva epic
router.post('/epics', async (req, res, next) => {
  try {
    const { summary, description } = req.body;
    const epic = await createEpic(summary, description);
    res.status(201).json(epic);
  } catch (error) {
    next(error); 
  }
});

// Ruta para crear una nueva issue
router.post('/issues', async (req, res, next) => {
  try {
    const issues = req.body; 
    const createdIssues = await createIssues(issues); 
    res.status(201).json(createdIssues);
  } catch (error) {
    next(error); 
  }
});
//ruta para getIssues
router.get('/issues', async (req, res, next) => {
  try {
    const issues = await getIssues();
    res.status(200).json(issues);
  } catch (error) {
    next(error);
  }
});


//Ruta para subir archivos:
router.post('/upload',async (req,res) => {
  try{
    if(!req.files){
      res.status(400).json({
        message:"Seleccione un archivo"
      })
    }else{
      let file = req.files.datos
      file.mv("./uploads/" + file.name)
      
      let dataParsedExcel = await readExcel('Hoja 1')
      console.log(dataParsedExcel)
      res.status(200).json({
        message:"Archivo subido con exito",
        data: {
         name: file.name,
         size: file.size,
         type: file.mimetype
        }
      })
    }
  }catch(err){
    console.log(err)
    res.status(500).json({
      err
    })
  }
})

router.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

module.exports = router;
