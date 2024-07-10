//Paciência e uma boa prova. Que a Força esteja com você!
import { v4 as uuidv4 } from 'uuid'; //Se não souber, não precisa usar.
import {createServer} from 'node:http'
import http from 'node:http'
import lerDadosPessoas from './lerDadosPessoas.js'
import fs from 'node:fs'

const PORT = 3333


const server = createServer(async (request, response)=>{
    const {method, url} = request

    fs.readFile('pessoas.json', 'utf8', (err, data)=>{
        if(err){
            response.writeHead(500, {'Content-Type': 'application/json'})
            response.end(JSON.stringify({message:'Erro ao buscar os dados'}))
            return;
        }

        let pessoas = []

        try{
            pessoas = JSON.parse(data)
        }catch(error){
            console.log('Erro ao ler o arquivo pessoas'+error)
        }

    if(method === 'POST' && url === '/pessoas'){
        // response.end(method) // só pra exibir o negócio certinho

        let body = ''
        request.on('data', (chunk)=>{
            body+= chunk
        })
        request.on('end', ()=>{
            if(!body){
                response.writeHead(400, {"Content-type": "application/json"})
                response.end(JSON.stringify({message:"Corpo da aplicação vazio"}))
                return
            }
            const novaPessoa = JSON.parse(body)
            lerDadosPessoas((err, pessoas) => {
                if(err){
                    response.writeHead(500, {"Content-type": "application/json"})
                    response.end(JSON.stringify({message:"Erro ao ler dados da pessoa"}))
                    return
                }
                novaPessoa.id = pessoas.length + 1
                pessoas.push(novaPessoa)
                fs.writeFile('pessoas.json', JSON.stringify(pessoas, null, 2), (err)=>{
                    if(err){
                        response.writeHead(500, {"Content-type": "application/json"})
                        response.end(JSON.stringify({message:"Erro ao cadastrar nova pessoa"}))
                        return
                    }
                })
                response.writeHead(201, {"Content-type": "application/json"})
                response.end(JSON.stringify(novaPessoa))
                return
            })
            response.end()
        })    
    }else if(method === 'POST' && url === '/pessoas/endereco/'){
        // response.end(method) // só pra exibir o negócio certinho

        const id = parseInt(url.split('/'[3]))

        let body = ''
        request.on('data', (chunk)=>{
            body += chunk
        })
        request.on('end', ()=>{
            if(!body){
                response.writeHead(400, {'Content-Type': 'application/json'})
                response.end(JSON.stringify({message: "Corpo da aplicação vazio"}))
                return
            }
            const novoEndereco = JSON.parse(body)

            lerDadosPessoas((err, pessoas)=>{
                if(err){
                    response.writeHead(500, {'Content-Type': 'application/json'})
                    response.end(JSON.stringify({message: "Erro ao ler dados das pessoas"}))
                    return
                }
                const indexPessoa = pessoa.findIndex((pessoa)=> pessoa.id == id)
                if(indexPessoa === -1){
                    response.writeHead(404, {'Content-Type': 'application/json'})
                    response.end(JSON.stringify({message: "Pessoa não encontrada"}))
                    return  
                }
                pessoas[indexPessoa] = {...pessoas[indexPessoa], ...novoEndereco}
                fs.writeFile('pessoas.json', JSON.stringify(pessoas, null, 2), (err)=>{
                    if(err){
                        response.writeHead(500, {'Content-Type': 'application/json'})
                        response.end(JSON.stringify({message: "Não é possível cadastra o endereço"}))
                        return
                    }
                    response.writeHead(200, {'Content-Type': 'application/json'})
                    response.end(JSON.stringify(pessoas[indexPessoa]))
                })
            })
        })

    }else if(method === 'POST' && url === '/pessoas/telefones/'){
        response.end(method) // só pra exibir o negócio certinho
    }else if(method === 'GET' && url.startsWith('/pessoas/')){
        // response.end(method) // só pra exibir o negócio certinho

        const pessoaId = url.split('/')[2]
        const pessoa = pessoas.find((pessoa) => pessoa.id == pessoaId)
        console.log(pessoa)

        const acharEmail = data.find((p)=>p.email = pessoa.email)
        if(acharEmail){
            response.writeHead(404, {"Content-type": "application/json"});
            response.end(JSON.stringify({ message: "Esse email já existe"}))
            return
        }
        if(pessoa){
            response.setHeader("Content-type", "application/json");
            response.end(JSON.stringify(pessoa))
        }else{
            response.writeHead(404, {"Content-type": "application/json"});
            response.end(JSON.stringify({ message: "Pessoa não encontrada"}))
        }
    }else if(method === 'PUT' && url === '/pessoas/endereco/'){
        // response.end(method) // só pra exibir o negócio certinho

        const id = parseInt(url.split('/')[2])
        let body = ''

        request.on('data', ()=>{
            body += chunk
        })
        request.on('end', ()=>{
            if(!body){
                response.writeHead(400, {"Content-type": "application/json"})
                response.end(JSON.stringify({message:"Corpo da aplicação vazio"}))
                return
            }

            lerDadosPessoas((err, pessoas) => {
                if(err){
                    response.writeHead(500, {"Content-type": "application/json"})
                    response.end(JSON.stringify({message:"Erro ao ler dados da pessoa"}))
                    return
                }

                const index = pessoas.findIndex(()=> pessoas.id === id)

                if(index !== -1){
                    response.writeHead(404, {'Content-Type': 'application/json'})
                    response.end(JSON.stringify({message: 'Receita não encontrada'}))
                    return
                }

                const enderecoAtualizado = JSON.parse(body)
                enderecoAtualizado.id = id
                pessoas[index] = enderecoAtualizado

                fs.writeFile('pessoas.json', JSON.stringify(pessoas, null, 2), (err)=>{
                    if(err){
                        response.writeHead(500, {'Content-Type': 'application/json'})
                        response.end(JSON.stringify({message: 'Não é possível atualizar o endereço'}))
                        return
                    }
                    response.writeHead(500, {'Content-Type': 'application/json'})
                    response.end(JSON.stringify(enderecoAtualizado))
                })
        })
    })
    }else if(method === 'DELETE' && url === '/pessoas/telefones/'){
        // response.end(method) // só pra exibir o negócio certinho

        const id = parseInt(url.split('/')[2])
        const numero = pessoas.find((pessoa) => pessoa.numero = numero)

        lerDadosPessoas((err, pessoas) => {
            if(err){
                response.writeHead(500, {"Content-type": "application/json"})
                response.end(JSON.stringify({message:"Erro ao ler dados da pessoa"}))
                return //serve para parar a execução
            }
            const indexPessoa = pessoas.findIndex((pessoa) => pessoa.id === id)
            if(indexPessoa === -1){
                response.writeHead(404, {"Content-type": "application/json"})
                response.end(JSON.stringify({message:"Pessoa não encontrada"}))
                return //serve para parar a execução
            }
            pessoas.splice(indexPessoa, 1)
            fs.writeFile("pessoas.json", JSON.stringify(pessoas, null, 2),(err)=>{
                if(err){
                response.writeHead(500, {"Content-type": "application/json"})
                response.end(JSON.stringify({message:"Erro ao deletar número no Banco de Dados"}))
                return //serve para parar a execução
                }
                response.writeHead(200, {'Content-Type': 'application/json'})
                response.end(JSON.stringify({message:"Número excluído!"})) 
            })
            console.log(pessoas)
        });

    }else if(method === 'GET' && url === '/pessoas'){
        // response.end(method) // só pra exibir o negócio certinho

        lerDadosPessoas((err, pessoas)=>{
            if(err){
            response.writeHead(500, {'Content-Type': 'application/json'})
            response.end(JSON.stringify({message: 'Erro ao ler os dados das pessoas'}))
            return   
        }
        response.writeHead(200, {'Content-Type': 'application/json'})
        response.end(JSON.stringify(pessoas))
        return
        })
    }else{
        response.writeHead(404, {'Content-Type': 'application/json'})
        response.end(JSON.stringify({message: 'Rota não encontrada'}))
    }


})

})

server.listen(PORT, ()=>{ 
    console.log(`Servidor on PORT: ${PORT} 😶‍🌫️`)
    }) 