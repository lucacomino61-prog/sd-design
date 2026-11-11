// The guides: longer answers to what owners look for before they pay for a website. Albanian first; the English
// and the Italian say the same, sentence for sentence. The rules of the rest of the site hold here too:
//   - no prices: the price of a site is given on WhatsApp, after the draft;
//   - what is said about a client is what the work list already says (src/i18n/*.js, `projects`);
//   - the offer is the one agreed on 10 Nov 2026 (free working draft, 24 hours on working days, a deposit to go on).
// A section is { h, p?, list?, levels?, after?, links? }:
//   p, after   paragraphs before and after the list
//   list       pairs [title, text], or plain lines
//   levels     true shows the three levels with their examples, from the dictionary
//   links      { to, text?, needs? }: `to` is a page of src/data/site.js (optionally with #place); a link whose page
//              is switched off, or whose feature (`needs`) is, is left out
// `glyph` is drawn in dots behind the headline. `blurb` is the line in the list of guides.
const sq = {
  nav: 'Udhëzues',
  index: {
    title: 'Udhëzues për pronarët e bizneseve në Shqipëri · SD Design',
    desc: 'Udhëzues të shkurtër dhe të qartë për pronarët: sa kushton një faqe interneti, Instagram apo faqe, dhe rezervime e porosi pa komision.',
    h1: 'Përgjigje të qarta, para se të paguani.',
    lead: 'Udhëzues të shkurtër për pronarët e bizneseve në Shqipëri. Pa terma teknikë dhe pa premtime që nuk i mbajmë dot.',
    read: 'Lexo', othersT: 'Udhëzues të tjerë:', readsT: 'Lexoni edhe', onThisPage: 'Në këtë faqe', sourcesT: 'Burimet',
  },
  cost: {
    short: 'Sa kushton një faqe', glyph: '?',
    h1: 'Sa kushton një faqe interneti në Shqipëri?',
    title: 'Sa kushton një faqe interneti në Shqipëri? · SD Design',
    desc: 'Çfarë e vendos çmimin e një faqeje interneti: niveli, funksionet, gjuhët dhe përmbajtja. Kostot e përvitshme dhe pyetjet për t’i bërë para se të paguani.',
    blurb: 'Çfarë e vendos çmimin, kostot që vijnë çdo vit dhe pesë pyetje për çdo studio.',
    answer: 'Varet nga ajo që duhet të bëjë faqja: një faqe e vetme që tregon kush jeni kushton shumë më pak se një dyqan me shportë dhe pagesa. Ne nuk botojmë listë çmimesh: fillimisht ju bëjmë një draft falas, dhe çmimin jua themi në WhatsApp pasi ta keni parë.',
    sections: [
      { h: 'Çfarë e vendos çmimin', p: ['Katër gjëra, pak a shumë në këtë rend.'], list: [
        ['Çfarë bën faqja', 'Një faqe që vetëm tregon është puna më e vogël. Çdo gjë që klienti bën në të (rezervon, porosit, paguan) është punë më vete.'],
        ['Sa faqe dhe sa gjuhë', 'Çdo gjuhë duhet shkruar dhe kontrolluar, jo vetëm përkthyer me makinë. Tri gjuhë janë tri herë më shumë tekst për t’u mbajtur.'],
        ['Përmbajtja', 'Fotot, tekstet, menuja ose katalogu. Nëse i keni gati, puna shkon shpejt. Nëse duhen bërë nga e para, kjo është pjesë e çmimit.'],
        ['Kush e ndryshon më pas', 'Një panel ku stafi shton vetë produkte dhe çmime është më shumë punë në fillim. Pa panel, çdo ndryshim kalon nga ai që e ndërtoi faqen.'],
      ] },
      { h: 'Tri nivele, me shembuj të vërtetë', p: ['Ne i ndajmë faqet në tri nivele. Për secilin ka një faqe që e kemi ndërtuar vetë, që ta shihni çfarë përfshin.'], levels: true },
      { h: 'Kostot që vijnë çdo vit', p: ['Përveç ndërtimit, çdo faqe ka disa kosto që përsëriten. Pyesni për to që në fillim, që të mos ju dalin më vonë.'], list: [
        ['Emri i faqes (domain-i)', 'Adresa juaj, si emri-juaj.al. Paguhet çdo vit dhe duhet të jetë e regjistruar në emrin tuaj.'],
        ['Vendi ku rri faqja (hosting-u)', 'Kompjuteri që e mban faqen online. Kostoja varet nga lloji i faqes: një faqe e thjeshtë kërkon shumë më pak se një dyqan me shumë vizitorë.'],
        ['Pagesat me kartë', 'Nëse shisni me kartë, banka ose shërbimi i pagesave mban një komision për çdo pagesë. Pagesa në dorëzim nuk e ka këtë kosto.'],
        ['Mirëmbajtja', 'Ndryshimet, përditësimet dhe ndihma kur diçka nuk shkon. Pyesni çfarë përfshihet dhe çfarë paguhet më vete.'],
      ] },
      { h: 'Pesë pyetje para se të paguani', p: ['Vlejnë për çdo studio ose programues, edhe për ne.'], list: [
        'Në emër të kujt regjistrohet domain-i?',
        'A e shoh faqen në telefonin tim para se të paguaj?',
        'Kush i shton më pas fotot, çmimet ose menunë: unë, apo ju?',
        'Çfarë paguaj çdo vit, dhe kujt?',
        'Nëse ndahemi, a më mbetet faqja dhe përmbajtja e saj?',
      ], after: ['Pyetjes së dytë i përgjigjemi që tani: po. Drafti falas është pikërisht kjo.'] },
      { h: 'Pse nuk botojmë çmime', p: [
        'Sepse një çmim pa e parë biznesin është hamendje: ose shumë i lartë për atë që ju duhet, ose shumë i ulët për ta bërë mirë.',
        'Prandaj e kthejmë rendin. Fillimisht ju bëjmë një draft që punon, falas, brenda 24 orëve në ditë pune. E hapni në telefonin tuaj. Pastaj ju themi çmimin për ta çuar deri në fund, në WhatsApp. Nëse vazhdojmë, puna nis me një paradhënie që e caktojmë bashkë.',
      ], links: [{ to: 'offer', text: 'Si funksionon drafti falas' }] },
    ],
  },
  instagram: {
    short: 'Instagram apo faqe', glyph: '@',
    h1: 'Instagram apo faqe interneti?',
    title: 'Instagram apo faqe interneti? Çfarë bën secila · SD Design',
    desc: 'Instagram-i ju mban pranë atyre që ju ndjekin. Faqja ju nxjerr te kush ju kërkon në Google dhe në hartë. Çfarë bën secila dhe si punojnë bashkë.',
    blurb: 'Çfarë bën mirë Instagram-i, ku ngec dhe çfarë shton një faqe.',
    answer: 'Të dyja, dhe secila për punën e vet. Instagram-i ju mban pranë atyre që ju ndjekin tashmë. Faqja ju nxjerr te kush ju kërkon në Google dhe në hartë, edhe te ata që nuk kanë dëgjuar kurrë për ju.',
    sections: [
      { h: 'Çfarë bën mirë Instagram-i', list: [
        'Ju tregon çdo ditë te njerëzit që ju ndjekin.',
        'Fotot dhe videot e reja dalin menjëherë, pa ndihmën e askujt.',
        'Klientët ju shkruajnë aty ku janë tashmë.',
      ] },
      { h: 'Ku ngec', list: [
        ['Kush nuk ju ndjek, duhet t’ju kërkojë', 'Në Google dhe në hartë, biznesi juaj del me orarin, telefonin dhe butonin «Faqja e internetit». Pa faqe, nuk keni ku ta çoni atë buton.'],
        ['Informacioni humbet nëpër postime', 'Menuja, çmimet dhe orari janë diku mes fotove dhe story-ve. Klienti duhet t’i kërkojë, ose t’ju shkruajë për t’i pyetur.'],
        ['Flet një gjuhë', 'Një postim shkruhet në një gjuhë. Një faqe e ka menunë në shqip, anglisht dhe italisht, dhe klienti zgjedh vetë.'],
        ['Nuk është juaji', 'Rregullat dhe pamjen i vendos platforma. Një llogari mund të kufizohet ose të mbyllet; faqja dhe adresa e saj janë tuajat.'],
      ] },
      { h: 'Çfarë shton një faqe', list: [
        ['Ju gjejnë ata që kërkojnë', 'Emri, adresa, orari dhe lloji i biznesit shkruhen edhe në formën që lexojnë Google dhe hartat.'],
        ['Gjithçka në një vend', 'Çfarë ofroni, sa kushton, kur jeni hapur, si t’ju gjejnë, dhe një buton që ju shkruan në WhatsApp.'],
        ['Porosi dhe rezervime pa mesazhe pafund', 'Te Bar Martiri klienti porosit nga shezlongu, me numrin e çadrës. Te Dresses by Greta klientja zgjedh masën dhe porosit vetë.'],
      ] },
      { h: 'Si punojnë bashkë', p: [
        'Instagram-i sjell vëmendjen; faqja e kthen në porosi. Lidhja në bio çon te faqja; faqja ka butonin e Instagram-it për kë do të shohë më shumë foto.',
        'Dresses by Greta është shembulli ynë: një butik me dyqan fizik dhe në Instagram, ku faqja e ktheu katalogun në dyqan online.',
      ], links: [{ to: 'work-greta', text: 'Shihni Dresses by Greta' }, { to: 'offer', text: 'Si funksionon drafti falas' }] },
    ],
  },
  direct: {
    short: 'Pa komision', glyph: '0%',
    h1: 'Rezervime dhe porosi pa komision.',
    title: 'Rezervime dhe porosi direkte, pa komision · SD Design',
    desc: 'Platformat e rezervimeve dhe aplikacionet e dërgesave mbajnë komision për çdo shitje. Si të merrni më shumë rezervime dhe porosi direkt, pa i lënë ato.',
    blurb: 'Sa mbajnë platformat, kush rezervon direkt dhe çfarë duhet për rrugën direkte.',
    answer: 'Platformat e rezervimeve dhe aplikacionet e dërgesave ju sjellin klientë dhe mbajnë një përqindje për secilin. Nuk ka nevojë t’i lini. Mjafton që klienti që ju njeh tashmë, ose që kërkon emrin tuaj, të ketë një rrugë direkte te ju.',
    sections: [
      { h: 'Sa ju kushton komisioni', p: ['Përqindjen e gjeni në kontratën ose në faturën e platformës. Shumëzojeni me shitjet e një sezoni dhe keni shumën që largohet.'],
        links: [{ to: 'hotel#calc', text: 'Llogariteni për hotelin tuaj', needs: 'calculator' }, { to: 'food#calc', text: 'Llogariteni për restorantin tuaj', needs: 'calculator' }] },
      { h: 'Kush rezervon direkt', list: [
        ['Mysafiri që kthehet', 'Ju njeh tashmë. Nëse ka faqen ose numrin tuaj, nuk ka pse të kalojë nga platforma.'],
        ['Kush kërkon emrin tuaj', 'Disa mysafirë ju shohin në një platformë dhe pastaj kërkojnë emrin tuaj në Google. Nëse gjejnë faqen tuaj, me dhoma dhe çmime, mund të rezervojnë aty.'],
        ['Kush vjen nga Instagram-i ose nga një mik', 'I duhet vetëm një lidhje ku sheh çmimin dhe ju shkruan.'],
      ] },
      { h: 'Çfarë duhet për rrugën direkte', list: [
        ['Një faqe me çmimet tuaja', 'Dhomat ose menuja, me foto dhe çmime, në gjuhën e klientit.'],
        ['Një buton që punon', 'Rezervim ose porosi në faqe, ose një mesazh në WhatsApp me një prekje.'],
        ['Profili në Google me lidhjen te faqja', 'Kur dikush ju gjen në hartë, butoni «Faqja e internetit» e çon te ju, jo te një ndërmjetës.'],
        ['Një arsye për të ardhur direkt', 'Atë e vendosni ju: mëngjesi, parkimi, një pije mirëseardhjeje. Shikoni më parë kontratën me platformën: disa kanë kushte për çmimin që shfaqni diku tjetër.'],
      ] },
      { h: 'Për restorantet', p: [
        'Aplikacioni i dërgesave bën edhe dërgesën, jo vetëm porosinë. Porosia direkte ka kuptim kur klienti vjen ta marrë vetë, kur dërgoni ju, ose kur porosit në lokal.',
        'Katër Burgers i mban të dyja rrugët: faqja çon në Wolt me një prekje, ose te telefoni. Te Bar Martiri porosia bëhet direkt në faqe, nga shezlongu.',
      ], links: [{ to: 'work-kater', text: 'Shihni Katër Burgers' }, { to: 'work-martiri', text: 'Shihni Bar Martirin' }] },
      { h: 'Çfarë nuk premtojmë', p: ['Një faqe nuk i zëvendëson platformat dhe nuk sjell rezervime vetë. Ajo u jep një rrugë pa komision atyre që do të vinin gjithsesi te ju. Sa prej tyre e përdorin, e shihni në sezonin e parë.'],
        links: [{ to: 'hotel' }, { to: 'food' }] },
    ],
  },
};

