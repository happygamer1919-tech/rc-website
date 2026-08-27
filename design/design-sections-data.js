
const ICONS = {
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  badge: 'M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z',
  clock: 'M12 6v6l4 2',
  users: 'M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  tag: 'M3 3h7l11 11-7 7L3 10zM7.5 7.5h.01',
  headset: 'M4 15v-3a8 8 0 0 1 16 0v3M4 15a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2zM20 15a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z',
};

const TRUST = [
  { icon: ICONS.shield, circle: null, title: 'Garanție 30 ani în contract', line: 'Termenul e scris în contract, nu promis verbal.' },
  { icon: ICONS.badge, circle: null, title: 'Materiale cu certificare UE', line: 'Furnizori verificați, documente la fiecare livrare.' },
  { icon: ICONS.clock, circle: { cx: 12, cy: 12, r: 9 }, title: 'Predare la termen', line: 'Grafic fixat la semnare, penalități asumate.' },
  { icon: ICONS.users, circle: null, title: 'Echipă cu peste 10 ani experiență', line: 'Meșteri proprii, nu subcontractanți de ocazie.' },
  { icon: ICONS.tag, circle: null, title: 'Prețuri transparente', line: 'Deviz pe articole, fără costuri apărute pe parcurs.' },
  { icon: ICONS.headset, circle: null, title: 'Suport după predare', line: 'Răspundem și după ce am predat cheile.' },
];

const REVIEWS = [
  { quote: 'Au început când au spus și au terminat cu două săptămâni mai devreme. Devizul final a fost identic cu cel semnat.', name: 'Andrei Ciobanu', meta: 'Stăuceni · casă la cheie' },
  { quote: 'Acoperișul vechi curgea de trei ani. Echipa a demontat, a refăcut șarpanta și a montat totul în unsprezece zile.', name: 'Maria Rusu', meta: 'Chișinău, Durlești · acoperiș' },
  { quote: 'Apartamentul a fost predat curat, cu toate documentele și garanțiile la mână. Au revenit o dată pentru un reglaj, fără discuții.', name: 'Victor Munteanu', meta: 'Chișinău, Botanica · finisaje' },
];

const WORK_TYPES = ['Casă la cheie', 'Acoperiș', 'Fațadă', 'Reparație la cheie', 'Finisaje', 'Proiectare și 3D', 'Rețele inginerești', 'Construcții industriale', 'Terasamente'];

const FOOT_NAV = ['Acasă', 'Servicii', 'Portofoliu', 'Despre noi', 'Contacte'];

const FOOT_SERVICES = ['Case la cheie', 'Acoperișuri', 'Fațade', 'Reparații la cheie', 'Finisaje', 'Proiectare și vizualizare 3D'];

const CONTACTS = [
  { label: 'Adresă', value: 'Nicolae Zelinski 24, Chișinău' },
  { label: 'Telefon', value: '+373 76 837 180' },
  { label: 'Email', value: 'rapidconstructmd@gmail.com' },
  { label: 'Program', value: 'Luni–Sâmbătă 08:00–17:00' },
];

const FILTERS = ['Toate', 'Case la cheie', 'Acoperișuri', 'Fațade', 'Reparații', 'Finisaje'];

const PROJECTS = [
  { slot: 'port-01', cat: 'Acoperișuri', title: 'Acoperiș metalic, casă privată', line: 'Șarpantă nouă și învelitoare falțuită, 240 m².', loc: 'Durlești, Chișinău' },
  { slot: 'port-02', cat: 'Finisaje', title: 'Finisaje apartament 3 camere', line: 'Glet, vopsitorii, parchet și instalații sanitare.', loc: 'Botanica, Chișinău' },
  { slot: 'port-03', cat: 'Reparații', title: 'Reparație capitală, birou', line: 'Recompartimentare completă și rețele noi.', loc: 'Centru, Chișinău' },
  { slot: 'port-04', cat: 'Case la cheie', title: 'Casă la cheie, 140 m²', line: 'De la fundație la predare în unsprezece luni.', loc: 'Stăuceni' },
  { slot: 'port-05', cat: 'Fațade', title: 'Fațadă ventilată, bloc locativ', line: 'Termoizolare 100 mm și placaj fibrociment.', loc: 'Ialoveni' },
  { slot: 'port-06', cat: 'Case la cheie', title: 'Casă parter cu terasă', line: 'Structură din blocuri ceramice și terasă acoperită.', loc: 'Bubuieci' },
];

