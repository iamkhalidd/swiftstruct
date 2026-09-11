#!/usr/bin/env node
/**
 * Populates SwiftStruct with the presentation dataset by calling the real admin
 * API — `POST /properties`, `POST /projects`, `POST /projects/:id/updates` —
 * rather than writing to Postgres directly. Every record therefore passes the
 * same DTO validation, slug/reference generation and service logic that the
 * admin UI uses, so the data is production-shaped.
 *
 * Idempotent: any property whose title, or project whose name, already exists is
 * skipped, and so is any progress update whose title already exists on that
 * project. Safe to re-run.
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=... node scripts/populate-demo-content.mjs
 *   # or, with a token you already hold:
 *   SS_TOKEN=... node scripts/populate-demo-content.mjs
 *
 * Environment:
 *   SS_API_URL   defaults to http://localhost:4000/api
 *   SS_TOKEN     a pre-issued admin JWT (takes precedence over email/password)
 *   ADMIN_EMAIL / ADMIN_PASSWORD  used to log in if SS_TOKEN is absent
 *
 * Every Unsplash id below was verified to return a real image. Several
 * plausible-looking ids 404, and a 404 renders as a broken image because the
 * browser rejects the HTML error response.
 */

const API = (process.env.SS_API_URL ?? 'http://localhost:4000/api').replace(/\/+$/, '');