const en = {
  nav: 'Guides',
  index: {
    title: 'Guides for business owners in Albania · SD Design',
    desc: 'Short, plain guides for owners: what a website costs, Instagram or a website, and bookings and orders without commission.',
    h1: 'Plain answers, before you pay.',
    lead: 'Short guides for business owners in Albania. No technical terms, and no promises we cannot keep.',
    read: 'Read', othersT: 'Other guides:', readsT: 'Read more', onThisPage: 'On this page', sourcesT: 'Sources',
  },
  cost: {
    short: 'What a site costs', glyph: '?',
    h1: 'How much does a website cost in Albania?',
    title: 'How much does a website cost in Albania? · SD Design',
    desc: 'What decides the price of a website: the level, the functions, the languages and the content. The yearly costs, and the questions to ask before you pay.',
    blurb: 'What decides the price, the costs that come back every year, and five questions for any studio.',
    answer: 'It depends on what the site has to do: a single page that says who you are costs far less than a shop with a basket and payments. We do not publish a price list: first we make you a free draft, and we give you the price on WhatsApp after you have seen it.',
    sections: [
      { h: 'What decides the price', p: ['Four things, more or less in this order.'], list: [
        ['What the site does', 'A site that only shows is the smallest job. Everything a customer does on it (booking, ordering, paying) is a job of its own.'],
        ['How many pages and languages', 'Every language has to be written and checked, not just machine-translated. Three languages are three times the text to keep up to date.'],
        ['The content', 'Photos, texts, the menu or the catalogue. If you have them ready, the work goes fast. If they have to be made from scratch, that is part of the price.'],
        ['Who changes it afterwards', 'A panel where your staff add products and prices themselves is more work at the start. Without one, every change goes through whoever built the site.'],
      ] },
      { h: 'Three levels, with real examples', p: ['We sort sites into three levels. For each there is a site we built ourselves, so you can see what it includes.'], levels: true },
      { h: 'The costs that come back every year', p: ['Besides the build, every site has a few costs that repeat. Ask about them at the start, so that they do not surprise you later.'], list: [
        ['The site’s name (the domain)', 'Your address, like your-name.al. It is paid every year and should be registered in your name.'],
        ['Where the site lives (hosting)', 'The computer that keeps the site online. The cost depends on the kind of site: a simple page needs far less than a shop with many visitors.'],
        ['Card payments', 'If you sell by card, the bank or the payment service keeps a commission on every payment. Cash on delivery does not have this cost.'],
        ['Upkeep', 'Changes, updates and help when something goes wrong. Ask what is included and what is paid separately.'],
      ] },
      { h: 'Five questions before you pay', p: ['They apply to any studio or developer, including us.'], list: [
        'In whose name is the domain registered?',
        'Do I see the site on my own phone before I pay?',
        'Who adds photos, prices or the menu later: me, or you?',
        'What do I pay every year, and to whom?',
        'If we part ways, do I keep the site and its content?',
      ], after: ['We can answer the second one right now: yes. The free draft is exactly that.'] },
      { h: 'Why we do not publish prices', p: [
        'Because a price given without seeing the business is a guess: either too high for what you need, or too low to do it well.',
        'So we turn the order around. First we make you a working draft, free, within 24 hours on working days. You open it on your phone. Then we tell you the price of taking it all the way, on WhatsApp. If we go on, the work starts with a deposit that we agree together.',
      ], links: [{ to: 'offer', text: 'How the free draft works' }] },
    ],
  },
  instagram: {
    short: 'Instagram or a site', glyph: '@',
    h1: 'Instagram or a website?',
    title: 'Instagram or a website? What each one does · SD Design',
    desc: 'Instagram keeps you close to your followers. A website puts you in front of whoever searches on Google and on the map. What each does, and how they work together.',
    blurb: 'What Instagram does well, where it stops, and what a website adds.',
    answer: 'Both, each for its own job. Instagram keeps you close to the people who already follow you. A website puts you in front of whoever searches on Google and on the map, including people who have never heard of you.',
    sections: [
      { h: 'What Instagram does well', list: [
        'It shows you every day to the people who follow you.',
        'New photos and videos go out at once, with nobody’s help.',
        'Customers write to you where they already are.',
      ] },
      { h: 'Where it stops', list: [
        ['Whoever does not follow you has to look for you', 'On Google and on the map, your business appears with its opening hours, its phone and a “Website” button. Without a site, you have nowhere to point that button.'],
        ['The information gets lost among the posts', 'The menu, the prices and the opening hours are somewhere between photos and stories. The customer has to hunt for them, or write to you to ask.'],
        ['It speaks one language', 'A post is written in one language. A site has the menu in Albanian, English and Italian, and the customer chooses.'],
        ['It is not yours', 'The platform sets the rules and the look. An account can be restricted or closed; a site and its address are yours.'],
      ] },
      { h: 'What a website adds', list: [
        ['People who search find you', 'The name, address, opening hours and kind of business are also written in the form that Google and the maps read.'],
        ['Everything in one place', 'What you offer, what it costs, when you are open, how to find you, and a button that writes to you on WhatsApp.'],
        ['Orders and bookings without endless messages', 'At Bar Martiri the customer orders from the sunbed, with the number of the umbrella. At Dresses by Greta the customer picks a size and orders without asking anyone.'],
      ] },
      { h: 'How they work together', p: [
        'Instagram brings the attention; the site turns it into orders. The link in your bio leads to the site; the site has the Instagram button for whoever wants to see more photos.',
        'Dresses by Greta is our example: a boutique with a shop on the street and on Instagram, where the site turned the catalogue into an online shop.',
      ], links: [{ to: 'work-greta', text: 'See Dresses by Greta' }, { to: 'offer', text: 'How the free draft works' }] },
    ],
  },
  direct: {
    short: 'Without commission', glyph: '0%',
    h1: 'Bookings and orders without commission.',
    title: 'Direct bookings and orders, without commission · SD Design',
    desc: 'Booking platforms and delivery apps keep a commission on every sale. How to get more bookings and orders directly, without leaving them.',
    blurb: 'What the platforms keep, who books direct, and what the direct way needs.',
    answer: 'Booking platforms and delivery apps bring you customers and keep a percentage of each one. You do not need to leave them. It is enough that the customer who already knows you, or who searches for your name, has a direct way to you.',
    sections: [
      { h: 'What the commission costs you', p: ['You find the percentage in your contract or on the platform’s invoice. Multiply it by a season’s sales and you have the amount that leaves.'],
        links: [{ to: 'hotel#calc', text: 'Work it out for your hotel', needs: 'calculator' }, { to: 'food#calc', text: 'Work it out for your restaurant', needs: 'calculator' }] },
      { h: 'Who books direct', list: [
        ['The guest who comes back', 'They already know you. If they have your site or your number, there is no reason to go through the platform.'],
        ['Whoever searches for your name', 'Some guests see you on a platform and then search for your name on Google. If they find your site, with rooms and prices, they can book there.'],
        ['Whoever comes from Instagram or from a friend', 'All they need is a link where they see the price and write to you.'],
      ] },
      { h: 'What the direct way needs', list: [
        ['A site with your prices', 'The rooms or the menu, with photos and prices, in the customer’s language.'],
        ['A button that works', 'A booking or an order on the site, or a WhatsApp message in one tap.'],
        ['A Google profile that links to your site', 'When someone finds you on the map, the “Website” button takes them to you, not to a go-between.'],
        ['A reason to come direct', 'That is yours to decide: breakfast, parking, a welcome drink. Look at your contract with the platform first: some have conditions on the price you show elsewhere.'],
      ] },
      { h: 'For restaurants', p: [
        'A delivery app also does the delivery, not only the order. A direct order makes sense when the customer comes to collect, when you deliver yourselves, or when they order on the spot.',
        'Katër Burgers keeps both ways: the site leads to Wolt in one tap, or to the phone. At Bar Martiri the order is placed directly on the site, from the sunbed.',
      ], links: [{ to: 'work-kater', text: 'See Katër Burgers' }, { to: 'work-martiri', text: 'See Bar Martiri' }] },
      { h: 'What we do not promise', p: ['A website does not replace the platforms and does not bring bookings by itself. It gives a way without commission to the people who would have come to you anyway. How many of them use it, you see in the first season.'],
        links: [{ to: 'hotel' }, { to: 'food' }] },
    ],
  },
};

