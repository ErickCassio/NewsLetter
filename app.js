const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

//Para que o servidor tenha acesso a arquivos estáticos como CSS
app.use(express.static(__dirname + '/'));
app.use(express.urlencoded({extended: true}));

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req,res) => {
    //Recebe os dados do usuário via POST
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/aa1147f101/"
    //Prepara o POST que será feito na API do MailChimp
    const options = {
        method: "POST",
        auth: "erick:f4a0d9a104ac43565770af36545d54b8-us21" //Método de autenticação da API do MAILCHIMP
    }
    
    //Guardaremos esse request numa const para podermos usá-la posteriormente
    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            
            /*response.on("data", (data) => {
                console.log(JSON.parse(data));
                // envie uma mensagem de sucesso para o usuário
                res.sendFile(__dirname + "/sucess.html");
            })*/
            // a requisição foi bem-sucedida
            response.on("data", function(data) {
                const receivedData = JSON.parse(data);
                //Verifica se não tem erros vindo do servidor
                if (receivedData.error_count != 0) {
                    res.sendFile(__dirname + "/fail.html");
                } else {
                    res.sendFile(__dirname + "/success.html");
                }
            
                console.log(response.statusCode);
            })
        } else {
            // a requisição falhou
            // envie uma mensagem de erro para o usuário
            res.sendFile(__dirname + "/fail.html");
        }
        
    });
    
    request.write(jsonData);
    request.end();
    console.log(fName, lName, email);
})

app.post("/fail", (req,res) => {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
})

//API_KEY
//f4a0d9a104ac43565770af36545d54b8-us21

//List ID
//aa1147f101