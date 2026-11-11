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
// The guide about public funds (`grants`, with a switch of its own) says only what the official pages said on the day
// in `checked`, and lists them (`sources`); when the pages change, read them again and change the day.
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
  grants: {
    short: 'Grante', glyph: 'LEK', checked: '2026-11-11', checkedLine: 'Kontrolluar më 11 nëntor 2026.',
    h1: 'A ka grante për një faqe interneti?',
    title: 'Grante për faqe interneti dhe dyqan online · SD Design',
    desc: 'Çfarë thonë faqet zyrtare për fondin e AIDA-s dhe programin Go Digital të BERZH-it: çfarë mbulojnë, për kë janë dhe çfarë nuk premtojnë.',
    blurb: 'Çfarë mbulojnë fondi i AIDA-s dhe programi Go Digital i BERZH-it, sipas faqeve zyrtare.',
    answer: 'Për një dyqan online ose një platformë, thirrja e AIDA-s për vitin 2026 e kishte ndër kostot që mbulon. Një faqe e thjeshtë prezantimi nuk përmendet. Këtu është çfarë thonë vetë faqet zyrtare, të lexuara më 11 nëntor 2026. Vendimin e merr gjithmonë institucioni, jo ne.',
    sections: [
      { h: 'Fondi i AIDA-s për zhvillimin e ndërmarrjeve', p: ['AIDA (Agjencia Shqiptare e Zhvillimit të Investimeve) administron fondin «Për zhvillimin e ndërmarrjeve», që financohet nga buxheti i shtetit, sipas ligjit nr. 43/2022 për ndërmarrjet mikro, të vogla dhe të mesme.'], list: [
        ['Për kë', 'Ndërmarrje mikro, të vogla dhe të mesme që e ushtrojnë veprimtarinë brenda vendit.'],
        ['Sa', 'Në skemën 1 të thirrjes 2026 (shpenzime korrente): deri në 2.500.000 lekë, me mbulim të kostove 100%.'],
        ['Çfarë mbulon që lidhet me faqet', '«Krijimi i aplikacioneve apo platformave në funksion të zhvillimit të proceseve lidhur me tregtinë elektronike/e-commerce». Thirrja përmend edhe certifikimin, etiketimin dhe ambalazhimin, dhe trajnimet e stafit.'],
        ['Kur', 'Thirrja 2026 ishte e hapur 30 ditë, nga 11 maji deri më 9 qershor 2026. Tani është e mbyllur. Projektet duhej të përfundonin brenda vitit, me raportin përfundimtar në nëntor.'],
        ['Kush nuk përfiton', 'Ndërmarrjet që kanë marrë financim nga donatorë ose institucione financiare për të njëjtat zëra.'],
      ] },
      { h: 'Thirrja hapet një herë në vit, dhe muaji ndryshon', p: [
        'Në 2024 thirrja ishte e hapur nga korriku në gusht, në 2025 në shkurt, në 2026 nga maji në qershor. Kush do të aplikojë duhet të ndjekë faqen e AIDA-s dhe t’i ketë dokumentet gati më parë.',
        'Dokumentet që kërkonte thirrja 2026:',
      ], list: [
        'Formulari i kërkesës dhe formulari i buxhetit, nga faqja e AIDA-s',
        'Certifikata e regjistrimit dhe ekstrakti historik nga QKB, me status aktiv',
        'Deklarata për kategorinë e ndërmarrjes (mikro, e vogël apo e mesme)',
        'Vërtetimet për detyrimet tatimore dhe doganore, nga e-Albania',
        'Pasqyrat financiare të vitit të fundit, ose formulari i deklarimit të të ardhurave',
        'Dëshmia e penalitetit e administratorit, nga e-Albania, dhe kopja e letërnjoftimit',
      ], after: ['Aplikimi dërgohej me email te AIDA.'] },
      { h: 'Go Digital: kredi me një grant 10%', p: [
        'Programi «Go Digital in the Western Balkans» i BERZH-it dhe i Bashkimit Evropian nuk është grant i drejtpërdrejtë. Ndërmarrjet e vogla dhe të mesme marrin një kredi te një bankë partnere për investime në automatizim dhe dixhitalizim; pasi investimi përfundon me sukses, mund të marrin një grant të BE-së prej 10% të kredisë.',
        'Ndër investimet që përmend BERZH-i janë programet kompjuterike për automatizimin e proceseve të biznesit dhe dixhitalizimin e punës. Një faqe prezantimi nuk përmendet. Për një dyqan online ose një sistem rezervimesh, pyesni bankën tuaj nëse merr pjesë në program dhe nëse investimi juaj pranohet.',
      ] },
      { h: 'Çfarë do të thotë kjo për faqen tuaj', list: [
        ['Dyqan online ose platformë', 'Është lloji i projektit që përmend thirrja e AIDA-s. Nëse mendoni të aplikoni në thirrjen e ardhshme, përgatitni që tani dokumentet dhe një përshkrim të qartë të projektit.'],
        ['Faqe e thjeshtë prezantimi', 'Nuk e kemi gjetur të përmendur si kosto të mbulueshme në asnjërin nga dy programet. Mos e planifikoni mbi një grant.'],
        ['Kujdes me premtimet', 'Askush nuk mund t’ju garantojë një grant: vendos bordi vlerësues i AIDA-s, ose banka. Kush ju premton një «grant të sigurt» nuk mund ta mbajë atë premtim.'],
      ], after: ['Nëse po përgatitni një aplikim për një dyqan online, na shkruani: drafti falas ju tregon çfarë do të ndërtohej.'], links: [{ to: 'shop' }, { to: 'offer', text: 'Si funksionon drafti falas' }] },
    ],
    sources: [['AIDA: Fondet 2026, faqja e thirrjes', 'https://aida.gov.al/nmvm-eksporte/nmvm/fondet-e-aida-s/'], ['AIDA: broshura e thirrjes 2026 (PDF)', 'https://aida.gov.al/wp-content/uploads/2026/05/AIDA-Thirrja-2026.pdf'], ['BERZH: Go Digital in the Western Balkans', 'https://www.ebrd.com/home/what-we-do/focus-areas/digitalisation/go-digital-in-western-balkans.html'], ['Albania Tech: njoftimi për thirrjen 2025', 'https://albaniatech.org/aida-opens-applications-for-funds-to-support-businesses'], ['Albania Tech: njoftimi për thirrjen 2024', 'https://albaniatech.org/event/aida-opens-call-for-support-and-development-of-micro-small-and-medium-enterprises/']],
    note: 'Kushtet ndryshojnë nga viti në vit. Përpara se të veproni, lexoni thirrjen e fundit në faqen e AIDA-s.',
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
  grants: {
    short: 'Grants', glyph: 'LEK', checked: '2026-11-11', checkedLine: 'Checked on 11 November 2026.',
    h1: 'Are there grants for a website?',
    title: 'Grants for a website or online shop in Albania · SD Design',
    desc: 'What the official pages say about AIDA’s enterprise fund and the EBRD’s Go Digital programme: what they cover, who they are for and what they do not promise.',
    blurb: 'What AIDA’s fund and the EBRD’s Go Digital programme cover, as the official pages put it.',
    answer: 'For an online shop or a platform, AIDA’s call for 2026 had it among the costs it covers. A simple presentation site is not mentioned. Here is what the official pages themselves say, read on 11 November 2026. The decision always belongs to the institution, not to us.',
    sections: [
      { h: 'AIDA’s fund for the development of enterprises', p: ['AIDA (the Albanian Investment Development Agency) administers the fund “For the development of enterprises”, financed from the state budget under law no. 43/2022 on micro, small and medium enterprises.'], list: [
        ['Who it is for', 'Micro, small and medium enterprises that operate inside the country.'],
        ['How much', 'In scheme 1 of the 2026 call (current expenses): up to 2,500,000 lek, covering 100% of the costs.'],
        ['What it covers that concerns websites', '“The creation of applications or platforms that serve the development of processes linked to electronic trade/e-commerce” (our translation). The call also names certification, labelling and packaging, and staff training.'],
        ['When', 'The 2026 call was open for 30 days, from 11 May to 9 June 2026. It is closed now. Projects had to be completed within the year, with the final report in November.'],
        ['Who cannot benefit', 'Enterprises that have received financing from donors or financial institutions for the same items.'],
      ] },
      { h: 'The call opens once a year, and the month changes', p: [
        'In 2024 the call was open from July to August, in 2025 in February, in 2026 from May to June. Whoever wants to apply has to follow AIDA’s page and have the documents ready beforehand.',
        'The documents the 2026 call asked for:',
      ], list: [
        'The application form and the budget form, from AIDA’s site',
        'The registration certificate and the historical extract from the business register (QKB), with active status',
        'The declaration of the enterprise’s category (micro, small or medium)',
        'Certificates that taxes and customs duties are paid, from e-Albania',
        'The last year’s financial statements, or the income declaration form',
        'The administrator’s criminal-record certificate, from e-Albania, and a copy of their ID',
      ], after: ['The application was sent to AIDA by email.'] },
      { h: 'Go Digital: a loan with a 10% grant', p: [
        'The “Go Digital in the Western Balkans” programme of the EBRD and the European Union is not a direct grant. Small and medium enterprises take a loan from a partner bank for investments in automation and digitalisation; once the investment is completed successfully, they can receive an EU grant of 10 per cent of the loan.',
        'Among the investments the EBRD names is software for the automation of business processes and the digitalisation of operations. A presentation site is not mentioned. For an online shop or a booking system, ask your bank whether it takes part in the programme and whether your investment qualifies.',
      ] },
      { h: 'What this means for your site', list: [
        ['An online shop or a platform', 'It is the kind of project AIDA’s call names. If you are thinking of applying to the next call, prepare the documents and a clear description of the project now.'],
        ['A simple presentation site', 'We have not found it named as a covered cost in either programme. Do not plan it around a grant.'],
        ['Be careful with promises', 'Nobody can guarantee you a grant: AIDA’s evaluation board decides, or the bank. Whoever promises you a “sure grant” cannot keep that promise.'],
      ], after: ['If you are preparing an application for an online shop, write to us: the free draft shows you what would be built.'], links: [{ to: 'shop' }, { to: 'offer', text: 'How the free draft works' }] },
    ],
    sources: [['AIDA: Funds 2026, the page of the call (in Albanian)', 'https://aida.gov.al/nmvm-eksporte/nmvm/fondet-e-aida-s/'], ['AIDA: brochure of the 2026 call (PDF, in Albanian)', 'https://aida.gov.al/wp-content/uploads/2026/05/AIDA-Thirrja-2026.pdf'], ['EBRD: Go Digital in the Western Balkans', 'https://www.ebrd.com/home/what-we-do/focus-areas/digitalisation/go-digital-in-western-balkans.html'], ['Albania Tech: notice of the 2025 call', 'https://albaniatech.org/aida-opens-applications-for-funds-to-support-businesses'], ['Albania Tech: notice of the 2024 call', 'https://albaniatech.org/event/aida-opens-call-for-support-and-development-of-micro-small-and-medium-enterprises/']],
    note: 'The conditions change from year to year. Before you act, read the latest call on AIDA’s page.',
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
  grants: {
    short: 'Contributi', glyph: 'LEK', checked: '2026-11-11', checkedLine: 'Controllato l’11 novembre 2026.',
    h1: 'Ci sono contributi per un sito web?',
    title: 'Contributi per un sito o un negozio online in Albania · SD Design',
    desc: 'Che cosa dicono le pagine ufficiali sul fondo di AIDA per le imprese e sul programma Go Digital della BERS: che cosa coprono e che cosa non promettono.',
    blurb: 'Che cosa coprono il fondo di AIDA e il programma Go Digital della BERS, secondo le pagine ufficiali.',
    answer: 'Per un negozio online o una piattaforma, il bando AIDA per il 2026 li aveva tra i costi coperti. Un semplice sito vetrina non è menzionato. Qui trovate quello che dicono le pagine ufficiali, lette l’11 novembre 2026. La decisione spetta sempre all’ente, non a noi.',
    sections: [
      { h: 'Il fondo di AIDA per lo sviluppo delle imprese', p: ['AIDA (l’Agenzia albanese per lo sviluppo degli investimenti) gestisce il fondo «Per lo sviluppo delle imprese», finanziato dal bilancio dello Stato in base alla legge n. 43/2022 sulle micro, piccole e medie imprese.'], list: [
        ['Per chi', 'Micro, piccole e medie imprese che operano all’interno del Paese.'],
        ['Quanto', 'Nello schema 1 del bando 2026 (spese correnti): fino a 2.500.000 lek, con copertura dei costi al 100%.'],
        ['Che cosa copre che riguarda i siti', '«La creazione di applicazioni o piattaforme al servizio dello sviluppo dei processi legati al commercio elettronico/e-commerce» (traduzione nostra). Il bando cita anche la certificazione, l’etichettatura e l’imballaggio, e la formazione del personale.'],
        ['Quando', 'Il bando 2026 è rimasto aperto 30 giorni, dall’11 maggio al 9 giugno 2026. Ora è chiuso. I progetti dovevano concludersi entro l’anno, con la relazione finale a novembre.'],
        ['Chi non può beneficiarne', 'Le imprese che hanno ricevuto finanziamenti da donatori o istituti finanziari per le stesse voci.'],
      ] },
      { h: 'Il bando si apre una volta l’anno, e il mese cambia', p: [
        'Nel 2024 il bando è rimasto aperto da luglio ad agosto, nel 2025 a febbraio, nel 2026 da maggio a giugno. Chi vuole fare domanda deve seguire la pagina di AIDA e avere i documenti pronti prima.',
        'I documenti richiesti dal bando 2026:',
      ], list: [
        'Il modulo di domanda e il modulo del budget, dal sito di AIDA',
        'Il certificato di registrazione e l’estratto storico del registro delle imprese (QKB), con stato attivo',
        'La dichiarazione sulla categoria dell’impresa (micro, piccola o media)',
        'Le attestazioni di regolarità fiscale e doganale, da e-Albania',
        'Il bilancio dell’ultimo anno, oppure il modulo di dichiarazione dei redditi',
        'Il certificato penale dell’amministratore, da e-Albania, e una copia del documento d’identità',
      ], after: ['La domanda si inviava ad AIDA per email.'] },
      { h: 'Go Digital: un prestito con un contributo del 10%', p: [
        'Il programma «Go Digital in the Western Balkans» della BERS e dell’Unione europea non è un contributo diretto. Le piccole e medie imprese ottengono un prestito da una banca partner per investimenti in automazione e digitalizzazione; a investimento concluso con successo possono ricevere un contributo dell’UE pari al 10% del prestito.',
        'Tra gli investimenti che la BERS cita c’è il software per l’automazione dei processi aziendali e la digitalizzazione delle attività. Un sito vetrina non è menzionato. Per un negozio online o un sistema di prenotazioni, chiedete alla vostra banca se partecipa al programma e se il vostro investimento è ammesso.',
      ] },
      { h: 'Che cosa significa per il vostro sito', list: [
        ['Negozio online o piattaforma', 'È il tipo di progetto che il bando AIDA cita. Se pensate di fare domanda al prossimo bando, preparate fin d’ora i documenti e una descrizione chiara del progetto.'],
        ['Semplice sito vetrina', 'Non l’abbiamo trovato tra i costi coperti in nessuno dei due programmi. Non pianificatelo contando su un contributo.'],
        ['Attenzione alle promesse', 'Nessuno può garantirvi un contributo: decide la commissione di valutazione di AIDA, oppure la banca. Chi vi promette un «contributo sicuro» non può mantenere quella promessa.'],
      ], after: ['Se state preparando una domanda per un negozio online, scriveteci: la bozza gratis vi mostra che cosa verrebbe costruito.'], links: [{ to: 'shop' }, { to: 'offer', text: 'Come funziona la bozza gratis' }] },
    ],
    sources: [['AIDA: Fondi 2026, la pagina del bando (in albanese)', 'https://aida.gov.al/nmvm-eksporte/nmvm/fondet-e-aida-s/'], ['AIDA: brochure del bando 2026 (PDF, in albanese)', 'https://aida.gov.al/wp-content/uploads/2026/05/AIDA-Thirrja-2026.pdf'], ['BERS: Go Digital in the Western Balkans (in inglese)', 'https://www.ebrd.com/home/what-we-do/focus-areas/digitalisation/go-digital-in-western-balkans.html'], ['Albania Tech: avviso del bando 2025 (in inglese)', 'https://albaniatech.org/aida-opens-applications-for-funds-to-support-businesses'], ['Albania Tech: avviso del bando 2024 (in inglese)', 'https://albaniatech.org/event/aida-opens-call-for-support-and-development-of-micro-small-and-medium-enterprises/']],
    note: 'Le condizioni cambiano di anno in anno. Prima di muovervi, leggete l’ultimo bando sulla pagina di AIDA.',
  },
};

export const GUIDE_TEXT = { sq, en, it };