const it = {
  nav: 'Guide',
  index: {
    title: 'Guide per chi ha un’attività in Albania · SD Design',
    desc: 'Guide brevi e chiare per i titolari: quanto costa un sito web, Instagram o sito, e prenotazioni e ordini senza commissioni.',
    h1: 'Risposte chiare, prima di pagare.',
    lead: 'Guide brevi per chi ha un’attività in Albania. Senza termini tecnici e senza promesse che non possiamo mantenere.',
    read: 'Leggi', othersT: 'Altre guide:', readsT: 'Leggete anche', onThisPage: 'In questa pagina', sourcesT: 'Fonti',
  },
  cost: {
    short: 'Quanto costa un sito', glyph: '?',
    h1: 'Quanto costa un sito web in Albania?',
    title: 'Quanto costa un sito web in Albania? · SD Design',
    desc: 'Che cosa decide il prezzo di un sito web: il livello, le funzioni, le lingue e i contenuti. I costi annuali e le domande da fare prima di pagare.',
    blurb: 'Che cosa decide il prezzo, i costi che tornano ogni anno e cinque domande per qualsiasi studio.',
    answer: 'Dipende da che cosa deve fare il sito: una sola pagina che dice chi siete costa molto meno di un negozio con carrello e pagamenti. Non pubblichiamo un listino: prima vi prepariamo una bozza gratis, e il prezzo ve lo diciamo su WhatsApp dopo che l’avete vista.',
    sections: [
      { h: 'Che cosa decide il prezzo', p: ['Quattro cose, più o meno in quest’ordine.'], list: [
        ['Che cosa fa il sito', 'Un sito che mostra soltanto è il lavoro più piccolo. Tutto quello che il cliente ci fa (prenotare, ordinare, pagare) è un lavoro a parte.'],
        ['Quante pagine e quante lingue', 'Ogni lingua va scritta e controllata, non solo tradotta a macchina. Tre lingue sono tre volte il testo da tenere aggiornato.'],
        ['I contenuti', 'Foto, testi, il menu o il catalogo. Se li avete pronti, il lavoro va veloce. Se vanno fatti da zero, fanno parte del prezzo.'],
        ['Chi lo modifica dopo', 'Un pannello dove lo staff aggiunge da solo prodotti e prezzi è più lavoro all’inizio. Senza, ogni modifica passa da chi ha costruito il sito.'],
      ] },
      { h: 'Tre livelli, con esempi veri', p: ['Dividiamo i siti in tre livelli. Per ognuno c’è un sito che abbiamo realizzato noi, così vedete che cosa comprende.'], levels: true },
      { h: 'I costi che tornano ogni anno', p: ['Oltre alla realizzazione, ogni sito ha alcuni costi che si ripetono. Chiedeteli all’inizio, così non vi sorprendono dopo.'], list: [
        ['Il nome del sito (il dominio)', 'Il vostro indirizzo, come vostro-nome.al. Si paga ogni anno e dovrebbe essere registrato a vostro nome.'],
        ['Dove sta il sito (l’hosting)', 'Il computer che tiene il sito online. Il costo dipende dal tipo di sito: una pagina semplice richiede molto meno di un negozio con tanti visitatori.'],
        ['I pagamenti con carta', 'Se vendete con carta, la banca o il servizio di pagamento trattiene una commissione su ogni pagamento. Il pagamento alla consegna non ha questo costo.'],
        ['La manutenzione', 'Modifiche, aggiornamenti e aiuto quando qualcosa non va. Chiedete che cosa è compreso e che cosa si paga a parte.'],
      ] },
      { h: 'Cinque domande prima di pagare', p: ['Valgono per qualsiasi studio o sviluppatore, noi compresi.'], list: [
        'A nome di chi viene registrato il dominio?',
        'Vedo il sito sul mio telefono prima di pagare?',
        'Chi aggiunge poi foto, prezzi o menu: io, o voi?',
        'Che cosa pago ogni anno, e a chi?',
        'Se ci separiamo, il sito e i suoi contenuti restano a me?',
      ], after: ['Alla seconda rispondiamo subito: sì. La bozza gratis è proprio questo.'] },
      { h: 'Perché non pubblichiamo i prezzi', p: [
        'Perché un prezzo dato senza aver visto l’attività è un’ipotesi: o troppo alto per quello che vi serve, o troppo basso per farlo bene.',
        'Per questo invertiamo l’ordine. Prima vi prepariamo una bozza funzionante, gratis, entro 24 ore nei giorni lavorativi. La aprite sul vostro telefono. Poi vi diciamo il prezzo per portarla fino in fondo, su WhatsApp. Se andiamo avanti, il lavoro parte con un acconto che stabiliamo insieme.',
      ], links: [{ to: 'offer', text: 'Come funziona la bozza gratis' }] },
    ],
  },
  instagram: {
    short: 'Instagram o sito', glyph: '@',
    h1: 'Instagram o sito web?',
    title: 'Instagram o sito web? Che cosa fa ciascuno · SD Design',
    desc: 'Instagram vi tiene vicini a chi vi segue. Un sito vi porta davanti a chi vi cerca su Google e sulla mappa. Che cosa fa ciascuno, e come lavorano insieme.',
    blurb: 'Che cosa fa bene Instagram, dove si ferma e che cosa aggiunge un sito.',
    answer: 'Tutti e due, ciascuno per il suo lavoro. Instagram vi tiene vicini a chi vi segue già. Un sito vi porta davanti a chi vi cerca su Google e sulla mappa, anche a chi non ha mai sentito parlare di voi.',
    sections: [
      { h: 'Che cosa fa bene Instagram', list: [
        'Vi mostra ogni giorno a chi vi segue.',
        'Foto e video nuovi escono subito, senza l’aiuto di nessuno.',
        'I clienti vi scrivono dove sono già.',
      ] },
      { h: 'Dove si ferma', list: [
        ['Chi non vi segue deve cercarvi', 'Su Google e sulla mappa la vostra attività compare con gli orari, il telefono e il pulsante «Sito web». Senza un sito, non avete dove far puntare quel pulsante.'],
        ['Le informazioni si perdono tra i post', 'Il menu, i prezzi e gli orari sono da qualche parte tra foto e storie. Il cliente deve cercarli, o scrivervi per chiederli.'],
        ['Parla una lingua sola', 'Un post si scrive in una lingua. Un sito ha il menu in albanese, inglese e italiano, e il cliente sceglie.'],
        ['Non è vostro', 'Le regole e l’aspetto li decide la piattaforma. Un account può essere limitato o chiuso; un sito e il suo indirizzo sono vostri.'],
      ] },
      { h: 'Che cosa aggiunge un sito', list: [
        ['Vi trova chi cerca', 'Nome, indirizzo, orari e tipo di attività sono scritti anche nella forma che leggono Google e le mappe.'],
        ['Tutto in un posto', 'Che cosa offrite, quanto costa, quando siete aperti, come trovarvi, e un pulsante che vi scrive su WhatsApp.'],
        ['Ordini e prenotazioni senza messaggi infiniti', 'Al Bar Martiri il cliente ordina dal lettino, con il numero dell’ombrellone. Da Dresses by Greta la cliente sceglie la taglia e ordina da sola.'],
      ] },
      { h: 'Come lavorano insieme', p: [
        'Instagram porta l’attenzione; il sito la trasforma in ordini. Il link in bio porta al sito; il sito ha il pulsante di Instagram per chi vuole vedere altre foto.',
        'Dresses by Greta è il nostro esempio: una boutique con un negozio su strada e su Instagram, dove il sito ha trasformato il catalogo in un negozio online.',
      ], links: [{ to: 'work-greta', text: 'Guardate Dresses by Greta' }, { to: 'offer', text: 'Come funziona la bozza gratis' }] },
    ],
  },
  direct: {
    short: 'Senza commissioni', glyph: '0%',
    h1: 'Prenotazioni e ordini senza commissioni.',
    title: 'Prenotazioni e ordini diretti, senza commissioni · SD Design',
    desc: 'Le piattaforme di prenotazione e le app di consegna trattengono una commissione su ogni vendita. Come ricevere più prenotazioni e ordini diretti, senza lasciarle.',
    blurb: 'Quanto trattengono le piattaforme, chi prenota direttamente e che cosa serve per la via diretta.',
    answer: 'Le piattaforme di prenotazione e le app di consegna vi portano clienti e trattengono una percentuale su ognuno. Non serve lasciarle. Basta che il cliente che vi conosce già, o che cerca il vostro nome, abbia una via diretta fino a voi.',
    sections: [
      { h: 'Quanto vi costa la commissione', p: ['La percentuale la trovate nel contratto o nella fattura della piattaforma. Moltiplicatela per le vendite di una stagione e avete la somma che se ne va.'],
        links: [{ to: 'hotel#calc', text: 'Calcolatelo per il vostro hotel', needs: 'calculator' }, { to: 'food#calc', text: 'Calcolatelo per il vostro ristorante', needs: 'calculator' }] },
      { h: 'Chi prenota direttamente', list: [
        ['L’ospite che ritorna', 'Vi conosce già. Se ha il vostro sito o il vostro numero, non ha motivo di passare dalla piattaforma.'],
        ['Chi cerca il vostro nome', 'Alcuni ospiti vi vedono su una piattaforma e poi cercano il vostro nome su Google. Se trovano il vostro sito, con camere e prezzi, possono prenotare lì.'],
        ['Chi arriva da Instagram o da un amico', 'Gli serve solo un link dove vede il prezzo e vi scrive.'],
      ] },
      { h: 'Che cosa serve per la via diretta', list: [
        ['Un sito con i vostri prezzi', 'Le camere o il menu, con foto e prezzi, nella lingua del cliente.'],
        ['Un pulsante che funziona', 'Prenotazione o ordine sul sito, oppure un messaggio WhatsApp con un tocco.'],
        ['Un profilo Google con il link al sito', 'Quando qualcuno vi trova sulla mappa, il pulsante «Sito web» lo porta da voi, non da un intermediario.'],
        ['Un motivo per venire direttamente', 'Lo decidete voi: la colazione, il parcheggio, un drink di benvenuto. Prima guardate il contratto con la piattaforma: alcune hanno condizioni sul prezzo che mostrate altrove.'],
      ] },
      { h: 'Per i ristoranti', p: [
        'L’app di consegna fa anche la consegna, non solo l’ordine. L’ordine diretto ha senso quando il cliente viene a ritirare, quando consegnate voi, o quando ordina sul posto.',
        'Katër Burgers tiene tutte e due le strade: il sito porta a Wolt con un tocco, oppure al telefono. Al Bar Martiri l’ordine si fa direttamente sul sito, dal lettino.',
      ], links: [{ to: 'work-kater', text: 'Guardate Katër Burgers' }, { to: 'work-martiri', text: 'Guardate Bar Martiri' }] },
      { h: 'Che cosa non promettiamo', p: ['Un sito non sostituisce le piattaforme e non porta prenotazioni da solo. Dà una via senza commissioni a chi sarebbe venuto da voi comunque. Quanti la usano, lo vedete nella prima stagione.'],
        links: [{ to: 'hotel' }, { to: 'food' }] },
    ],
  },
};

export const GUIDE_TEXT = { sq, en, it };
