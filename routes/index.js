import * as dotenv from 'dotenv'

import express from 'express'
import { fetchJson } from '../helpers/fetchWrapper.js'

dotenv.config()

const index = express.Router()

// Maak een route voor de index pagina
app.get('/', (request, response) => {
    const booksUrl = url + urlSearch + urlDefault + urlKey + urlOutput;
    
  fetchJson(booksUrl).then((data) => {
    response.render('index', data)
    // console.log(data);
  })
  
})

export default index