const u = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/** First image in each list becomes the primary. */
const imgs = (rows) =>
  rows.map(([id, caption], i) => ({ url: u(id), caption, isPrimary: i === 0 }));

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------
const properties = [
  {
    title: '5 Bedroom Fully Detached Duplex with Swimming Pool',
    propertyType: 'Detached Duplex',
    listingType: 'SALE',
    price: 285000000,
    location: 'Lekki Phase 1',
    city: 'Lekki',
    state: 'Lagos',
    bedrooms: 5,
    bathrooms: 6,
    parkingSpaces: 4,
    status: 'AVAILABLE',
    isFeatured: true,
    totalUnits: 1,
    availableUnits: 1,
    description:
      'A contemporary five-bedroom detached duplex on a 780 sqm corner plot in the heart of Lekki Phase 1. The home opens into a double-volume living area with floor-to-ceiling glazing, a fully fitted Italian kitchen, and a family lounge on the upper floor. All bedrooms are en-suite with fitted wardrobes. The compound accommodates four cars under a cantilevered carport and includes a two-room boys quarters and a private swimming pool with a paved entertainment deck.',
    amenities:
      'Swimming Pool, 24/7 Estate Security, Smart Home Automation, Fitted Kitchen, CCTV Surveillance, Balcony, Water Treatment Plant, Standby Generator',
    features:
      'Double Volume Living Room, Premium Porcelain Flooring, En-suite Bedrooms, Walk-in Closet, Two-Room Boys Quarters, Cantilevered Carport',
    images: imgs([
      ['photo-1600596542815-ffad4c1539a9', 'Front Elevation'],
      ['photo-1600607687939-ce8a6c25118c', 'Living Area'],
      ['photo-1600566753086-00f18fb6b3ea', 'Primary Bedroom'],
      ['photo-1600585154340-be6161a56a0c', 'Rear Elevation'],
    ]),
  },
  {
    title: 'Luxury 3 Bedroom Oceanfront Apartment',
    propertyType: 'Apartment',
    listingType: 'RENT',
    price: 18000000,
    location: 'Victoria Island',
    city: 'Lagos Island',
    state: 'Lagos',
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    status: 'AVAILABLE',
    isFeatured: true,
    totalUnits: 24,
    availableUnits: 6,
    description:
      'A high-floor three-bedroom apartment in a managed oceanfront tower on Victoria Island, offering uninterrupted Atlantic views through full-height curtain walling. The residence is delivered fully serviced with central air conditioning, a fitted European kitchen, and access to the tower amenities: swimming pool, gymnasium, residents lounge, and concierge desk. Two dedicated parking bays are allocated in the basement.',
    amenities:
      'Ocean View, Passenger Elevators, Fitness Centre, Swimming Pool, Concierge Service, Basement Parking, 24/7 Power, Access Control',
    features:
      'Floor to Ceiling Windows, Central Air Conditioning, Fitted Italian Kitchen, En-suite Bedrooms, Service Quarters Access',
    images: imgs([
      ['photo-1545324418-cc1a3fa10c00', 'Tower Façade'],
      ['photo-1600607687920-4e2a09cf159d', 'Living Room'],
      ['photo-1600566753190-17f0baa2a6c3', 'Kitchen'],
      ['photo-1560448204-e02f11c3d0e2', 'Balcony View'],
    ]),
  },
  {
    title: '4 Bedroom Semi-Detached Duplex',
    propertyType: 'Semi-Detached Duplex',
    listingType: 'SALE',
    price: 195000000,
    location: 'Old Ikoyi',
    city: 'Ikoyi',
    state: 'Lagos',
    bedrooms: 4,
    bathrooms: 5,
    parkingSpaces: 3,
    status: 'RESERVED',
    isFeatured: false,
    totalUnits: 1,
    availableUnits: 1,
    description:
      'A tastefully finished four-bedroom semi-detached duplex within a gated development in Old Ikoyi. The layout provides a formal living room, a separate family lounge, a fitted kitchen with pantry, and a study on the ground floor. Situated within walking distance of two international schools and with direct access to the Ikoyi link bridge.',
    amenities:
      'Gated Development, Estate Security, Water Treatment, Standby Generator, Playground, Visitor Parking',
    features:
      'Formal Living Room, Family Lounge, Fitted Kitchen with Pantry, Study Room, Guest Bedroom, Boys Quarters',
    images: imgs([
      ['photo-1613490493576-7fde63acd811', 'Front View'],
      ['photo-1600573472550-8090b5e0745e', 'Living Room'],
      ['photo-1600566752355-35792bedcfea', 'Master Suite'],
    ]),
  },
  {
    title: 'Grade-A Office Floor, 420 sqm',
    propertyType: 'Commercial Space',
    listingType: 'RENT',
    price: 32000000,
    location: 'Ikeja GRA',
    city: 'Ikeja',
    state: 'Lagos',
    bedrooms: 0,
    bathrooms: 6,
    parkingSpaces: 12,
    status: 'AVAILABLE',
    isFeatured: false,
    totalUnits: 12,
    availableUnits: 4,
    description:
      'An entire 420 sqm open-plan office floor within a Grade-A commercial building on Obafemi Awolowo Way, Ikeja GRA. The floor is delivered warm-shell with raised access flooring, VRF air conditioning, and dedicated fibre risers. The building provides a double-height lobby, three passenger lifts, a 500 kVA dedicated substation, and covered parking for 40 vehicles.',
    amenities:
      'Fibre Optic Ready, Dedicated Substation, VRF Air Conditioning, Three Passenger Lifts, Covered Parking, 24/7 Security, Fire Suppression',
    features:
      'Open Plan Layout, Raised Access Flooring, Flexible Partitioning, Executive Boardroom Provision, Kitchenette',
    images: imgs([
      ['photo-1497366754035-f200968a6e72', 'Office Floor'],
      ['photo-1497366811353-6870744d04b2', 'Workstations'],
      ['photo-1524758631624-e2822e304c36', 'Meeting Room'],
      ['photo-1590674899484-d5640e854abe', 'Building Lobby'],
    ]),
  },
  {
    title: '6 Bedroom Contemporary Mansion',
    propertyType: 'Mansion',
    listingType: 'SALE',
    price: 850000000,
    location: 'Banana Island',
    city: 'Ikoyi',
    state: 'Lagos',
    bedrooms: 6,
    bathrooms: 7,
    parkingSpaces: 6,
    status: 'AVAILABLE',
    isFeatured: true,
    totalUnits: 1,
    availableUnits: 1,
    description:
      'An architect-designed six-bedroom mansion on 1,100 sqm of prime Banana Island waterfront. The residence features a triple-volume entrance foyer, a private cinema, an indoor spa and gymnasium, a rooftop terrace lounge, and staff accommodation for four. Finishes include imported marble, bespoke joinery throughout, and a full smart-building management system.',
    amenities:
      'Private Jetty Access, Swimming Pool, Indoor Spa, Gymnasium, Private Cinema, Rooftop Terrace, Elevator, Solar Hybrid Power, 24/7 Security',
    features:
      'Triple Volume Foyer, Imported Marble Finishes, Bespoke Joinery, Smart Building System, Wine Cellar, Four Staff Rooms',
    images: imgs([
      ['photo-1512917774080-9991f1c4c750', 'Mansion Exterior'],
      ['photo-1616486338812-3dadae4b4ace', 'Formal Lounge'],
      ['photo-1616594039964-ae9021a400a0', 'Dining Area'],
      ['photo-1600585152220-90363fe7e115', 'Pool Deck'],
    ]),
  },
  {
    title: '2 Bedroom Serviced Apartment',
    propertyType: 'Apartment',
    listingType: 'RENT',
    price: 7500000,
    location: 'Yaba',
    city: 'Lagos Mainland',
    state: 'Lagos',
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    status: 'AVAILABLE',
    isFeatured: false,
    totalUnits: 36,
    availableUnits: 11,
    description:
      'A well-proportioned two-bedroom serviced apartment in a managed block minutes from the Yaba technology cluster. Rent includes facility management, water treatment, and 20 hours of daily backup power. The block provides a rooftop lounge, laundry room, and secure basement parking for residents.',
    amenities:
      'Facility Management Included, Water Treatment, 20-Hour Backup Power, Rooftop Lounge, Laundry Room, Basement Parking, CCTV',
    features:
      'Fitted Kitchen, En-suite Bedrooms, Built-in Wardrobes, Balcony, Intercom Access',
    images: imgs([
      ['photo-1568605114967-8130f3a36994', 'Building Exterior'],
      ['photo-1560185007-cde436f6a4d0', 'Living Area'],
      ['photo-1560185127-6ed189bf02f4', 'Bedroom'],
    ]),
  },
  {
    title: 'Serviced Residential Plots, 600 sqm',
    propertyType: 'Land',
    listingType: 'SALE',
    price: 12500000,
    location: 'Epe',
    city: 'Epe',
    state: 'Lagos',
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    status: 'AVAILABLE',
    isFeatured: false,
    totalUnits: 40,
    availableUnits: 22,
    description:
      'A limited release of fully serviced 600 sqm residential plots within a master-planned estate along the Epe corridor. The estate is fenced with a gatehouse, graded internal roads, drainage, and central water and power infrastructure. Title is a registered deed of assignment with an approved layout and survey plan available on request.',
    amenities:
      'Fenced Estate, Gatehouse, Graded Internal Roads, Storm Drainage, Central Water Scheme, Power Infrastructure',
    features:
      'Registered Deed of Assignment, Approved Layout, Survey Plan Available, Corner Plots Available, Flexible Payment Plan',
    images: imgs([
      ['photo-1500382017468-9049fed747ef', 'Estate Layout'],
      ['photo-1449824913935-59a10b8d2000', 'Access Road'],
    ]),
  },
  {
    title: '4 Bedroom Terrace with Boys Quarters',
    propertyType: 'Terrace',
    listingType: 'SALE',
    price: 145000000,
    location: 'Ajah',
    city: 'Lekki',
    state: 'Lagos',
    bedrooms: 4,
    bathrooms: 4,
    parkingSpaces: 2,
    status: 'AVAILABLE',
    isFeatured: true,
    totalUnits: 8,
    availableUnits: 2,
    description:
      'A four-bedroom mid-terrace home in a serviced development off the Lekki-Epe Expressway, Ajah. The house is arranged over three floors with a ground-floor guest suite, open-plan living and dining on the first floor, and three en-suite bedrooms above. The estate is fully serviced with estate power, treated water, and a managed waste system.',
    amenities:
      'Estate Power Supply, Treated Water, Managed Waste, Estate Security, Children Playground, Visitor Parking',
    features:
      'Three Floors, Ground Floor Guest Suite, Open Plan Living, En-suite Bedrooms, Boys Quarters, Fitted Kitchen',
    images: imgs([
      ['photo-1570129477492-45c003edd2be', 'Terrace Frontage'],
      ['photo-1590490360182-c33d57733427', 'Living Area'],
      ['photo-1615529182904-14819c35db37', 'Bedroom'],
    ]),
  },
  {
    title: 'Retail & Showroom Space, 260 sqm',
    propertyType: 'Retail Space',
    listingType: 'RENT',
    price: 28000000,
    location: 'Lekki-Epe Expressway',
    city: 'Lekki',
    state: 'Lagos',
    bedrooms: 0,
    bathrooms: 4,
    parkingSpaces: 10,
    status: 'SOLD',
    isFeatured: false,
    totalUnits: 6,
    availableUnits: 0,
    description:
      'A ground-floor retail and showroom unit with prominent frontage directly on the Lekki-Epe Expressway, within a mixed-use development anchored by a supermarket and two banks. The unit is delivered as a shell with a glass shopfront, a 3.6 m clear ceiling height, and dedicated staff facilities to the rear. Ample shared customer parking is available.',
    amenities:
      'Expressway Frontage, Shared Customer Parking, Anchor Tenants, 24/7 Security, Standby Power, Loading Bay',
    features:
      'Glass Shopfront, 3.6m Clear Ceiling, Staff Facilities, Shell Condition, High Footfall Location',
    images: imgs([
      ['photo-1556761175-b413da4baf72', 'Retail Frontage'],
      ['photo-1554469384-e58fac16e23a', 'Interior Shell'],
    ]),
  },
  {
    title: '3 Bedroom Flat',
    propertyType: 'Flat',
    listingType: 'RENT',
    price: 4500000,
    location: 'Surulere',
    city: 'Lagos Mainland',
    state: 'Lagos',
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    status: 'RENTED',
    isFeatured: false,
    totalUnits: 1,
    availableUnits: 1,
    description:
      'A refurbished three-bedroom flat on the first floor of a low-rise block in Surulere, within easy reach of the National Stadium and the Lagos mainland business districts. The flat has been recently repainted with new sanitary ware, a fitted kitchen, and upgraded electrical installation.',
    amenities:
      'Prepaid Metering, Borehole Water, Gated Compound, Security Post, Dedicated Parking',
    features:
      'Recently Refurbished, Fitted Kitchen, New Sanitary Ware, Upgraded Wiring, En-suite Master',
    images: imgs([
      ['photo-1523217582562-09d0def993a6', 'Block Exterior'],
      ['photo-1571055107559-3e67626fa8be', 'Living Room'],
    ]),
  },
  {
    title: 'Commercial Land, 1,200 sqm',
    propertyType: 'Land',
    listingType: 'SALE',
    price: 45000000,
    location: 'Ibeju-Lekki',
    city: 'Lekki',
    state: 'Lagos',
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    status: 'DRAFT',
    isFeatured: false,
    totalUnits: 1,
    availableUnits: 1,
    description:
      'A 1,200 sqm parcel of commercial land with expressway frontage in the rapidly developing Ibeju-Lekki corridor, suitable for a filling station, hospitality development, or mixed-use scheme. Documentation is being finalised ahead of publication.',
    amenities: 'Expressway Frontage, Motorable Access, Fenced Boundary',
    features: 'Commercial Zoning, Corner Piece, Survey Available',
    images: imgs([['photo-1477959858617-67f85cf4f1df', 'Site Overview']]),
  },
];

