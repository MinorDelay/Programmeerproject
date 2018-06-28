Naam: Simon Kemmere
Studentnummer: 10798250
Vak: Programmeerproject
Beschrijving: Verantwoording van gemaakte keuzes en het doorlopen van het proces.

## Beschrijving van project
Op basis van media artikelen over vissterfte en plastic in de oceaan heb ik gekozen
om de plastic productie van zoveel mogelijk landen te visualiseren. Dit heb ik gedaan
door een wereldkaart te tekenen en de landen waar ik data van heb op een kleurenschaal
in te kleuren, zodat in één oogopslag duidelijk kan worden welke landen veel plastic
produceren en welke landen veel minder. Vervolgens heb ik gezorgd dat er op landen geklikt
kan worden. Als dit is gebeurd, dan wordt een staafdiagram en een taartdiagram geupdate
met de data van dat corresponderende land. Vervolgens heb ik er voor gekozen om een extra
visualisatie toe te voegen, om ook de oplossingen van het probleem weer te geven en zo
een compleet beeld te geven van de huidige situatie. De oplossing van dit probleem
laat zich omschrijven als havens die plastic afval uit de oceanen vissen. Deze havens
zijn getekend op een wereldkaart, waarbij een grotere weergave van een haven correspondeert
met meer opgehaald plastic afval. Vervolgens is het met een dropdown knop mogelijk om van de
jaren 2014 tot en met 2016 de meewerkende havens te visualiseren.

