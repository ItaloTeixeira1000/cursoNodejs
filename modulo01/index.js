const express = require('express');

const server = express();

server.use(express.json());

//Query params = ?nome=NodeJs
//Route Params = /curso/2
//Request Body = { nome: 'NodeJs', tipo: 'Backend' }

const cursos = ['NodeJs', 'JavaScript', 'React Native'];

//Middleware Global
server.use((req,res, next)=>{
    console.log(`URL chamada: ${req.url}`); 
    
    return next();
});

function checkCurso(req, res, next){
    if(!req.body.name){
        return res.status(400).json({error: "Nome do curso é obrigatório"});
    }

    return next();
}

function checkIndexCurso(req, res, next){
    const curso = cursos[req.params.index];
    if(!curso){
        return res.status(400).json({error: "O curso não existe"});
    }

    req.curso = curso;

    return next();
}

server.get('/cursos', (req, res) =>{
    return res.json(cursos);
})

server.get('/cursos/:index', checkIndexCurso, (req, res) => {
    //const nome = req.query.nome; --Query params

    return res.json(req.curso);
});

server.post('/cursos',checkCurso, (req, res) =>{
    const {name} = req.body;
    cursos.push(name);

    return res.json(cursos);
});

server.put('/cursos/:index',checkCurso, checkIndexCurso, (req, res) => {
    const {index} = req.params;
    const {name} = req.body;

    cursos[index] = name;

    return res.json(cursos);
});

server.delete('/cursos/:index',checkIndexCurso, (req,res) => {
    const {index} = req.params;

    cursos.splice(index, 1);

    return res.json({message: "Curso deletado com sucesso"});
});

server.listen(3000);