// ---------------------------------------------------------------------------
// Projects (each with its dated progress timeline)
// ---------------------------------------------------------------------------
const projects = [
  {
    name: 'The Crestwood Luxury Residences',
    projectType: 'Building & Construction',
    status: 'COMPLETED',
    progressPercent: 100,
    location: 'Banana Island, Ikoyi, Lagos',
    isFeatured: true,
    startDate: '2023-01-15',
    completionDate: '2024-06-30',
    description:
      'Design and build delivery of eight luxury townhouses on Banana Island, comprising subterranean parking, structural glazing, home automation, and high-specification architectural finishing across a 4,800 sqm site. The scheme was handed over two weeks ahead of the contractual completion date.',
    scope:
      'Full Structural Construction, Architectural Finishing, MEP Engineering, Landscaping, Smart Systems Installation, Subterranean Car Park',
    services: 'Building & Construction, Project Management, General Contracting',
    images: imgs([
      ['photo-1613490493576-7fde63acd811', 'Completed Façade'],
      ['photo-1600596542815-ffad4c1539a9', 'Townhouse Cluster'],
      ['photo-1503387762-592deb58ef4e', 'Site During Construction'],
    ]),
    updates: [
      {
        title: 'Structural frame topped out',
        createdAt: '2023-11-02',
        progressPercent: 55,
        description:
          'Final roof slab poured across all eight units. Blockwork and first-fix MEP commenced on schedule with no recorded lost-time incidents.',
        imageId: 'photo-1504307651254-35680f356dfd',
      },
      {
        title: 'External works and landscaping complete',
        createdAt: '2024-04-18',
        progressPercent: 92,
        description:
          'Paving, boundary treatment, and soft landscaping completed across the estate. Swimming pool commissioning and water treatment plant testing concluded successfully.',
        imageId: 'photo-1600585152220-90363fe7e115',
      },
      {
        title: 'Practical completion and client handover',
        createdAt: '2024-06-30',
        progressPercent: 100,
        description:
          'All eight townhouses handed over following a joint defects inspection with the client. Snag list closed out within ten working days. Operating manuals and as-built drawings issued.',
        imageId: 'photo-1600585154340-be6161a56a0c',
      },
    ],
  },
  {
    name: 'Apex Commercial Tower & Corporate Headquarters',
    projectType: 'Commercial Construction',
    status: 'ONGOING',
    progressPercent: 65,
    location: 'Victoria Island, Lagos',
    isFeatured: true,
    startDate: '2024-11-01',
    completionDate: '2027-01-30',
    description:
      'Construction of a ten-storey commercial tower on Victoria Island providing 9,400 sqm of multi-tenant office accommodation, three basement parking levels, and a double-height entrance lobby. The building targets EDGE energy efficiency certification through high-performance curtain walling and a VRF cooling strategy.',
    scope:
      'Civil Structural Works, Structural Steel, Curtain Wall Installation, MEP Systems, Basement Excavation, Project Supervision',
    services: 'General Contracting, Project Management, Real Estate Consultancy',
    images: imgs([
      ['photo-1486406146926-c627a92ad1ab', 'Elevation Rendering'],
      ['photo-1504307651254-35680f356dfd', 'Active Site'],
      ['photo-1541888946425-d81bb19240f5', 'Structural Frame'],
    ]),
    updates: [
      {
        title: 'Basement excavation and piling complete',
        createdAt: '2025-06-14',
        progressPercent: 22,
        description:
          'Three basement levels excavated to formation level with 186 bored piles installed and integrity tested. Basement slab waterproofing commenced.',
        imageId: 'photo-1504328345606-18bbc8c9d7d1',
      },
      {
        title: 'Superstructure topped out',
        createdAt: '2026-01-22',
        progressPercent: 45,
        description:
          'Final concrete pour on the level 10 slab completed. Structural steel for the roof plant enclosure delivered to site and erection underway.',
        imageId: 'photo-1541888946425-d81bb19240f5',
      },
      {
        title: 'MEP first fix across levels 1 to 6',
        createdAt: '2026-05-27',
        progressPercent: 58,
        description:
          'Ductwork, containment, and sprinkler mains installed to level 6. VRF outdoor units set on the level 3 plant deck ahead of schedule.',
        imageId: 'photo-1621905251189-08b45d6a269e',
      },
      {
        title: 'Curtain wall glazing reaches level 7',
        createdAt: '2026-08-19',
        progressPercent: 65,
        description:
          'Structural glazing installed and water-tested to floors 4 through 7. Panels for floors 8 to 10 are on site with installation scheduled to begin next week, weather permitting.',
        imageId: 'photo-1504307651254-35680f356dfd',
      },
    ],
  },
  {
    name: 'Heritage Estate Modernization & Renovation',
    projectType: 'Renovation & Remodeling',
    status: 'COMPLETED',
    progressPercent: 100,
    location: 'Lekki Phase 1, Lagos',
    isFeatured: false,
    startDate: '2023-06-01',
    completionDate: '2023-12-20',
    description:
      'Complete interior and structural retrofit of a 42-unit gated estate in Lekki Phase 1. The workscope covered structural strengthening, facade redesign, replacement of all MEP infrastructure, and the introduction of smart access control and estate-wide metering.',
    scope:
      'Structural Retrofitting, Plumbing & Electrical Overhaul, Facade Renewal, Interior Architectural Joinery, Access Control',
    services: 'Building & Construction, General Contracting, Project Management',
    images: imgs([
      ['photo-1580587771525-78b9dba3b914', 'Refurbished Elevation'],
      ['photo-1600607687920-4e2a09cf159d', 'Renovated Interior'],
    ]),
    updates: [
      {
        title: 'Facade renewal complete on blocks A to C',
        createdAt: '2023-09-11',
        progressPercent: 48,
        description:
          'Structural strengthening and render renewal completed across the first three blocks. New aluminium windows installed and water-tightness verified.',
        imageId: 'photo-1590856029826-c7a73142bbf1',
      },
      {
        title: 'Estate handed back to residents',
        createdAt: '2023-12-20',
        progressPercent: 100,
        description:
          'All 42 units reoccupied following commissioning of the new power, water, and access control systems. Phased handover completed without displacing residents.',
        imageId: 'photo-1580587771525-78b9dba3b914',
      },
    ],
  },
  {
    name: 'Metro Eco-Business Park Feasibility & Masterplanning',
    projectType: 'Real Estate Consultancy & Project Planning',
    status: 'UPCOMING',
    progressPercent: 15,
    location: 'Epe, Lagos State',
    isFeatured: true,
    startDate: '2026-01-10',
    completionDate: '2027-03-31',
    description:
      'Pre-construction advisory for a 5-hectare mixed-use eco-industrial park in Epe. The appointment covered site acquisition due diligence, environmental impact coordination, development feasibility, and preparation of the masterplan framework and indicative cost plan.',
    scope:
      'Development Feasibility Study, Land Acquisition Advisory, Masterplan Coordination, Environmental Impact Coordination, Project Budgeting',
    services: 'Real Estate Consultancy, Project Management',
    images: imgs([
      ['photo-1449824913935-59a10b8d2000', 'Site Aerial'],
      ['photo-1477959858617-67f85cf4f1df', 'Masterplan Zone'],
    ]),
    updates: [
      {
        title: 'Title verification and site survey concluded',
        createdAt: '2026-07-16',
        progressPercent: 15,
        description:
          'Land registry search completed with no adverse encumbrances recorded. Topographic and boundary surveys issued to the design team for masterplanning.',
        imageId: 'photo-1521791136064-7986c2920216',
      },
    ],
  },
  {
    name: 'Riverside Terraces — 24 Unit Residential Block',
    projectType: 'Building & Construction',
    status: 'ONGOING',
    progressPercent: 42,
    location: 'Ajah, Lagos',
    isFeatured: true,
    startDate: '2025-03-01',
    completionDate: '2026-12-15',
    description:
      'Turnkey construction of a 24-unit terraced housing scheme in Ajah comprising three blocks of eight units, with estate infrastructure including internal roads, storm drainage, a central water treatment plant, and a gatehouse.',
    scope:
      'Civil Works, Structural Construction, Estate Infrastructure, Storm Drainage, Water Treatment Plant, Architectural Finishing',
    services: 'Building & Construction, Project Management',
    images: imgs([
      ['photo-1570129477492-45c003edd2be', 'Block A Frontage'],
      ['photo-1512699355324-f07e3106dae5', 'Structure in Progress'],
      ['photo-1590856029826-c7a73142bbf1', 'Internal Roads'],
    ]),
    updates: [
      {
        title: 'Foundation and ground floor slabs complete',
        createdAt: '2025-11-21',
        progressPercent: 18,
        description:
          'Strip foundations and ground floor slabs completed across all three blocks. Sand-filling and hardcore verified by the supervising engineer.',
        imageId: 'photo-1512699355324-f07e3106dae5',
      },
      {
        title: 'Estate drainage and road sub-base laid',
        createdAt: '2026-04-09',
        progressPercent: 30,
        description:
          'Storm drainage run completed to 70% of the estate, with road sub-base compacted and tested on the main spine road.',
        imageId: 'photo-1504328345606-18bbc8c9d7d1',
      },
      {
        title: 'Blocks A and B roof structures completed',
        createdAt: '2026-08-28',
        progressPercent: 42,
        description:
          'Timber roof structures and stone-coated roofing completed on both blocks. Internal blockwork and first-fix plumbing now proceeding unit by unit.',
        imageId: 'photo-1590856029826-c7a73142bbf1',
      },
    ],
  },
  {
    name: 'Grandview Court Retail & Office Complex',
    projectType: 'Commercial Construction',
    status: 'ONGOING',
    progressPercent: 78,
    location: 'Ikeja, Lagos',
    isFeatured: false,
    startDate: '2024-08-01',
    completionDate: '2026-12-20',
    description:
      'Design and build of a four-storey mixed-use complex on Obafemi Awolowo Way, Ikeja, delivering ground and first floor retail alongside two upper floors of Grade-B office accommodation, with a shared basement and 90 parking bays.',
    scope:
      'Structural Construction, Facade Works, MEP Systems, Retail Fit-out Shell, Parking Deck, External Works',
    services: 'General Contracting, Project Management, Building & Construction',
    images: imgs([
      ['photo-1554469384-e58fac16e23a', 'Complex Elevation'],
      ['photo-1556761175-b413da4baf72', 'Retail Level'],
      ['photo-1497366811353-6870744d04b2', 'Office Floor'],
    ]),
    updates: [
      {
        title: 'Structure topped out at level 4',
        createdAt: '2025-10-16',
        progressPercent: 40,
        description:
          'Roof slab cast and structural frame completed. Waterproofing to the roof commenced ahead of the rainy season.',
        imageId: 'photo-1486406146926-c627a92ad1ab',
      },
      {
        title: 'Facade and external works underway',
        createdAt: '2026-04-30',
        progressPercent: 62,
        description:
          'Aluminium composite cladding complete on three elevations. Basement parking deck marked out and ventilation commissioned.',
        imageId: 'photo-1554469384-e58fac16e23a',
      },
      {
        title: 'Retail shell handed over to anchor tenant',
        createdAt: '2026-09-01',
        progressPercent: 78,
        description:
          'Ground and first floor retail shells handed over for tenant fit-out. Shopfront glazing and dedicated power supplies energised.',
        imageId: 'photo-1556761175-b413da4baf72',
      },
    ],
  },
  {
    name: 'Ikorodu Stormwater & Access Roads',
    projectType: 'Civil Engineering',
    status: 'ONGOING',
    progressPercent: 30,
    location: 'Ikorodu, Lagos State',
    isFeatured: false,
    startDate: '2025-09-01',
    completionDate: '2027-02-28',
    description:
      'Civil infrastructure package delivering 2.4 km of reinforced concrete stormwater drainage and 1.8 km of asphalt access roads, including culverts, kerbing, and street lighting, serving a new residential district in Ikorodu.',
    scope:
      'Reinforced Concrete Drainage, Culvert Construction, Road Sub-base and Asphalt, Kerbing, Street Lighting, Traffic Management',
    services: 'Civil Engineering, General Contracting, Project Management',
    images: imgs([
      ['photo-1504328345606-18bbc8c9d7d1', 'Drainage Excavation'],
      ['photo-1581092918056-0c4c3acd3789', 'Site Engineering'],
    ]),
    updates: [
      {
        title: 'Site establishment and setting out complete',
        createdAt: '2025-11-04',
        progressPercent: 8,
        description:
          'Site offices, plant yard, and haul routes established. Survey setting out verified against the issued alignment drawings.',
        imageId: 'photo-1581092160562-40aa08e78837',
      },
      {
        title: 'Drainage run reaches 1.1 km',
        createdAt: '2026-07-22',
        progressPercent: 30,
        description:
          'Reinforced concrete drainage completed over 1.1 km of the 2.4 km alignment. Three of five culverts cast and backfilled.',
        imageId: 'photo-1581092918056-0c4c3acd3789',
      },
    ],
  },
  {
    name: 'St. Augustine Medical Centre',
    projectType: 'Building & Construction',
    status: 'COMPLETED',
    progressPercent: 100,
    location: 'Surulere, Lagos',
    isFeatured: false,
    startDate: '2022-05-01',
    completionDate: '2023-10-30',
    description:
      'Construction of a three-storey, 60-bed medical centre in Surulere comprising consultation suites, two operating theatres, diagnostic imaging, a maternity wing, and a rooftop plant deck. The building was delivered with full medical gas reticulation and a dedicated 500 kVA substation.',
    scope:
      'Structural Construction, Medical Gas Reticulation, Cleanroom Theatres, MEP Systems, Electrical Substation, Architectural Finishing',
    services: 'Building & Construction, Project Management, General Contracting',
    images: imgs([
      ['photo-1583608205776-bfd35f0d9f83', 'Completed Centre'],
      ['photo-1581094794329-c8112a89af12', 'Services Installation'],
    ]),
    updates: [
      {
        title: 'Rooftop plant and substation energised',
        createdAt: '2023-06-08',
        progressPercent: 70,
        description:
          'Rooftop AHUs and the 500 kVA substation energised and load-tested. Medical gas reticulation installed through all three floors.',
        imageId: 'photo-1581094794329-c8112a89af12',
      },
      {
        title: 'Commissioning and clinical handover',
        createdAt: '2023-10-30',
        progressPercent: 100,
        description:
          'Medical gas systems pressure-tested and certified. Operating theatres validated for air changes, and the facility handed over to clinical staff.',
        imageId: 'photo-1583608205776-bfd35f0d9f83',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// API plumbing
// ---------------------------------------------------------------------------
async function request(token, path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const raw = await res.text();
  let body;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
    body = raw;
  }
  if (!res.ok) {
    const message = body?.message ?? raw;
    throw new Error(
      `${options.method ?? 'GET'} ${path} -> ${res.status}: ${
        Array.isArray(message) ? message.join('; ') : message
      }`,
    );
  }
  return body;
}

async function getToken() {
  if (process.env.SS_TOKEN) return process.env.SS_TOKEN;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('Set SS_TOKEN, or both ADMIN_EMAIL and ADMIN_PASSWORD.');
  }
  const data = await request(null, '/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return data.accessToken;
}

const propertyPayload = (p) => ({
  title: p.title,
  description: p.description,
  propertyType: p.propertyType,
  listingType: p.listingType,
  price: p.price,
  currency: 'NGN',
  location: p.location,
  city: p.city,
  state: p.state,
  bedrooms: p.bedrooms,
  bathrooms: p.bathrooms,
  parkingSpaces: p.parkingSpaces,
  status: p.status,
  isFeatured: p.isFeatured,
  totalUnits: p.totalUnits,
  availableUnits: p.availableUnits,
  amenities: p.amenities,
  features: p.features,
  images: p.images,
});

const projectPayload = (p) => ({
  name: p.name,
  description: p.description,
  location: p.location,
  projectType: p.projectType,
  status: p.status,
  scope: p.scope,
  services: p.services,
  progressPercent: p.progressPercent,
  startDate: p.startDate,
  completionDate: p.completionDate,
  isFeatured: p.isFeatured,
  images: p.images,
});

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
async function main() {
  const token = await getToken();
  console.log(`API: ${API}`);

  const existingProps = await request(token, '/properties?limit=100');
  const propTitles = new Set((existingProps.data ?? []).map((p) => p.title));

  // Created oldest-last, because listings are returned newest-first. Reversing
  // means the flagship entries in the array above appear first on the site.
  let createdProps = 0;
  let skippedProps = 0;
  console.log('\nProperties');
  for (const p of [...properties].reverse()) {
    if (propTitles.has(p.title)) {
      skippedProps += 1;
      console.log(`  = skipped (exists): ${p.title}`);
      continue;
    }
    const created = await request(token, '/properties', {
      method: 'POST',
      body: JSON.stringify(propertyPayload(p)),
    });
    createdProps += 1;
    console.log(
      `  + ${created.reference}  ${created.status.padEnd(9)}  ${created.totalUnits - created.availableUnits}/${created.totalUnits} taken  ${created.title}`,
    );
  }

  const existingProjects = await request(token, '/projects?limit=100');
  const byName = new Map((existingProjects.data ?? []).map((p) => [p.name, p]));

  let createdProjects = 0;
  let skippedProjects = 0;
  let createdUpdates = 0;
  let skippedUpdates = 0;

  console.log('\nProjects');
  for (const p of [...projects].reverse()) {
    let project = byName.get(p.name);
    if (project) {
      skippedProjects += 1;
      console.log(`  = skipped (exists): ${p.name}`);
    } else {
      project = await request(token, '/projects', {
        method: 'POST',
        body: JSON.stringify(projectPayload(p)),
      });
      createdProjects += 1;
      console.log(`  + ${project.reference}  ${project.status.padEnd(9)}  ${project.name}`);
    }

    if (!p.updates?.length) continue;

    const existing = await request(token, `/projects/${project.id}/updates`);
    const seen = new Set((existing ?? []).map((upd) => upd.title));

    // Posted oldest first so each update's progressPercent rolls forward
    // correctly onto the parent project, ending at its intended value.
    for (const upd of p.updates) {
      if (seen.has(upd.title)) {
        skippedUpdates += 1;
        continue;
      }
      await request(token, `/projects/${project.id}/updates`, {
        method: 'POST',
        body: JSON.stringify({
          title: upd.title,
          description: upd.description,
          imageUrl: u(upd.imageId),
          progressPercent: upd.progressPercent,
          createdAt: upd.createdAt,
        }),
      });
      createdUpdates += 1;
      console.log(`      · ${upd.createdAt}  ${upd.progressPercent}%  ${upd.title}`);
    }
  }

  console.log('\n--- summary ---');
  console.log(
    `properties: ${createdProps} created, ${skippedProps} skipped (of ${properties.length})`,
  );
  console.log(
    `projects:   ${createdProjects} created, ${skippedProjects} skipped (of ${projects.length})`,
  );
  console.log(`updates:    ${createdUpdates} created, ${skippedUpdates} skipped`);
}

main().catch((err) => {
  console.error('\nFAILED:', err.message);
  process.exit(1);
});
