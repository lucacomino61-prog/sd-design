// Albanian, the default. Every word on the site comes from here. What is said about a client was read on that
// client's public site on 10 Nov 2026 (research/facts). The offer (a free working draft) says exactly what was
// agreed on 10 Nov 2026 and nothing more: 24 hours on working days, 10 a week, Albania only, after a short chat,
// a deposit to continue. Its numbers live in src/data/offer.json.
export default {
  lang: 'sq',
  meta: {
    home: { title: 'SD Design · Faqe interneti në Shqipëri, drafti i parë falas', desc: 'Shiheni faqen tuaj para se të paguani: SD Design ju bën një draft që punon, falas, brenda 24 orëve në ditë pune. Faqe interneti dhe dyqane online në Shqipëri.' },
    offer: { title: 'Draft falas i faqes suaj brenda 24 orëve · SD Design', desc: 'Një draft që punon i faqes suaj, falas, brenda 24 orëve në ditë pune. 10 në javë, vetëm për biznese në Shqipëri. Na shkruani në WhatsApp.' },
    food: { title: 'Faqe interneti për restorante, bare dhe kafene · SD Design', desc: 'Menu në telefon në shqip, anglisht dhe italisht, orar, hartë dhe porosi. Shihni si punon te Bar Martiri në Spille dhe te Katër Burgers në Tiranë.' },
    hotel: { title: 'Faqe interneti për hotele dhe bujtina · SD Design', desc: 'Faqe për hotele dhe bujtina me rezervime direkte, dhoma, foto dhe çmime, në shqip, anglisht dhe italisht. Shihni prototipin për Hotel Pelikan në Divjakë.' },
    shop: { title: 'Dyqan online: katalog, shportë dhe pagesë · SD Design', desc: 'Ndërtojmë dyqane online me katalog, shportë, pagesë në dorëzim ose me kartë dhe panel për stafin. Shihni elixir.al dhe Dresses by Greta.' },
    clinic: { title: 'Faqe në italisht për klinika dhe agjenci · SD Design', desc: 'Për klinika dhe agjenci në Shqipëri me klientë italianë: faqe në italisht, kërkesa direkt në WhatsApp dhe profil i plotë në Google.' },
    privacy: { title: 'Privatësia · SD Design', desc: 'Kjo faqe nuk vendos cookies dhe nuk ju ndjek. Çfarë ndodh me të dhënat tuaja kur na shkruani.' },
    notFound: { title: 'Faqja nuk u gjet · SD Design' },
  },
  ui: {
    skip: 'Kalo te përmbajtja', home: 'SD Design, faqja kryesore', menu: 'Menu', navLabel: 'Kryesore', langLabel: 'Gjuha', crumbs: 'Ku jeni',
    still: 'Ndalo animacionet', clock: 'Shqipëri', next: 'Faqja tjetër', open: 'Hap faqen',
    onPhone: '{name}, faqja në telefon', shotAlt: '{name}, faqja kryesore', cardAlt: '{name}, pamja e projektit', tallAlt: '{name}, faqja nga lart poshtë në telefon',
    count: '{n} faqe · {m} online', draft: 'Draft, jo ende online', speaks: 'Gjuhët', said: 'Me fjalët e tyre',
    left: 'Drafte të lira këtë javë', none: 'Këtë javë u morën të gjitha. Shkruani për javën tjetër.', answers: 'Ju përgjigjet {name}, brenda ditës së punës.', albania: 'Vetëm për biznese në Shqipëri.',
  },
  bar: ['Mirë se erdhe', 'Pimë një kafe?', 'Drafti i parë është falas'],
  nav: { work: 'Punët', offer: 'Drafti falas', contact: 'Kontakt', privacy: 'Privatësia' },
  kinds: { food: 'Restorante & bare', hotel: 'Hotele & bujtina', shop: 'Dyqane online', clinic: 'Klinika & agjenci' },
  kindTitles: { food: 'Restorante, bare, kafene', hotel: 'Hotele dhe bujtina', shop: 'Dyqane online', clinic: 'Klinika dhe agjenci' },
  states: { live: 'Online', proto: 'Prototip' },
  langNames: { sq: 'shqip', en: 'anglisht', it: 'italisht', fr: 'frëngjisht' },

  home: {
    tag: 'SD Design · Faqe interneti për biznese në Shqipëri',
    h1: ['Shiheni faqen', 'tuaj *para* se', 'të paguani.'],
    lead: 'Një draft që punon i faqes suaj, falas, brenda 24 orëve në ditë pune. E hapni në telefonin tuaj dhe vendosni vetë.',
    cta: 'Dua draftin tim falas',
    workT: 'Faqe që kemi ndërtuar.', yours: 'Këtu mund të jetë faqja juaj.', band: 'Drafti i parë është falas',
    say: 'Gjashtë faqe për biznese shqiptare. Një bar në plazh ku porosit nga shezlongu, një dyqan me mbi 800 parfume, një butik ku fustani zgjidhet sipas masës.',
    why: { t: 'Një faqe që punon për ju, jo vetëm një faqe.', items: [
      ['E ndërtuar për telefonin', 'Shumica e klientëve tuaj ju gjejnë në telefon. Aty e provojmë çdo faqe para se të dalë online.'],
      ['Shqip, anglisht, italisht', 'Turistët dhe klientët e huaj ju lexojnë në gjuhën e tyre. Bar Martiri dhe Katër Burgers flasin të tria.'],
      ['WhatsApp, jo formularë të gjatë', 'Një prekje dhe klienti ju shkruan: për rezervime, porosi ose pyetje.'],
      ['Ju e ndryshoni vetë', 'Dyqanet tona kanë panel ku stafi shton produkte, foto dhe çmime pa na thirrur.'],
    ] },
    faq: { t: 'Pyetje që na bëhen shpesh.', more: 'Keni një pyetje tjetër?', ask: 'Na shkruani në WhatsApp', msg: 'Përshëndetje SD Design, kam një pyetje.', items: [
      ['A është vërtet falas drafti?', 'Po. Drafti është falas. Paguani vetëm nëse vendosni ta çojmë faqen deri në fund: atëherë puna nis me një paradhënie që e caktojmë bashkë.'],
      ['Çfarë është një «draft që punon»?', 'Një faqe e vërtetë në një lidhje, jo një foto. E hapni në telefonin tuaj dhe e lëvizni si çdo faqe tjetër.'],
      ['Çfarë duhet t’ju dërgoj?', 'Emrin dhe llojin e biznesit, Instagram-in ose faqen që keni, logon dhe disa foto, dhe çfarë duhet të bëjnë klientët: të rezervojnë, të porosisin apo t’ju telefonojnë.'],
      ['Kur e marr draftin?', 'Brenda 24 orëve në ditë pune, nga e hëna në të premte, pasi të kemi folur shkurt në WhatsApp.'],
      ['Sa kushton faqja e plotë?', 'Varet nga niveli: një faqe e thjeshtë, një faqe me funksione apo një dyqan. Çmimin jua themi në WhatsApp, pasi të keni parë draftin.'],
      ['Pse vetëm 10 drafte në javë?', 'Sepse çdo draft kërkon punë të vërtetë, dhe duam t’i mbajmë fjalën për 24 orët.'],
      ['Në cilat gjuhë mund të jetë faqja?', 'Në shqip, anglisht dhe italisht. Bar Martiri dhe Katër Burgers, për shembull, flasin të tria; Dresses by Greta ka edhe frëngjisht.'],
      ['A mund ta ndryshoj vetë?', 'Po. Dyqanet që kemi ndërtuar kanë një panel ku stafi shton produkte, foto dhe çmime pa na thirrur.'],
      ['Kam Instagram. Pse më duhet faqe?', 'Instagram-i ju tregon te ata që ju ndjekin. Faqja ju nxjerr te kush ju kërkon në Google dhe në hartë, edhe te turistët që nuk ju njohin. Aty klienti gjen menunë, çmimet, orarin dhe butonin për t’ju shkruar, pa kërkuar nëpër postime.'],
      ['A është drafti falas edhe jashtë Shqipërisë?', 'Jo. Drafti falas është vetëm për biznese në Shqipëri.'],
    ] },
  },

  // the free working draft
  offer: {
    h1: 'Draft falas i faqes suaj, brenda 24 orëve.',
    lead: 'Na shkruani në WhatsApp dhe flasim shkurt. Brenda 24 orëve në ditë pune e hapni draftin në telefonin tuaj dhe vendosni vetë.',
    msg: 'Përshëndetje SD Design, dua draftin falas të faqes sime.\n\nBiznesi: \nLloji: {type}\nInstagram ose faqja që kam: \nÇfarë duhet të bëjnë klientët (rezervim, porosi, telefonatë): \n\nLogon dhe disa foto po i dërgoj këtu.',
    numbers: [['orë, në ditë pune'], ['drafte në javë'], ['lekë për draftin']],
    storyT: 'Si funksionon drafti falas.',
    steps: [
      ['Na shkruani', 'Emri dhe lloji i biznesit, Instagram-i ose faqja që keni, logoja dhe disa foto, dhe çfarë duhet të bëjnë klientët: të rezervojnë, të porosisin apo t’ju telefonojnë. Butoni e nis mesazhin për ju.'],
      ['Flasim shkurt', 'Ju përgjigjemi brenda ditës së punës. Dy-tri pyetje në WhatsApp, që drafti të jetë për biznesin tuaj.'],
      ['Drafti, brenda 24 orëve', 'Një faqe që punon, në një lidhje. E hapni në telefonin tuaj, e lëvizni, ua tregoni të tjerëve. Nga e hëna në të premte.'],
      ['Vendosni ju', 'Drafti është falas. Nëse doni ta çojmë deri në fund, puna e plotë nis me një paradhënie që e caktojmë bashkë.'],
    ],
    chat: {
      me: ['Përshëndetje SD Design, dua draftin falas të faqes sime.', 'Biznesi: emri juaj\nLloji: restorant\nInstagram: @emrijuaj'],
      them: ['Përshëndetje! Faleminderit për mesazhin.', 'Dy pyetje të shkurtra: në cilat gjuhë e doni faqen? Dhe ku duhet të çojë butoni kryesor, te rezervimi apo te menuja?'],
      ready: 'Drafti juaj është gati. Hapeni në telefon:', link: 'Emri i biznesit tuaj', linkNote: 'draft · hapet në telefon',
      draftTag: 'Draft', draftT: 'Emri i biznesit tuaj', draftS: 'Faqja juaj fillon këtu: çfarë ofroni, kur jeni hapur, si t’ju gjejnë.', draftCta: 'Rezervo', draftCta2: 'Menuja',
      done: 'Ju pëlqen? Vazhdojmë.',
    },
    sendT: 'Çfarë na dërgoni.',
    send: ['Emrin dhe llojin e biznesit', 'Instagram-in ose faqen që keni', 'Logon dhe disa foto', 'Çfarë duhet të bëjnë klientët: rezervim, porosi apo telefonatë'],
    termsT: 'Kushtet, shkurt.',
    terms: ['{m} drafte falas në javë.', 'Vetëm për biznese në Shqipëri.', '24 orët numërohen në ditë pune, nga e hëna në të premte, pasi kemi folur shkurt në WhatsApp.', 'Drafti është falas. Puna e plotë nis me një paradhënie që e caktojmë bashkë.'],
    egT: 'Faqe që kemi ndërtuar.', faqT: 'Pyetje për draftin.',
  },

  // every kind of site, by difficulty: each level names a real site of that level
  levels: {
    t: 'Çdo lloj faqeje, sipas vështirësisë.', lead: 'Tri nivele. Çmimin jua themi në WhatsApp, pasi të keni parë draftin.', eg: 'Shembull',
    items: [
      ['E thjeshtë', 'Një faqe e vetme që thotë kush jeni dhe si t’ju gjejnë.', ['Kush jeni dhe çfarë ofroni', 'Orari, harta, telefoni', 'Butoni i WhatsApp'], 'kater'],
      ['Me funksione', 'Faqe ku klienti bën diçka: sheh menunë, rezervon, porosit.', ['Menu ose shërbime', 'Rezervime ose porosi', 'Dy ose tri gjuhë'], 'martiri'],
      ['Dyqan ose platformë', 'Shitje online nga fillimi në fund, me panel për stafin.', ['Katalog dhe shportë', 'Pagesë në dorëzim ose me kartë', 'Panel për stafin'], 'elixir'],
    ],
    kindsT: 'Për çfarë biznesi?', other: 'Lloj tjetër biznesi? Na shkruani: ndërtojmë çdo lloj faqeje.',
  },

  projects: {
    martiri: { what: 'Bar dhe akullore në plazh', place: 'Spille',
      lede: 'Bar dhe akullore buzë detit në Spille, i hapur që nga viti 2009. Faqja i përgjigjet klientit para se të pyesë: çfarë ka në menu, kur është hapur, sa kushton shezlongu.',
      facts: ['Menu me gjashtë kategori, në shqip, italisht dhe anglisht.', 'Porosi nga shezlongu: klienti zgjedh nga menuja dhe shënon rreshtin dhe numrin e çadrës.', 'Orari, sezoni, çmimi i shezlongut dhe parkimi falas, që në faqen e parë.', 'Butoni «Telefono tani», chat me pyetje të gatshme dhe moti i Spilles në kohë reale.'] },
    elixir: { what: 'Dyqan parfumesh online', place: 'Gjithë Shqipëria',
      lede: 'Dyqan online me parfume origjinale, me dërgim në gjithë Shqipërinë. Klienti gjen parfumin, e porosit dhe e ndjek porosinë vetë.',
      facts: ['Katalog me mbi 800 parfume: kërkim, kategori dhe një kuiz që të gjen parfumin.', 'Shportë, pagesë me kartë ose në dorëzim dhe gjurmim i porosisë.', 'Karta dhuratë, vlerësime nga klientët dhe butoni «Pyet në WhatsApp» te çdo parfum.', 'Panel për stafin: porositë, çmimet, kuponat dhe shitjet, edhe nga telefoni.'] },
    kater: { what: 'Restorant me burgera', place: 'Tiranë',
      lede: 'Katër smash burgera te 21 Dhjetori në Tiranë. Menuja është e shkurtër, prandaj edhe faqja: një faqe e vetme që të çon te porosia.',
      facts: ['E gjithë menuja në një faqe: katër burgera, me foto dhe çmim.', 'Porosi me një prekje në Wolt, ose me telefon.', 'Shqip, anglisht dhe italisht.', 'Adresa dhe vlerësimet në Google, që klienti të vijë pa pyetur.'] },
    greta: { what: 'Butik fustanesh', place: 'Tiranë',
      lede: 'Butik me fustane mbrëmjeje në Tiranë, me dyqan fizik dhe në Instagram. Faqja e kthen katalogun në dyqan online: klientja zgjedh masën, porosit dhe paguan në dorëzim.',
      facts: ['Katalog me çmime në lek dhe masat nga 34 deri në 42; masat e shitura shënohen vetë.', 'Filtër sipas masës dhe sipas rastit: mbrëmje, maturë, dasmë, koktej.', 'Çantë dhe pagesë në dorëzim; fustanet jepen edhe me qira.', 'Shqip, anglisht dhe frëngjisht, me panel në shqip ku dyqani shton fustanet.'] },
    divjaka: { what: 'Platformë turizmi', place: 'Divjakë',
      lede: 'Platformë për Hotel Pelikan në Divjakë: rezervimet, dyqani dhe itinerari i lagunës në një vend. Është prototip dhe ende nuk është publike.',
      facts: ['Rezervime dhe dyqan online në të njëjtën faqe.', 'Itinerar për lagunën e Divjakës, me një hartë që vizatohet ndërsa lëviz faqja.', 'Shqip dhe anglisht, me panel për stafin.'] },
    beed: { what: 'Treg për energjinë diellore', place: 'Shqipëri',
      lede: 'Treg online ku krahasohen ofertat për panele diellore, bateri dhe pompa nxehtësie. Është prototip: shitësit dhe çmimet janë shembuj.',
      facts: ['Krahasim çmimesh nga disa shitës për të njëjtin produkt.', 'Kalkulator që tregon sa prodhon çatia juaj, sipas qytetit.', 'Gjashtë paketa diellore dhe një shportë e vetme për shumë shitës.', 'Shqip dhe anglisht, me çmime në lek ose në euro.'] },
  },

  // a client's site on a page of its own: the facts are the ones in `projects` above
  work: {
    more: 'Shiko projektin', doesT: 'Çfarë bën faqja.', seeT: 'Faqja, nga lart poshtë.', seeNote: 'Katër ekrane të telefonit njëri pas tjetrit, ashtu siç i sheh klienti. Më poshtë, faqja në kompjuter dhe e regjistruar në telefon.',
    kind: 'Lloji', level: 'Niveli', state: 'Gjendja',
    yoursT: 'Doni një faqe si kjo?', yoursLead: 'Fillojmë me një draft falas të faqes suaj. E hapni në telefon brenda 24 orëve në ditë pune, pasi të kemi folur shkurt në WhatsApp.',
    othersT: 'Faqe të tjera që kemi ndërtuar:', sameKind: 'Për të njëjtin lloj biznesi:',
    meta: {
      martiri: { title: 'Bar Martiri, Spille: faqja e një bari në plazh · SD Design', desc: 'Faqja që ndërtuam për Bar Martirin në Spille: menu në tri gjuhë, porosi nga shezlongu, orari dhe çmimet që në faqen e parë. Shiheni në telefon.' },
      elixir: { title: 'elixir.al: dyqan online me mbi 800 parfume · SD Design', desc: 'Si punon elixir.al, dyqani online i parfumeve që ndërtuam: katalog me kërkim dhe kuiz, pagesë me kartë ose në dorëzim, gjurmim i porosisë dhe panel për stafin.' },
      kater: { title: 'Katër Burgers, Tiranë: menuja në një faqe të vetme · SD Design', desc: 'Faqja që ndërtuam për Katër Burgers në Tiranë: katër burgera me foto dhe çmim, porosi me një prekje në Wolt, në shqip, anglisht dhe italisht.' },
      greta: { title: 'Dresses by Greta: butik fustanesh si dyqan online · SD Design', desc: 'Dyqani online që ndërtuam për butikun Dresses by Greta në Tiranë: katalog me masa dhe çmime, filtër sipas rastit, pagesë në dorëzim dhe panel në shqip.' },
    },
  },

  services: {
    getT: 'Çfarë merrni.', egT: 'Ku e kemi bërë.', faqT: 'Pyetje.', moreT: 'Punojmë edhe për:',
    price: ['Sa kushton?', 'Varet nga niveli i faqes. Fillimisht ju bëjmë draftin falas; çmimin jua themi në WhatsApp, pasi ta keni parë.'],
    food: {
      h1: 'Faqe interneti për restorante, bare dhe kafene.',
      lead: 'Ndërtojmë faqen ku klienti sheh menunë, orarin dhe vendin, dhe ju shkruan ose porosit me një prekje. Në shqip, anglisht dhe italisht, e provuar në telefon.',
      cta: 'Drafti për restorantin tim', type: 'restorant / bar / kafene',
      get: [
        ['Menu që lexohet në telefon', 'Kategori dhe çmime në faqe, pa PDF për të shkarkuar. Te Bar Martiri menuja ka gjashtë kategori, nga akullorja te koktejet.'],
        ['Tri gjuhë', 'Turisti e lexon menunë në gjuhën e vet. Bar Martiri dhe Katër Burgers flasin shqip, anglisht dhe italisht.'],
        ['Porosi pa pritur kamerierin', 'Te Bar Martiri klienti porosit nga shezlongu: zgjedh nga menuja dhe shënon numrin e çadrës. Te Katër Burgers porosia shkon në Wolt me një prekje.'],
        ['Orari, harta dhe telefoni', 'Kur jeni hapur, ku jeni dhe një buton që ju telefonon: gjërat e para që kërkon një klient i ri.'],
        ['Faqe që Google e kupton', 'Emri, adresa, orari dhe lloji i lokalit shkruhen edhe në formën që lexojnë Google dhe hartat.'],
      ],
      faq: [
        ['A mund të jetë menuja në disa gjuhë?', 'Po. Bar Martiri dhe Katër Burgers e kanë në shqip, anglisht dhe italisht, dhe klienti e zgjedh gjuhën vetë.'],
        ['A mund të porosisë klienti nga faqja?', 'Po, në dy mënyra që i kemi ndërtuar. Porosi direkt nga faqja, si te Bar Martiri, ku porosia vjen me numrin e çadrës. Ose lidhje me një shërbim dërgese, si Wolt te Katër Burgers.'],
      ],
    },
    hotel: {
      h1: 'Faqe interneti për hotele dhe bujtina.',
      lead: 'Ndërtojmë faqen ku mysafiri sheh dhomat dhe çmimet dhe rezervon direkt te ju, në gjuhën e tij. Shembulli ynë është platforma për Hotel Pelikan në Divjakë, ende prototip.',
      cta: 'Drafti për hotelin tim', type: 'hotel / bujtinë',
      get: [
        ['Rezervime direkte', 'Mysafiri rezervon në faqen tuaj dhe kërkesa ju vjen direkt, jo vetëm përmes platformave që mbajnë komision.'],
        ['Dhomat, fotot dhe çmimet', 'Çdo dhomë me fotot e veta dhe me çmimin sipas sezonit.'],
        ['Tri gjuhë', 'Shqip, anglisht dhe italisht, që mysafiri i huaj të lexojë pa përkthyes.'],
        ['Më shumë se dhoma', 'Platforma për Hotel Pelikan mbledh në një vend rezervimet, një dyqan dhe një itinerar për lagunën e Divjakës.'],
        ['Panel për stafin', 'Stafi i sheh rezervimet dhe porositë në një panel, pa na thirrur.'],
      ],
      faq: [
        ['A keni ndërtuar faqe për hotele?', 'Kemi ndërtuar platformën për Hotel Pelikan në Divjakë, me rezervime, dyqan dhe itinerar. Është prototip dhe ende nuk është publike.'],
        ['A mund të rezervojë mysafiri direkt?', 'Po. Rezervimi bëhet në faqen tuaj dhe ju vjen direkt, pa kaluar nga një platformë tjetër.'],
      ],
    },
    shop: {
      h1: 'Dyqane online për biznese shqiptare.',
      lead: 'Ndërtojmë dyqanin ku klienti gjen produktin, e shton në shportë dhe paguan në dorëzim ose me kartë. Stafi juaj i shton produktet vetë, nga një panel në shqip.',
      cta: 'Drafti për dyqanin tim', type: 'dyqan online',
      get: [
        ['Katalog që gjendet lehtë', 'Kërkim, kategori dhe filtra. elixir.al ka mbi 800 parfume dhe një kuiz që të gjen tëndin; Dresses by Greta filtron sipas masës dhe rastit.'],
        ['Shportë dhe pagesë', 'Pagesë në dorëzim, e zakonshme në Shqipëri, ose me kartë si te elixir.al.'],
        ['Panel për stafin', 'Stafi shton produkte, foto dhe çmime dhe sheh porositë, pa na thirrur. Te elixir.al paneli hapet edhe si aplikacion në telefon.'],
        ['Gjurmim i porosisë', 'Klienti e sheh vetë ku ndodhet porosia, si te elixir.al.'],
        ['Kupona dhe karta dhuratë', 'Zbritje me kod dhe karta dhuratë, siç i ka elixir.al.'],
        ['Masa dhe gjendje', 'Te Dresses by Greta çdo fustan tregon masat që kanë mbetur; të shiturat shënohen vetë.'],
      ],
      faq: [
        ['A mund të paguajë klienti me kartë?', 'Po. elixir.al pranon pagesë me kartë dhe në dorëzim. Për kartën duhet një marrëveshje me një bankë ose me një shërbim pagesash në Shqipëri.'],
        ['A i shtoj vetë produktet?', 'Po. Dyqanet që kemi ndërtuar kanë një panel ku stafi shton produkte, foto dhe çmime.'],
      ],
    },
    clinic: {
      h1: 'Faqe në italisht për klinika dhe agjenci.',
      lead: 'Nëse klientët tuaj vijnë nga Italia, faqja duhet t’u flasë italisht. E ndërtojmë në italisht, shqip dhe anglisht, me kërkesat që ju vijnë direkt në WhatsApp.',
      cta: 'Drafti për klinikën time', type: 'klinikë / agjenci, me faqe në italisht',
      get: [
        ['Italisht i shkruar si duhet', 'Tekstet shkruhen drejtpërdrejt në italisht. Edhe kjo faqe ka versionin e saj në italisht.'],
        ['Kërkesa në WhatsApp', 'Klienti ju shkruan me një prekje, me mesazhin e nisur gati.'],
        ['Profil i plotë në Google', 'Emri, adresa, orari dhe fotot, që t’ju gjejnë edhe në hartë.'],
        ['E provuar në telefon', 'Faqja provohet në telefon para se të dalë online, sepse aty do ta hapë klienti.'],
      ],
      egNote: 'Ende nuk kemi një faqe publike për një klinikë. Faqet tona në italisht janë Bar Martiri dhe Katër Burgers; edhe kjo që po lexoni.',
      faq: [
        ['A keni ndërtuar faqe për klinika?', 'Ende jo një që është publike. Kemi ndërtuar faqe në tri gjuhë, si Bar Martiri, që ka versionin e vet në italisht.'],
        ['Pse në italisht?', 'Sepse klienti vendos në gjuhën e vet. Çmimet, shërbimet dhe udhëtimin duhet t’i lexojë pa përkthyes.'],
      ],
    },
  },

  // the commission calculator on the hotel and restaurant pages: the visitor types their own numbers (the ones it
  // opens with are examples, set in src/components/Calc.astro); `sep` goes between thousands
  calc: {
    t: 'Sa ju kushton komisioni?', lead: 'Vendosni numrat tuaj dhe shihni sa largohet në komisione. Llogaria bëhet në pajisjen tuaj: asgjë nuk dërgohet askund.',
    example: 'Numrat fillestarë janë vetëm shembull.', where: 'Përqindjen tuaj e gjeni në kontratën ose në faturën e platformës.',
    currency: 'Monedha', lek: 'lekë', months: ['muaj', 'muaj'], sep: '\u00a0',
    out: 'Shkojnë në komisione, në {n} {months}', share: 'Nëse kaq prej tyre do të vinin direkt', kept: 'te ju do të mbeteshin',
    hotel: { n: 'Net të shitura në muaj përmes platformave', unit: 'net', price: 'Çmimi mesatar i një nate', pct: 'Komisioni i platformës', months: 'Muaj sezoni',
      note: 'Platformat ju sjellin edhe mysafirë që nuk do t’ju gjenin vetë. Llogaria vlen për ata që ju njohin tashmë ose ju kërkojnë me emër.' },
    food: { n: 'Porosi në muaj përmes aplikacioneve të dërgesës', unit: 'porosi', price: 'Vlera mesatare e një porosie', pct: 'Komisioni i aplikacionit', months: 'Muaj në vit',
      note: 'Aplikacioni bën edhe dërgesën. Porosia direkte ka kuptim kur klienti vjen ta marrë vetë, kur dërgoni ju, ose kur porosit në lokal.' },
  },

  contact: {
    t: ['Na tregoni', 'biznesin tuaj.'], sub: 'Përgjigjemi në shqip, anglisht ose italisht.',
    wa: 'Dua draftin tim falas', tel: 'Telefononi', ig: 'Instagram',
    formT: 'Ose lini një mesazh', name: 'Emri dhe biznesi', phone: 'Telefoni', need: 'Çfarë ju duhet?', text: 'P.sh. një faqe me menu për barin tim në Durrës', send: 'Dërgo mesazhin',
    noteWa: 'Mesazhi hapet në WhatsApp, gati për t’u dërguar.', noteInbox: 'Mesazhi vjen direkt te ne.',
    empty: 'Shkruani shkurt çfarë ju duhet.', ok: 'Mesazhi u dërgua. Faleminderit!', fail: 'Mesazhi nuk u dërgua. Na shkruani në WhatsApp.',
    hello: 'Përshëndetje SD Design.', labelName: 'Emri dhe biznesi', labelPhone: 'Telefoni',
  },
  toast: { wa: 'Draft: numri i WhatsApp shtohet para publikimit.', tel: 'Draft: numri i telefonit shtohet para publikimit.', ig: 'Draft: profili i Instagram shtohet para publikimit.', form: 'Draft: formulari lidhet me WhatsApp para publikimit.' },
  foot: { line: 'Studio dizajni · Shqipëri', services: 'Shërbimet', work: 'Punët', langs: 'Gjuha', contact: 'Kontakt' },

  privacy: {
    h1: 'Privatësia.', lead: 'Shkurt: kjo faqe nuk ju ndjek. Më poshtë është gjithçka që ndodh me të dhënat tuaja.',
    sections: [
      ['Çfarë mbledh faqja', ['Asgjë vetë. Faqja nuk vendos cookies, nuk ka mjete matjeje ose reklamash dhe nuk ruan asgjë në pajisjen tuaj.', 'Shkronjat, figurat dhe videot vijnë nga vetë faqja. Asnjë pjesë e saj nuk ngarkohet nga shërbime të tjera.']],
      ['Kur na shkruani', ['Kur na shkruani në WhatsApp, na telefononi ose na shkruani në Instagram, marrim atë që na dërgoni: emrin, numrin, mesazhin, logon dhe fotot. I përdorim për t’ju përgjigjur dhe për të bërë draftin tuaj.', '{form}']],
      ['Shërbime të tjera', ['WhatsApp dhe Instagram janë shërbime të Meta-s, me rregullat e tyre të privatësisë. Lidhjet te faqet e klientëve tanë ju çojnë në faqe që nuk i drejtojmë ne.']],
      ['Pyetje', ['Për çdo pyetje mbi të dhënat tuaja, na shkruani në WhatsApp ose na telefononi.']],
    ],
    formWa: 'Formulari i kontaktit nuk dërgon asgjë te faqja: hap WhatsApp-in me mesazhin tuaj të shkruar, dhe ju vendosni nëse ta dërgoni.',
    formInbox: 'Formulari i kontaktit na dërgon emrin, telefonin dhe mesazhin që shkruani, që t’ju përgjigjemi.',
    who: 'Kush e mban faqen', whoDraft: 'Draft: emri i regjistruar, NIPT-i dhe adresa e studios shtohen para publikimit.',
  },
  notFound: { h1: 'Kjo faqe nuk u gjet.', text: 'Adresa mund të ketë ndryshuar. Nga këtu shkoni te faqja kryesore ose te punët tona.', home: 'Faqja kryesore' },

  eggs: {
    kafe: { words: ['kafe'], t: 'Pimë një kafe?', tr: '', s: 'Na shkruani dhe caktojmë një orë.', cta: 'Po, në WhatsApp', msg: 'Përshëndetje SD Design! Pimë një kafe dhe flasim për faqen time?', close: 'Mbyll' },
    say: [['Mirë se erdhe!', ''], ['Si je? Mirë?', ''], ['Hajde për një kafe!', ''], ['S’ka problem, e rregullojmë.', ''], ['Faleminderit që erdhe!', ''], ['Shihemi në WhatsApp!', '']],
    shake: ['Mos e tund shumë!', ''],
    konami: ['Kodi Konami. Na gjetët!', ''],
  },
};
