// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';
// Doe een fetch naar de data die je nodig hebt
// const apiResponse = await fetch('...')

// Lees van de response van die fetch het JSON object in, waar we iets mee kunnen doen
// const apiResponseJSON = await apiResponse.json()

// Controleer eventueel de data in je console
// (Let op: dit is _niet_ de console van je browser, maar van NodeJS, in je terminal)
// console.log(apiResponseJSON)


// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express()); 

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')

app.get('/', async function (request, response) {
  const allPublications = await fetch('https://fdnd-agency.directus.app/items/dda_publications');
  const datedPublications = await fetch('https://fdnd-agency.directus.app/items/dda_publications/?sort=-date&limit=3');

  const datedPublicationsJSON = await datedPublications.json();
  const allPublicationsJSON = await allPublications.json();

  response.render('index.liquid', {
    publications: allPublicationsJSON.data,
    datedpublications: datedPublicationsJSON.data
  })

  response.render('publications.liquid', {
    publications: allPublicationsJSON.data,
  })
})



// ik wil een pagina per publicatie
app.get('/publication/:id', async function (request, response) {       
  const publicationz = request.params.id;                              
  const publicationFetch = await fetch(`https://fdnd-agency.directus.app/items/dda_publications/?fields=*.*&filter={"id":"${publicationz}"}&limit=1`)
  const publicationFetchJSON = await publicationFetch.json()
 
  response.render('publication.liquid', {publicationz: publicationFetchJSON.data?.[0] || [] })
})

app.get('/hello-world', async function (request, response) {
  response.send('hello world')
})

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})


// Maak een POST route voor de index; hiermee kun je bijvoorbeeld formulieren afvangen
// Hier doen we nu nog niets mee, maar je kunt er mee spelen als je wilt
app.post('/', async function (request, response) {
  // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
  // Er is nog geen afhandeling van een POST, dus stuur de bezoeker terug naar /
  response.redirect(303, '/')
})

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