[screenshot](https://github.com/MinorDelay/Programmeerproject/blob/master/Something_fishy/doc/screenshot1.png)

## Technisch design
### index.html
Wanneer de gebruiker alle bestanden gedownload heeft, is het verstandig om alleerst de
index.html te bekijken. Hierin wordt de opbouw van de site duidelijk. De index is opgebouwd
uit verschillende elementen. Allereerst komt men een navigatiebalk tegen die wanneer
iemand op een van de knoppen drukt, naar het corresponderende gedeelte van de site verwezen
zal worden. Vervolgens komt men een jumbotron container tegen die de header/banner van het
bestand bevat, met daarin de persoonlijke informatie. Vervolgens komt men gedeeltes tegen
waarin de huidige situatie uitgelegd wordt, ookwel de storyline. Daarna worden de
variabelen uitgelegd, alsmede de manier waarop deze variabelen gevisualiseerd zullen
worden. Vervolgens komt men uit bij het gedeelte van de visualisaties. Ieder element is
omschreven naar gelang het soort visualisatie.

Vervolgens is het verstandig om main.js te openen en te bekijken in welke volgorde en met
welke data de te laden functies opgeroepen worden. Daarna spreken alle functies en hun
functionaliteit redelijk voor zich. loadBar Laadt het staafdiagram in, loadPie laadt het
taartdiagram in.

### main.js
Main.js laadt eerst alle data volledig, voordat alle functies die nodig zijn om de
visualisaties te creëeren aan te roepen.

### map.js
In deze file wordt allereerst de wereldkaart gecreëerd door het gebruik van de functie
createMap. Deze is daarvoor aangeroepen in main.js. createMap Roept vervolgens 3 andere
functies aan die benodigd zijn om de visualisatie te vervolledigen. Het gaat hierbij
om de functie die de landen inkleurt (colorUpdate), de functie die ervoor zorgt
dat de gebruiker de kaart kan slepen en op de kaart kan inzoomen (moveMap), en als
laatste de functie die de legenda van de wereldkaart plot (Legend).
Binnen moveMap bestaan een aantal lokale functies die ervoor zorgen dat de kaart
het juiste gedrag vertoont. Het gaat hierbij om wat er moet gebeuren als de kaart
ingezoomd wordt, uitgezoomd wordt en als de kaart gesleept wordt.

Wanneer een user op een land klikt wordt de naam van dit land opgeslagen en meegegeven
aan de update functies van het staafdiagram en het taartdiagram. Daarover straks meer.

### bar.js
In deze file wordt allereerst de data geladen via de functie loadBar. Deze data wordt
vervolgens getekend in een staafdiagram. De getekende data staat in eerste instantie
altijd vast, totdat het staafdiagram geupdatet wordt via map.js. Dit brengt de gebruiker
dan ook naar de volgende functie, namelijk swapBarData.

In swapBarData, wordt de meegegeven naam van het land vergeleken met de dataset van de
te plotten variabele, namelijk het absolute aantal bedreigde vissen. Als de naam van het
land waarop geklikt is voorkomt in de dataset, wordt de data van dat desbetreffende land
geladen in het staafdiagram. Bestaat de naam van het land niet in de dataset, dan wordt
een leeg staafdiagram weergegeven.

### pie.js
In deze file wordt allereerst de data geladen via de functie createPie. Deze data
wordt vervolgens getekend in een taartdiagram. De getekende data staat in eerste instantie
altijd vast, totdat het taartdiagram geupdatet wordt via map.js. De volgende functie die
aangeroepen wordt in dit script is die van de legenda (pieLegend). In pieLegend wordt
de legenda voor het taartdiagram gemaakt. Ook de legenda wordt geupdatet als de gebruiker
op een land klikt. Net als bij swapBarData krijgt swapPieData de naam van een land mee.
De functie verwijdert het huidige taartdiagram, zodat er ruimte gemaakt kan worden voor
een nieuw taartdiagram. De meegegegeven naam van het land wordt vervolgens vergeleken
met de namen van landen in die dataset, om vervolgens een leeg taartdiagram met de
boodschap "No data available." weer te geven, of als er wel data aanwezig is het
desbetreffende taartdiagram te laten zien.

### harbours.js
In deze file wordt allereerst bepaald van welk jaar data geselecteerd moet worden.
Dat houdt in dat als de pagina voor het eerst geladen wordt er standaard voor gekozen
wordt om de data van het jaar 2014 weer te geven. Vervolgens wordt in deze functie
de functie aangeroepen die de wereldkaart tekent met daarop de havens waarvan data bekend
is (createHarbour). Binnen deze functie wordt een functie gecreëerd die ervoor zorgt
dat de grootte van de havens binnen een vast patroon vallen (harbourSize).
Deze functie wordt later ook meegegeven aan de volgende te bespreken functie namelijk
moveHarbour. Deze functie maakt het mogelijk voor de gebruiker dat de kaart het juiste
gedrag vertoont. Het gaat hierbij om wat er moet gebeuren als de kaart ingezoomd wordt,
uitgezoomd wordt en als de kaart gesleept wordt. De eerder meegegeven functie harbourSize
zorgt ervoor dat de grootte van de havens meeschaald wordt met de zoomfactor, zodat
de grootte en ligging van de havens steeds gedefinieerder wordt naarmate er verder
ingezoomd wordt.
De volgende functie die in createHarbour werd aangeroepen is harbourLegend, deze creëert
de legenda voor deze wereldkaart en toont wat de grootte van de havens representeren.
Vervolgens wordt de functie changeYear aangeroepen die ervoor zorgt dat de gebruiker
data van een ander jaar kan selecteren wanneer er gebruik is gemaakt van het dropdownmenu.
changeYear roept vervolgens createHarbour weer aan waardoor en de legenda geupdatet wordt,
maar ook de data in de wereldkaart zelf.

## Moeilijkheden en tegenslagen
Gedurende de afgelopen vier weken zijn er natuurlijk een aantal moeilijkheden en problemen
geweest. Dat begon in de eerste week met wat is een interessant onderwerp? Het antwoord
hierop liet een aantal dagen op zich wachten. Nadat het onderwerp duidelijk was, zorgde
de mate van onbekendheid van het onderwerp er wel voor dat het verzamelen van data vrij
ingewikkeld was. Het is namelijk een vrij recent probleem, waardoor er nog niet veel
data over beschikbaar is. Daarnaast zijn landen niet verplicht om deze data te publiceren
wat maakt dat veel landen dit ook niet doen.

Halverwege de eerste week had ik mijn data gevonden en kwam het voorbereiden van het
inladen van de data. Dit ging vrij soepel en hier ben ik dan ook niet echt tegen problemen
aangelopen.

Het inladen van de wereldkaart ging vrij soepel. Echter, tot in de laatste week ben ik
bezig geweest met het correct weergeven van de kleurenschaal in de kaart en de legenda.
Ook het inzoomen op de kaart heeft redelijk wat tijd gekost, omdat het vereist dat je
begrijpt hoe het opnieuw instellen van de projectie tot stand komt.

Het maken van het staafdiagram ging soepel, dit was dan ook een visualisatie die ik al
eerder gemaakt had.

Het taartdiagram leverde meer problemen op, omdat het een visualisatie was die ik nog
niet gemaakt had. Hier ben ik dan ook wel een volle dag mee bezig geweest, zoals
beschreven in PROGRESS.md. Het update van het staafdiagram en taartdiagram is vrij
soepel verlopen. Het is dan ook niet een echte updatefunctie, aan de andere kant wordt
niet het hele svg verwijdert, maar alleen de rects en arcs.

Het plotten van de havens en het meeschalen van de grootte van deze havens in de vierde
visualisatie heeft me wel vrij veel tijd gekost. Ook dit was iets wat ik nog niet eerder
gedaan had, maar ik wilde heel graag zoveel mogelijk kanten van het probleem laten zien
en daar hoort het oplossen, of in ieder geval een deel daarvan, ook bij.

Dit betekent wel dat hier zodanige tijd, naast de tijd die is gaan zitten in het maken
van de legenda's en dergelijken, dat ik niet toegekomen ben aan het tweede interactieve
HTML element.

Zoals eerder aangehaald vond ik het erg belangrijk om te zorgen dat ik alle kanten van het
probleem belichtte. Ieder wetenschappelijk artikel moet, naar mijn mening, ervoor zorgen
dat de lezer/gebruiker een zo concreet mogelijk beeld krijgt van de huidige situatie.
Als daarbij in de discussie dan besproken moet worden dat er enkele tekortkomingen zijn
aan het onderzoek, dan is dat zo, zeker bij een probleem waarvan de oplossingen nog in de
kinderschoenen staan. Daarnaast kan het inzoomen op de kaart wat mij betreft ook gezien
worden als interactief element. De data wordt namelijk opnieuw geschaald wanneer er in- en
uitgezoomd wordt.
