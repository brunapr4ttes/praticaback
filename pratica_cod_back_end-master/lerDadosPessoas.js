import fs from 'node:fs'

const lerDadosPessoas = (callback) => { //esse parâmetro callback vai se transformar em uma função
    fs.readFile('pessoas.json', 'utf8', (err, data)=>{
        if(err){
            callback(err)
        }
        try{
            const pessoas = JSON.parse(data)
            callback(null, pessoas)
        }catch(error){
            callback(error);
        }
    })
}

export default lerDadosPessoas;