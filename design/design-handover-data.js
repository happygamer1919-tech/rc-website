
const T = (name, hex, use) => ({ name, hex, use });
const R = (el, d, m, w, c, note) => ({ el, d, m, w, c, note });
const KV = (k, v) => ({ k, v });
const S = (i, id, ratio, desk, mob, where) => ({ i, id, ratio, desk, mob, where });

class Component extends DCLogic {
  renderVals() {
    const services = [
      { slot: 'svc-case-la-cheie', title: 'Case la cheie', d1: 'De la fundație până la cheia în ușă,', d2: 'cu un singur contract și un singur deviz.' },
      { slot: 'svc-acoperisuri', title: 'Acoperișuri', d1: 'Șarpantă, învelitoare metalică sau țiglă,', d2: 'jgheaburi și izolație termică inclusă.' },
      { slot: 'svc-fatade', title: 'Fațade', d1: 'Termoizolare, tencuială decorativă,', d2: 'placaje ventilate și finisaje rezistente.' },
      { slot: 'svc-reparatii', title: 'Reparații la cheie', d1: 'Apartamente și case, demolare inclusă,', d2: 'predare curată la termenul stabilit.' },
      { slot: 'svc-finisaje', title: 'Finisaje', d1: 'Gips-carton, glet, vopsitorii și pardoseli,', d2: 'montaj uși și instalații sanitare.' },
      { slot: 'svc-proiectare-3d', title: 'Proiectare și vizualizare 3D', d1: 'Plan arhitectural și randări 3D,', d2: 'vezi rezultatul înainte de prima cărămidă.' },
      { slot: 'svc-retele', title: 'Rețele inginerești', d1: 'Electrice, apă, canalizare și încălzire,', d2: 'proiectate și racordate legal.' },
      { slot: 'svc-industrial', title: 'Construcții industriale', d1: 'Hale, depozite și spații comerciale,', d2: 'structuri metalice și beton armat.' },
      { slot: 'svc-terasamente', title: 'Terasamente', d1: 'Excavații, nivelări și compactări,', d2: 'utilaj propriu și transport inclus.' },
    ];

    return {
      services,
      servicesShort: services.slice(0, 3),

      stats: [
        { n: '500+', label: 'proiecte finalizate' },
        { n: '15+', label: 'ani experiență' },
        { n: '30 ani', label: 'garanție scrisă' },
        { n: '4.9/5', label: 'din 250+ recenzii' },
      ],

      steps: [
        { n: '01', slot: 'step-01-fundatie', title: 'Fundație', line: 'Trasare, săpătură și turnare armată.' },
        { n: '02', slot: 'step-02-structura', title: 'Structură și ziduri', line: 'Zidărie, stâlpi, centuri și planșee.' },
        { n: '03', slot: 'step-03-acoperis', title: 'Acoperiș', line: 'Șarpantă, învelitoare și jgheaburi.' },
        { n: '04', slot: 'step-04-fatada', title: 'Fațadă', line: 'Termoizolare și finisaj exterior.' },
        { n: '05', slot: 'step-05-predare', title: 'Finisaje și predare', line: 'Finisaje interioare și cheia în mână.' },
      ],

      filters: ['Toate', 'Case la cheie', 'Acoperișuri', 'Fațade', 'Reparații', 'Finisaje'].map((f, i) => ({
        label: f,
        color: i === 0 ? '#F65308' : '#1A1A1A',
        weight: i === 0 ? 700 : 400,
        border: i === 0 ? '1px solid #F65308' : '1px solid #E2E2E2',
        bg: i === 0 ? '#FFFFFF' : 'transparent',
      })),

      projects: [
        { slot: 'port-01', cat: 'Acoperișuri', title: 'Acoperiș metalic, casă privată', line: 'Șarpantă nouă și învelitoare falțuită, 240 m².', loc: 'Durlești, Chișinău' },
        { slot: 'port-02', cat: 'Finisaje', title: 'Finisaje apartament 3 camere', line: 'Glet, vopsitorii, parchet și instalații sanitare.', loc: 'Botanica, Chișinău' },
        { slot: 'port-03', cat: 'Reparații', title: 'Reparație capitală, birou', line: 'Recompartimentare completă și rețele noi.', loc: 'Centru, Chișinău' },
        { slot: 'port-04', cat: 'Case la cheie', title: 'Casă la cheie, 140 m²', line: 'De la fundație la predare în unsprezece luni.', loc: 'Stăuceni' },
        { slot: 'port-05', cat: 'Fațade', title: 'Fațadă ventilată, bloc locativ', line: 'Termoizolare 100 mm și placaj fibrociment.', loc: 'Ialoveni' },
        { slot: 'port-06', cat: 'Case la cheie', title: 'Casă parter cu terasă', line: 'Structură din blocuri ceramice și terasă acoperită.', loc: 'Bubuieci' },
      ],

      trust: [
        { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Garanție 30 ani în contract', line: 'Termenul e scris în contract, nu promis verbal.' },
        { icon: 'M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z', title: 'Materiale cu certificare UE', line: 'Furnizori verificați, documente la fiecare livrare.' },
        { icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 3v6l4 2', title: 'Predare la termen', line: 'Grafic fixat la semnare, penalități asumate.' },
        { icon: 'M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8', title: 'Echipă cu peste 10 ani experiență', line: 'Meșteri proprii, nu subcontractanți de ocazie.' },
        { icon: 'M3 3h7l11 11-7 7L3 10zM7.5 7.5h.01', title: 'Prețuri transparente', line: 'Deviz pe articole, fără costuri apărute pe parcurs.' },
        { icon: 'M4 15v-3a8 8 0 0 1 16 0v3M4 15a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2zM20 15a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z', title: 'Suport după predare', line: 'Răspundem și după ce am predat cheile.' },
      ],

      reviews: [
        { quote: 'Au început când au spus și au terminat cu două săptămâni mai devreme. Devizul final a fost identic cu cel semnat.', name: 'Andrei Ciobanu', meta: 'Stăuceni · casă la cheie' },
        { quote: 'Acoperișul vechi curgea de trei ani. Echipa a demontat, a refăcut șarpanta și a montat totul în unsprezece zile.', name: 'Maria Rusu', meta: 'Chișinău, Durlești · acoperiș' },
        { quote: 'Apartamentul a fost predat curat, cu toate documentele și garanțiile la mână. Au revenit o dată pentru un reglaj, fără discuții.', name: 'Victor Munteanu', meta: 'Chișinău, Botanica · finisaje' },
      ],

      fields: [
        { label: 'Nume', ph: 'Numele tău' },
        { label: 'Telefon', ph: '+373 __ ___ ___' },
        { label: 'Tip lucrări', ph: 'Alege tipul lucrării ▾' },
        { label: 'Localitate', ph: 'Chișinău, Stăuceni, Ialoveni…' },
        { label: 'Mesaj · opțional', ph: 'Suprafață, termen dorit, alte detalii' },
      ],

      footNav: ['Acasă', 'Servicii', 'Portofoliu', 'Despre noi', 'Contacte'],
      footServices: ['Case la cheie', 'Acoperișuri', 'Fațade', 'Reparații la cheie', 'Finisaje', 'Proiectare și vizualizare 3D'],
      contacts: [
        { label: 'Adresă', value: 'Nicolae Zelinski 24, Chișinău' },
        { label: 'Telefon', value: '+373 76 837 180' },
        { label: 'Email', value: 'rapidconstructmd@gmail.com' },
        { label: 'Program', value: 'Luni–Sâmbătă 08:00–17:00' },
      ],

      tokens: [
        T('--brand', '#F65308', 'Butoane primare, cifre statistice, stări active, chip de categorie.'),
        T('--brand-dark', '#B23C08', 'Etichete eyebrow, hover pe linkuri și butoane.'),
        T('--ink', '#1A1A1A', 'Tot textul pe fundal deschis; conturul butonului secundar.'),
        T('--ink-muted', '#5A5A5A', 'Text secundar, legende, etichete de placeholder.'),
        T('--bg-light', '#FFFFFF', 'Fundal de secțiune A; fundal de card; text pe #141414.'),
        T('--bg-grey', '#F2F2F2', 'Fundal de secțiune B; umplerea placeholderelor de imagine.'),
        T('--bg-dark', '#141414', 'Secțiunile 6 și 9, exact două utilizări în pagină.'),
        T('--line', '#E2E2E2', 'Borduri, separatoare, text mic pe fundal închis.'),
      ],

      typeRows: [
        R('h1', '56px', '32px', '800', '#1A1A1A', 'UPPERCASE, line-height 1,15, letter-spacing −0,02em. O singură apariție: hero.'),
        R('h2', '40px', '26px', '800', '#1A1A1A', 'UPPERCASE, line-height 1,15, letter-spacing −0,01em. Alb pe #141414.'),
        R('h3', '22px', '19px', '700', '#1A1A1A', 'Sentence case, line-height 1,15. Titluri de card și de pas.'),
        R('eyebrow', '13px', '12px', '700', '#B23C08', 'UPPERCASE, letter-spacing 0,08em. Pe #141414 trece pe #F65308.'),
        R('body', '17px', '16px', '400', '#1A1A1A / #5A5A5A', 'line-height 1,6. Secundarul este #5A5A5A pe deschis, #FFFFFF pe închis.'),
        R('stat numeral', '44px', '32px', '800', '#F65308', 'line-height 1,15. Hero, pași de proces.'),
        R('stat bandă', '64px', '44px', '800', '#F65308', 'Doar în banda închisă, secțiunea 6.'),
      ],

      layoutRows: [
        KV('Container', 'max-width 1200px, centrat'),
        KV('Gutter', '24px desktop · 16px mobil'),
        KV('Padding secțiune', '96px sus/jos · 56px mobil'),
        KV('Excepție padding', 'banda închisă 56px pe desktop'),
        KV('Grilă', '3 col ≥1025px · 2 col 769–1024px · 1 col ≤768px'),
        KV('Gap grilă', '24px (16px pe mobil)'),
        KV('Breakpointuri', '1024px · 768px'),
        KV('Lățime desktop de referință', '1440px'),
        KV('Lățime mobil de referință', '390px'),
      ],

      compRows: [
        KV('Rază butoane / inputuri', '6px'),
        KV('Rază carduri / imagini', '10px'),
        KV('Umbră (doar carduri)', '0 1px 3px rgba(0,0,0,0.08)'),
        KV('Buton', 'înălțime 48px · padding 0 28px · weight 700'),
        KV('Buton primar', 'fundal #F65308, text #FFFFFF'),
        KV('Buton secundar', 'contur 1px #1A1A1A, fundal transparent'),
        KV('Header', 'înălțime 72px, opac, bordură jos 1px #E2E2E2'),
        KV('Ținte tactile mobile', 'minimum 44×44px'),
        KV('Butoane flotante', '56px diametru, offset 24px / 16px'),
      ],

      slots: [
        S(1, 'svc-case-la-cheie', '4:3', '384 × 288 px', '358 × 269 px', 'Secțiunea 3, card 1'),
        S(2, 'svc-acoperisuri', '4:3', '384 × 288 px', '358 × 269 px', 'Secțiunea 3, card 2'),
        S(3, 'svc-fatade', '4:3', '384 × 288 px', '358 × 269 px', 'Secțiunea 3, card 3'),
        S(4, 'svc-reparatii', '4:3', '384 × 288 px', '358 × 269 px', 'Secțiunea 3, card 4'),
        S(5, 'svc-finisaje', '4:3', '384 × 288 px', '358 × 269 px', 'Secțiunea 3, card 5'),
        S(6, 'svc-proiectare-3d', '4:3', '384 × 288 px', '358 × 269 px', 'Secțiunea 3, card 6'),
        S(7, 'svc-retele', '4:3', '384 × 288 px', '358 × 269 px', 'Secțiunea 3, card 7'),
        S(8, 'svc-industrial', '4:3', '384 × 288 px', '358 × 269 px', 'Secțiunea 3, card 8'),
        S(9, 'svc-terasamente', '4:3', '384 × 288 px', '358 × 269 px', 'Secțiunea 3, card 9'),
        S(10, 'step-01-fundatie', '4:3', '211 × 158 px', '358 × 269 px', 'Secțiunea 4, pasul 01'),
        S(11, 'step-02-structura', '4:3', '211 × 158 px', '358 × 269 px', 'Secțiunea 4, pasul 02'),
        S(12, 'step-03-acoperis', '4:3', '211 × 158 px', '358 × 269 px', 'Secțiunea 4, pasul 03'),
        S(13, 'step-04-fatada', '4:3', '211 × 158 px', '358 × 269 px', 'Secțiunea 4, pasul 04'),
        S(14, 'step-05-predare', '4:3', '211 × 158 px', '358 × 269 px', 'Secțiunea 4, pasul 05'),
        S(15, 'port-01', '3:2', '384 × 256 px', '358 × 239 px', 'Secțiunea 5 · Acoperișuri'),
        S(16, 'port-02', '3:2', '384 × 256 px', '358 × 239 px', 'Secțiunea 5 · Finisaje'),
        S(17, 'port-03', '3:2', '384 × 256 px', '358 × 239 px', 'Secțiunea 5 · Reparații'),
        S(18, 'port-04', '3:2', '384 × 256 px', '358 × 239 px', 'Secțiunea 5 · Case la cheie'),
        S(19, 'port-05', '3:2', '384 × 256 px', '358 × 239 px', 'Secțiunea 5 · Fațade'),
        S(20, 'port-06', '3:2', '384 × 256 px', '358 × 239 px', 'Secțiunea 5 · Case la cheie'),
      ],
    };
  }
}
