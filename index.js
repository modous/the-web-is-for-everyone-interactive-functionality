import express from 'express'

const url = "https://zoeken.oba.nl/api/v1/search/";
const urlSearch = "?q=";
const urlDefault = "boek";
const urlKey ="&authorization=1e19898c87464e239192c8bfe422f280";
const urlOutput = "&refine=true&output=json";

// Maak een nieuwe express app
const app = express()

// Stel in hoe we express gebruiken
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))   

// Stel de afhandeling van formulieren in
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Maak een route voor de index pagina
app.get('/', (request, response) => {
    const booksUrl = url + urlSearch + urlDefault + urlKey + urlOutput;
    
  fetchJson(booksUrl).then((data) => {
    response.render('index', data)
    // console.log(data);
  })
  
})

app.get('error', (request, response) => {
  const booksUrl = url + urlSearch + urlDefault + urlKey + urlOutput;

  response.render('error', data)
 

})

// Maak een route voor de detail pagina
app.get("/detail", async (request, response) => {
    let id = request.query.id; 
    const uniqueUrl = url + "?id=" + id + urlKey + urlOutput;
    
      const data = await fetch(uniqueUrl)
          .then((response) => response.json())
          .catch((err) => err);
      response.render("detail", data);  
  
  });

 // Maakt een route voor de reserveringspagina
app.get('/reserveer', (request, response) => {
  const baseurl = "https://api.oba.fdnd.nl/api/v1";
	const url = `${baseurl}/reserveringen`;

	fetchJson(url).then((data) => {
		response.render("reserveer", data);
	});
})

//Hiermee reserveer ik en stuur ik data naar de API
app.post('/reserveer', (request, response) => {
  //De gestuurde data gaat naar de volgende URL:
  const postUrl = 'https://api.oba.fdnd.nl/api/v1/'
  const url = `${postUrl}reserveringen`

  postJson(url, request.body).then((data) => {
    let newReservering = { ... request.body }

    //In de data zit een data.id Hiermee check ik of er een ID aanwezig is voor een boek dat nog niet geresereerd is.
    if (data.data.id) {
      console.log("bliep");
      response.redirect('/') 
    } else {
      //Als het boek al gereserveerd is dan heeft data.data.id geen id meer en krijg je dus een error message.
      console.log("errorrrs")
        const errormessage = `${data.message}: Mogelijk komt dit door het id die al bestaat.`;
        const newData = {
          error: errormessage,
          values: newReservering,
        };
        //hiermee stuur ik de gebruiker daar de error pagina.
        response.render("error", newData);
      }
      console.log(JSON.stringify(data.id));
  })
})




// Stel het poortnummer in en start express
app.set('port', process.env.PORT || 8000)
app.listen(app.get('port'), function () {
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error)
}
export async function postJson(url, body) {
  return await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .catch((error) => error)
}

