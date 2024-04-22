const express = require('express');
const router = express.Router();
const { createEpic } = require('../controllers/epicController');

const { createIssue, getIssues } = require('../controllers/issueController');
const { readExcel } = require('../controllers/readExcel');


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

router.post('/createAll',async (req,res) =>{
  let dataParsedExcel = await readExcel('Hoja 1')
  let issues = await getIssues()

  let epicIssues = issues.filter(issue => issue.fields.issuetype.name === "Epic")
  

  epicIssues.forEach(epic => {
    // Filtrar los issues que pertenecen a esta épica
    let childIssues = dataParsedExcel.filter(issue => issue.FASE === epic.fields.summary);
    // Añadir el campo "childs" a la épica actual
console.log(childIssues);
    epic.childs = epic.childs || [];
    epic.childs.push(...childIssues);
});

  res.json(epicIssues)
})

router.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

module.exports = router;