class Component extends DCLogic {
  state = { deskZoom: 0.6, filter: 'Toate' };

  componentDidMount() {
    this.fit = () => {
      const el = document.getElementById('desk-fit');
      if (!el) return;
      const w = el.clientWidth;
      if (w > 0) {
        const z = Math.min(1, w / 1440);
        if (Math.abs(z - this.state.deskZoom) > 0.002) this.setState({ deskZoom: z });
      }
    };
    this.fit();
    requestAnimationFrame(this.fit);
    window.addEventListener('resize', this.fit);
  }

  componentWillUnmount() {
    if (this.fit) window.removeEventListener('resize', this.fit);
  }

  renderVals() {
    const active = this.state.filter;
    return {
      showLangSwitch: this.props.showLangSwitch ?? true,
      showScrollDemo: this.props.showScrollDemo ?? true,
      deskCanvasStyle: { width: '1440px', zoom: this.state.deskZoom },
      stats: [
        { n: '500+', label: 'proiecte finalizate' },
        { n: '15+', label: 'ani experiență' },
        { n: '30 ani', label: 'garanție scrisă' },
        { n: '4.9/5', label: 'din 250+ recenzii' },
      ],
      workTypes: WORK_TYPES,
      footNav: FOOT_NAV,
      footServices: FOOT_SERVICES,
      contacts: CONTACTS,
      trust: TRUST,
      reviews: REVIEWS,
      filters: FILTERS.map(f => ({
        label: f,
        color: f === active ? '#F65308' : '#1A1A1A',
        weight: f === active ? 700 : 400,
        border: f === active ? '1px solid #F65308' : '1px solid #E2E2E2',
        bg: f === active ? '#FFFFFF' : 'transparent',
        pick: () => this.setState({ filter: f }),
      })),
      projects: PROJECTS.filter(p => active === 'Toate' || p.cat === active),
      emptyState: PROJECTS.filter(p => active === 'Toate' || p.cat === active).length === 0,
      steps: [
        { n: '01', slot: 'step-01-fundatie', title: 'Fundație', line: 'Trasare, săpătură și turnare armată.' },
        { n: '02', slot: 'step-02-structura', title: 'Structură și ziduri', line: 'Zidărie, stâlpi, centuri și planșee.' },
        { n: '03', slot: 'step-03-acoperis', title: 'Acoperiș', line: 'Șarpantă, învelitoare și jgheaburi.' },
        { n: '04', slot: 'step-04-fatada', title: 'Fațadă', line: 'Termoizolare și finisaj exterior.' },
        { n: '05', slot: 'step-05-predare', title: 'Finisaje și predare', line: 'Finisaje interioare și cheia în mână.' },
      ],
      services: [
        { slot: 'svc-case-la-cheie', title: 'Case la cheie', d1: 'De la fundație până la cheia în ușă,', d2: 'cu un singur contract și un singur deviz.' },
        { slot: 'svc-acoperisuri', title: 'Acoperișuri', d1: 'Șarpantă, învelitoare metalică sau țiglă,', d2: 'jgheaburi și izolație termică inclusă.' },
        { slot: 'svc-fatade', title: 'Fațade', d1: 'Termoizolare, tencuială decorativă,', d2: 'placaje ventilate și finisaje rezistente.' },
        { slot: 'svc-reparatii', title: 'Reparații la cheie', d1: 'Apartamente și case, demolare inclusă,', d2: 'predare curată la termenul stabilit.' },
        { slot: 'svc-finisaje', title: 'Finisaje', d1: 'Gips-carton, glet, vopsitorii și pardoseli,', d2: 'montaj uși și instalații sanitare.' },
        { slot: 'svc-proiectare-3d', title: 'Proiectare și vizualizare 3D', d1: 'Plan arhitectural și randări 3D,', d2: 'vezi rezultatul înainte de prima cărămidă.' },
        { slot: 'svc-retele', title: 'Rețele inginerești', d1: 'Electrice, apă, canalizare și încălzire,', d2: 'proiectate și racordate legal.' },
        { slot: 'svc-industrial', title: 'Construcții industriale', d1: 'Hale, depozite și spații comerciale,', d2: 'structuri metalice și beton armat.' },
        { slot: 'svc-terasamente', title: 'Terasamente', d1: 'Excavații, nivelări și compactări,', d2: 'utilaj propriu și transport inclus.' },
      ],
    };
  }
}
