import type { ProduceListing, Transaction, PriceData, CropDetail } from './types';

export const KENYAN_LOCATIONS: { [county: string]: string[] } = {
  'Baringo': ['Kabarnet', 'Eldama Ravine', 'Marigat'],
  'Bomet': ['Bomet', 'Sotik', 'Longisa'],
  'Bungoma': ['Bungoma', 'Kimilili', 'Webuye'],
  'Busia': ['Busia', 'Malaba', 'Nambale'],
  'Elgeyo Marakwet': ['Iten', 'Tambach', 'Kapsowar'],
  'Embu': ['Embu', 'Runyenjes', 'Siakago'],
  'Garissa': ['Garissa', 'Dadaab', 'Masalani'],
  'Homa Bay': ['Homa Bay', 'Mbita', 'Oyugis'],
  'Isiolo': ['Isiolo', 'Merti', 'Garbatulla'],
  'Kajiado': ['Kajiado', 'Ongata Rongai', 'Kitengela', 'Ngong'],
  'Kakamega': ['Kakamega', 'Mumias', 'Lugari'],
  'Kericho': ['Kericho', 'Litein', 'Kipkelion'],
  'Kiambu': ['Kiambu', 'Thika', 'Ruiru', 'Kikuyu'],
  'Kilifi': ['Kilifi', 'Malindi', 'Mtwapa', 'Watamu'],
  'Kirinyaga': ['Kerugoya', 'Kutus', 'Sagana'],
  'Kisii': ['Kisii', 'Ogembo', 'Suneka'],
  'Kisumu': ['Kisumu', 'Ahero', 'Maseno'],
  'Kitui': ['Kitui', 'Mwingi', 'Mutomo'],
  'Kwale': ['Kwale', 'Diani Beach', 'Ukunda'],
  'Laikipia': ['Nanyuki', 'Nyahururu', 'Rumuruti'],
  'Lamu': ['Lamu', 'Mpeketoni', 'Kiunga'],
  'Machakos': ['Machakos', 'Athi River', 'Mavoko'],
  'Makueni': ['Wote', 'Makindu', 'Emali'],
  'Mandera': ['Mandera', 'El Wak', 'Rhamu'],
  'Marsabit': ['Marsabit', 'Moyale', 'Laisamis'],
  'Meru': ['Meru', 'Maua', 'Nkubu'],
  'Migori': ['Migori', 'Rongo', 'Awendo'],
  'Mombasa': ['Mombasa Island', 'Changamwe', 'Likoni'],
  'Murang\'a': ['Murang\'a', 'Maragua', 'Kenol'],
  'Nairobi': ['Nairobi CBD', 'Westlands', 'Karen', 'Eastleigh'],
  'Nakuru': ['Nakuru', 'Naivasha', 'Gilgil', 'Njoro'],
  'Nandi': ['Kapsabet', 'Nandi Hills', 'Mosoriot'],
  'Narok': ['Narok', 'Kilgoris', 'Ololulunga'],
  'Nyamira': ['Nyamira', 'Keroka', 'Nyamusi'],
  'Nyandarua': ['Ol Kalou', 'Engineer', 'Njabini'],
  'Nyeri': ['Nyeri', 'Karatina', 'Othaya'],
  'Samburu': ['Maralal', 'Baragoi', 'Wamba'],
  'Siaya': ['Siaya', 'Bondo', 'Ugunja'],
  'Taita-Taveta': ['Voi', 'Mwatate', 'Taveta'],
  'Tana River': ['Hola', 'Garsen', 'Bura'],
  'Tharaka-Nithi': ['Chuka', 'Marimanti', 'Chogoria'],
  'Trans Nzoia': ['Kitale', 'Kimini', 'Endebess'],
  'Turkana': ['Lodwar', 'Kakuma', 'Lokichogio'],
  'Uasin Gishu': ['Eldoret', 'Moi\'s Bridge', 'Burnt Forest'],
  'Vihiga': ['Vihiga', 'Mbale', 'Luanda'],
  'Wajir': ['Wajir', 'Habaswein', 'Tarbaj'],
  'West Pokot': ['Kapenguria', 'Makutano', 'Ortum']
};


export const PRODUCE_LISTINGS: ProduceListing[] = [
  {
    id: 1,
    farmerName: 'Mary Wanjiku',
    farmerContact: '0712 345 678',
    farmerEmail: 'mary.wanjiku@sokofresh.dev',
    farmerAverageRating: 4.5,
    crop: 'Maize',
    quantity: '4500 Kg',
    priceValue: 36,
    priceUnit: '/ Kg',
    location: 'Thika, Kiambu',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=400&h=300&fit=crop',
    availabilityDate: '2024-08-15',
    buyerCompanyName: 'Nairobi Millers Ltd.',
  },
  {
    id: 2,
    farmerName: 'Peter Omondi',
    farmerContact: '0723 456 789',
    farmerEmail: 'peter.omondi@sokofresh.dev',
    farmerAverageRating: 4.8,
    crop: 'Tomatoes',
    quantity: '20 Crates',
    priceValue: 2500,
    priceUnit: '/ Crate',
    location: 'Kisumu, Kisumu',
    imageUrl: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=400&h=300&fit=crop',
    availabilityDate: '2024-08-10',
  },
  {
    id: 3,
    farmerName: 'Jane Cheptoo',
    farmerContact: '0734 567 890',
    farmerEmail: 'jane.cheptoo@sokofresh.dev',
    farmerAverageRating: 4.0,
    crop: 'Potatoes',
    quantity: '100 Bags',
    priceValue: 2800,
    priceUnit: '/ Bag',
    location: 'Eldoret, Uasin Gishu',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=400&h=300&fit=crop',
    availabilityDate: '2024-09-01',
  },
  {
    id: 4,
    farmerName: 'Samuel Kamau',
    farmerContact: '0745 678 901',
    farmerEmail: 'samuel.kamau@sokofresh.dev',
    farmerAverageRating: 5.0,
    crop: 'Cabbages',
    quantity: '200 Heads',
    priceValue: 50,
    priceUnit: '/ Head',
    location: 'Meru, Meru',
    imageUrl: 'https://images.unsplash.com/photo-1561587314-8a1c43922363?q=80&w=400&h=300&fit=crop',
    availabilityDate: '2024-08-20',
  },
   {
    id: 5,
    farmerName: 'David Koech',
    farmerContact: '0756 789 012',
    farmerEmail: 'david.koech@sokofresh.dev',
    farmerAverageRating: 0,
    crop: 'Green Beans',
    quantity: '30 Kg',
    priceValue: 150,
    priceUnit: '/ Kg',
    location: 'Webuye, Bungoma',
    imageUrl: 'https://images.unsplash.com/photo-1589301768297-cf861a0b3e5b?q=80&w=400&h=300&fit=crop',
    availabilityDate: '2024-08-12',
  },
  {
    id: 6,
    farmerName: 'Grace Akinyi',
    farmerContact: '0767 890 123',
    farmerEmail: 'grace.akinyi@sokofresh.dev',
    farmerAverageRating: 4.2,
    crop: 'Avocado',
    quantity: '5 Crates',
    priceValue: 3000,
    priceUnit: '/ Crate',
    location: 'Kisii, Kisii',
    imageUrl: 'https://images.unsplash.com/photo-1522841153545-167818cde5a8?q=80&w=400&h=300&fit=crop',
    availabilityDate: '2024-08-25',
  },
  {
    id: 7,
    farmerName: 'Esther Nyambura',
    farmerContact: '0778 901 234',
    farmerEmail: 'esther.nyambura@sokofresh.dev',
    farmerAverageRating: 0,
    crop: 'Sukuma Wiki (Kale)',
    quantity: '150 Bunches',
    priceValue: 20,
    priceUnit: '/ Bunch',
    location: 'Ruiru, Kiambu',
    imageUrl: 'https://images.unsplash.com/photo-1548035234-8903b9b46175?q=80&w=400&h=300&fit=crop',
    availabilityDate: '2024-08-11',
  },
  {
    id: 8,
    farmerName: 'John Ochieng',
    farmerContact: '0789 012 345',
    farmerEmail: 'john.ochieng@sokofresh.dev',
    farmerAverageRating: 3.8,
    crop: 'Onions',
    quantity: '40 Nets',
    priceValue: 1200,
    priceUnit: '/ Net',
    location: 'Voi, Taita-Taveta',
    imageUrl: 'https://images.unsplash.com/photo-1587049352851-d481dd13a163?q=80&w=400&h=300&fit=crop',
    availabilityDate: '2024-09-05',
  },
  {
    id: 9,
    farmerName: 'Daniel Mutua',
    farmerContact: '0790 123 456',
    farmerEmail: 'daniel.mutua@sokofresh.dev',
    farmerAverageRating: 4.1,
    crop: 'Beans',
    quantity: '60 Bags',
    priceValue: 6000,
    priceUnit: '/ Bag',
    location: 'Nyahururu, Laikipia',
    imageUrl: 'https://images.unsplash.com/photo-1572455120516-3e693b44c134?q=80&w=400&h=300&fit=crop',
    availabilityDate: '2024-09-10',
  },
];

export const TRANSACTIONS: Transaction[] = [
    { id: 'TXN001', crop: 'Maize', farmerEmail: 'mary.wanjiku@sokofresh.dev', buyer: { name: 'Alice Mwangi', company: 'Nairobi Millers Ltd.', contact: '0711223344', location: 'Nairobi CBD, Nairobi' }, price: 160000, quantity: '50 Bags', date: '2024-07-20', status: 'Completed', paymentMethod: 'M-Pesa', rating: 5 },
    { id: 'TXN002', crop: 'Tomatoes', farmerEmail: 'peter.omondi@sokofresh.dev', buyer: { name: 'Brian Koech', company: 'Fresh Produce Exporters', contact: '0722334455', location: 'Westlands, Nairobi' }, price: 50000, quantity: '20 Crates', date: '2024-07-18', status: 'Completed', paymentMethod: 'M-Pesa' },
    { id: 'TXN003', crop: 'Potatoes', farmerEmail: 'jane.cheptoo@sokofresh.dev', buyer: { name: 'Charles Otieno', company: 'Eldoret Market Wholesalers', contact: '0733445566', location: 'Eldoret, Uasin Gishu' }, price: 280000, quantity: '100 Bags', date: '2024-07-15', status: 'Completed', paymentMethod: 'M-Pesa', rating: 4 },
    { id: 'TXN004', crop: 'Cabbages', farmerEmail: 'samuel.kamau@sokofresh.dev', buyer: { name: 'Diana Wairimu', company: 'Local Restaurant Chain', contact: '0744556677', location: 'Nakuru, Nakuru' }, price: 10000, quantity: '200 Heads', date: '2024-07-22', status: 'Pending', paymentMethod: 'M-Pesa' },
    { id: 'TXN005', crop: 'Green Beans', farmerEmail: 'david.koech@sokofresh.dev', buyer: { name: 'Edward Barasa', company: 'City Grocers', contact: '0755667788', location: 'Kisumu, Kisumu' }, price: 4500, quantity: '30 Kg', date: '2024-07-10', status: 'Cancelled', paymentMethod: 'Bank Transfer' },
    { id: 'TXN006', crop: 'Avocado', farmerEmail: 'grace.akinyi@sokofresh.dev', buyer: { name: 'Faith Kemboi', company: 'Kakuzi PLC', contact: '0766778899', location: 'Thika, Kiambu' }, price: 15000, quantity: '5 Crates', date: '2024-07-25', status: 'Completed', paymentMethod: 'M-Pesa' },
    { id: 'TXN007', crop: 'Onions', farmerEmail: 'john.ochieng@sokofresh.dev', buyer: { name: 'George Kimani', company: 'City Market Retail', contact: '0777889900', location: 'Mombasa Island, Mombasa' }, price: 48000, quantity: '40 Nets', date: '2024-07-28', status: 'Pending', paymentMethod: 'M-Pesa' },
    { id: 'TXN008', crop: 'Maize', farmerEmail: 'mary.wanjiku@sokofresh.dev', buyer: { name: 'Hillary Kiprop', company: 'Self', contact: '0799887766', location: 'Karen, Nairobi' }, price: 6400, quantity: '2 Bags', date: '2024-07-29', status: 'Completed', paymentMethod: 'M-Pesa' },
];

const generateAllCountyPrices = (baseData: Omit<PriceData, 'name'>[]): PriceData[] => {
    const allCounties = Object.keys(KENYAN_LOCATIONS);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const baseCounties = ['Nairobi', 'Kisumu', 'Eldoret'];
    const otherCounties = allCounties.filter(c => !baseCounties.includes(c));

    return months.map((month, index) => {
        const monthData: PriceData = { name: month, ...baseData[index] };
        
        otherCounties.forEach(county => {
            const basePrice = monthData.Nairobi as number;
            // Create a simple, deterministic hash from the county name to generate a consistent variation
            let hash = 0;
            for (let i = 0; i < county.length; i++) {
                hash = county.charCodeAt(i) + ((hash << 5) - hash);
            }
            // Generate a variation between -15% and +15% based on the hash
            const variation = ((hash % 30) - 15) / 100;
            monthData[county] = Math.round(basePrice * (1 + variation));
        });
        
        return monthData;
    });
};

const MAIZE_BASE_PRICES = [
  { Nairobi: 3500, Kisumu: 3300, Eldoret: 3100 }, { Nairobi: 3600, Kisumu: 3400, Eldoret: 3200 },
  { Nairobi: 3400, Kisumu: 3200, Eldoret: 3000 }, { Nairobi: 3100, Kisumu: 2900, Eldoret: 2800 },
  { Nairobi: 3250, Kisumu: 3000, Eldoret: 2850 }, { Nairobi: 3200, Kisumu: 3100, Eldoret: 2900 },
  { Nairobi: 3300, Kisumu: 3150, Eldoret: 3000 }, { Nairobi: 3400, Kisumu: 3200, Eldoret: 3050 },
  { Nairobi: 3350, Kisumu: 3150, Eldoret: 3000 }, { Nairobi: 3300, Kisumu: 3100, Eldoret: 2950 },
  { Nairobi: 3400, Kisumu: 3200, Eldoret: 3050 }, { Nairobi: 3550, Kisumu: 3350, Eldoret: 3150 },
];

const TOMATOES_BASE_PRICES = [
  { Nairobi: 2800, Kisumu: 2600, Eldoret: 2500 }, { Nairobi: 3000, Kisumu: 2800, Eldoret: 2700 },
  { Nairobi: 2600, Kisumu: 2400, Eldoret: 2300 }, { Nairobi: 2400, Kisumu: 2200, Eldoret: 2100 },
  { Nairobi: 2500, Kisumu: 2300, Eldoret: 2200 }, { Nairobi: 2600, Kisumu: 2450, Eldoret: 2250 },
  { Nairobi: 2550, Kisumu: 2400, Eldoret: 2300 }, { Nairobi: 2700, Kisumu: 2500, Eldoret: 2400 },
  { Nairobi: 2800, Kisumu: 2600, Eldoret: 2500 }, { Nairobi: 2900, Kisumu: 2700, Eldoret: 2600 },
  { Nairobi: 3100, Kisumu: 2900, Eldoret: 2800 }, { Nairobi: 2950, Kisumu: 2750, Eldoret: 2650 },
];

const POTATOES_BASE_PRICES = [
  { Nairobi: 3100, Kisumu: 2900, Eldoret: 2800 }, { Nairobi: 3200, Kisumu: 3000, Eldoret: 2900 },
  { Nairobi: 2900, Kisumu: 2700, Eldoret: 2600 }, { Nairobi: 2700, Kisumu: 2500, Eldoret: 2400 },
  { Nairobi: 2800, Kisumu: 2650, Eldoret: 2500 }, { Nairobi: 2900, Kisumu: 2700, Eldoret: 2600 },
  { Nairobi: 2850, Kisumu: 2750, Eldoret: 2650 }, { Nairobi: 3000, Kisumu: 2800, Eldoret: 2700 },
  { Nairobi: 2950, Kisumu: 2750, Eldoret: 2650 }, { Nairobi: 2900, Kisumu: 2700, Eldoret: 2600 },
  { Nairobi: 3050, Kisumu: 2850, Eldoret: 2750 }, { Nairobi: 3150, Kisumu: 2950, Eldoret: 2850 },
];

const CABBAGES_BASE_PRICES = [
  { Nairobi: 5800, Kisumu: 5300, Eldoret: 5000 }, { Nairobi: 6000, Kisumu: 5500, Eldoret: 5200 },
  { Nairobi: 5000, Kisumu: 4700, Eldoret: 4500 }, { Nairobi: 4500, Kisumu: 4200, Eldoret: 4000 },
  { Nairobi: 5000, Kisumu: 4500, Eldoret: 4300 }, { Nairobi: 5200, Kisumu: 4800, Eldoret: 4500 },
  { Nairobi: 4800, Kisumu: 4600, Eldoret: 4400 }, { Nairobi: 5500, Kisumu: 5000, Eldoret: 4800 },
  { Nairobi: 5400, Kisumu: 4900, Eldoret: 4700 }, { Nairobi: 5300, Kisumu: 4800, Eldoret: 4600 },
  { Nairobi: 5600, Kisumu: 5100, Eldoret: 4900 }, { Nairobi: 5900, Kisumu: 5400, Eldoret: 5100 },
];

const BEANS_BASE_PRICES = [
  { Nairobi: 6500, Kisumu: 6300, Eldoret: 6200 }, { Nairobi: 6600, Kisumu: 6400, Eldoret: 6300 },
  { Nairobi: 6400, Kisumu: 6200, Eldoret: 6100 }, { Nairobi: 5800, Kisumu: 5600, Eldoret: 5500 },
  { Nairobi: 6000, Kisumu: 5800, Eldoret: 5700 }, { Nairobi: 6200, Kisumu: 6000, Eldoret: 5850 },
  { Nairobi: 6100, Kisumu: 5900, Eldoret: 5800 }, { Nairobi: 6300, Kisumu: 6100, Eldoret: 6000 },
  { Nairobi: 6250, Kisumu: 6050, Eldoret: 5950 }, { Nairobi: 6200, Kisumu: 6000, Eldoret: 5900 },
  { Nairobi: 6350, Kisumu: 6150, Eldoret: 6050 }, { Nairobi: 6550, Kisumu: 6350, Eldoret: 6250 },
];

const ONIONS_BASE_PRICES = [
  { Nairobi: 1300, Kisumu: 1200, Eldoret: 1100 }, { Nairobi: 1350, Kisumu: 1250, Eldoret: 1150 },
  { Nairobi: 1250, Kisumu: 1150, Eldoret: 1050 }, { Nairobi: 1100, Kisumu: 1000, Eldoret: 950 },
  { Nairobi: 1150, Kisumu: 1050, Eldoret: 1000 }, { Nairobi: 1200, Kisumu: 1100, Eldoret: 1050 },
  { Nairobi: 1250, Kisumu: 1150, Eldoret: 1100 }, { Nairobi: 1300, Kisumu: 1200, Eldoret: 1150 },
  { Nairobi: 1320, Kisumu: 1220, Eldoret: 1170 }, { Nairobi: 1280, Kisumu: 1180, Eldoret: 1130 },
  { Nairobi: 1350, Kisumu: 1250, Eldoret: 1200 }, { Nairobi: 1400, Kisumu: 1300, Eldoret: 1250 },
];

const SUKUMA_WIKI_BASE_PRICES = [ // Prices per 50 bunches
  { Nairobi: 1000, Kisumu: 950, Eldoret: 900 }, { Nairobi: 1050, Kisumu: 1000, Eldoret: 950 },
  { Nairobi: 950, Kisumu: 900, Eldoret: 850 }, { Nairobi: 900, Kisumu: 850, Eldoret: 800 },
  { Nairobi: 920, Kisumu: 870, Eldoret: 820 }, { Nairobi: 950, Kisumu: 900, Eldoret: 850 },
  { Nairobi: 1000, Kisumu: 950, Eldoret: 900 }, { Nairobi: 1020, Kisumu: 970, Eldoret: 920 },
  { Nairobi: 1050, Kisumu: 1000, Eldoret: 950 }, { Nairobi: 1100, Kisumu: 1050, Eldoret: 1000 },
  { Nairobi: 1080, Kisumu: 1030, Eldoret: 980 }, { Nairobi: 1120, Kisumu: 1070, Eldoret: 1020 },
];

const GREEN_BEANS_BASE_PRICES = [
  { Nairobi: 1600, Kisumu: 1500, Eldoret: 1400 }, { Nairobi: 1700, Kisumu: 1600, Eldoret: 1500 },
  { Nairobi: 1500, Kisumu: 1400, Eldoret: 1300 }, { Nairobi: 1400, Kisumu: 1300, Eldoret: 1200 },
  { Nairobi: 1550, Kisumu: 1450, Eldoret: 1350 }, { Nairobi: 1600, Kisumu: 1500, Eldoret: 1400 },
  { Nairobi: 1650, Kisumu: 1550, Eldoret: 1450 }, { Nairobi: 1700, Kisumu: 1600, Eldoret: 1500 },
  { Nairobi: 1680, Kisumu: 1580, Eldoret: 1480 }, { Nairobi: 1650, Kisumu: 1550, Eldoret: 1450 },
  { Nairobi: 1750, Kisumu: 1650, Eldoret: 1550 }, { Nairobi: 1800, Kisumu: 1700, Eldoret: 1600 },
];


export const ALL_PRICE_DATA: { [key: string]: { data: PriceData[], unit: string } } = {
    maize: { data: generateAllCountyPrices(MAIZE_BASE_PRICES), unit: 'KES per Bag' },
    tomatoes: { data: generateAllCountyPrices(TOMATOES_BASE_PRICES), unit: 'KES per Crate' },
    potatoes: { data: generateAllCountyPrices(POTATOES_BASE_PRICES), unit: 'KES per Bag' },
    cabbages: { data: generateAllCountyPrices(CABBAGES_BASE_PRICES), unit: 'KES per 100 Heads' },
    beans: { data: generateAllCountyPrices(BEANS_BASE_PRICES), unit: 'KES per Bag' },
    'green beans': { data: generateAllCountyPrices(GREEN_BEANS_BASE_PRICES), unit: 'KES per 10Kg Crate'},
    'sukuma wiki (kale)': { data: generateAllCountyPrices(SUKUMA_WIKI_BASE_PRICES), unit: 'KES per 50 Bunches'},
    onions: { data: generateAllCountyPrices(ONIONS_BASE_PRICES), unit: 'KES per Net' }
};

export const CROP_DETAILS_DATA: { [key: string]: CropDetail } = {
  maize: {
    id: 'maize',
    name: 'Maize',
    history: 'Maize (Zea mays), also known as corn, is a cereal grain first domesticated by indigenous peoples in southern Mexico about 10,000 years ago. It has become a staple food in many parts of the world, with the total production of maize surpassing that of wheat or rice.',
    commonPests: ['Maize stalk borer', 'Fall armyworm', 'Cutworms', 'Maize weevil'],
    optimalConditions: 'Maize grows best in warm, sunny conditions with well-drained loamy soil. It requires significant moisture, especially during the pollination and grain-filling stages. Ideal pH is between 5.8 and 6.8.',
    nutritionalValue: 'Rich in carbohydrates, fiber, vitamins (especially B vitamins), and minerals like magnesium and phosphorus. Yellow maize is a good source of antioxidants.',
    marketInfo: 'A staple food in Kenya, used for Ugali, Githeri, and animal feed. High demand in both local markets and from large-scale millers. Dry maize has a long shelf life, making it a stable commodity.',
    harvestingTips: 'Harvest when the silks have turned brown and the kernels are hard and dented. Allow the cobs to dry on the stalk for as long as possible before storing in a well-ventilated, dry place to prevent mold.',
    varieties: ['H614', 'H624', 'Pioneer', 'DH04']
  },
  tomatoes: {
    id: 'tomatoes',
    name: 'Tomatoes',
    history: 'The tomato (Solanum lycopersicum) is native to western South America. The Spanish first introduced tomatoes to Europe in the 16th century. Initially grown as ornamental plants, they became a culinary staple worldwide.',
    commonPests: ['Tomato hornworms', 'Aphids', 'Whiteflies', 'Tuta absoluta'],
    optimalConditions: 'Tomatoes thrive in full sun with fertile, well-drained soil. They prefer a slightly acidic pH (6.2-6.8). Consistent watering is crucial to prevent blossom-end rot and cracking.',
    nutritionalValue: 'Excellent source of Vitamin C, potassium, folate, and Vitamin K. They are also a major dietary source of the antioxidant lycopene, which has been linked to many health benefits.',
    marketInfo: 'High demand from households, restaurants, and processors for tomato paste and sauces. Prices can be volatile depending on the season. Common varieties like Anna F1 are popular for their long shelf life.',
    harvestingTips: 'Harvest when the fruit is firm and fully colored. For shipping, they can be picked at the "breaker stage" (when a tinge of pink is visible). Handle gently to avoid bruising.',
    varieties: ['Anna F1', 'Rio Grande', 'Kilele F1', 'Moneymaker']
  },
  potatoes: {
    id: 'potatoes',
    name: 'Potatoes',
    history: 'The potato (Solanum tuberosum) was first domesticated in the Andes region of South America over 7,000 years ago. It was introduced to Europe in the second half of the 16th century by the Spanish and is now the world\'s fourth-largest food crop.',
    commonPests: ['Potato tuber moth', 'Colorado potato beetle', 'Aphids', 'Late blight'],
    optimalConditions: 'Potatoes prefer cool weather and grow best in loose, well-drained, slightly acidic soil. They need consistent moisture but are susceptible to rot in waterlogged conditions. Full sun is ideal.',
    nutritionalValue: 'Good source of vitamins C and B6, manganese, phosphorus, niacin, and dietary fiber. The skin of the potato contains a good amount of fiber.',
    marketInfo: 'A key staple crop in Kenya, used for chips (fries), crisps, and as a main dish. High demand year-round. Major growing areas are in the highlands like Nyandarua and Elgeyo Marakwet.',
    harvestingTips: 'Harvest after the plant tops have yellowed and died back. Cure potatoes for about two weeks in a cool, dark place to allow skins to thicken, which improves storage life.',
    varieties: ['Shangi', 'Dutch Robijn', 'Asante', 'Kenya Karibu']
  },
  cabbages: {
    id: 'cabbages',
    name: 'Cabbages',
    history: 'Cabbage (Brassica oleracea) is a leafy green biennial plant, grown as an annual vegetable for its dense-leaved heads. It is descended from a wild field cabbage and has a long history of cultivation, dating back to ancient Greek and Roman times.',
    commonPests: ['Diamondback moth', 'Cabbage loopers', 'Aphids', 'Cutworms'],
    optimalConditions: 'Cabbages are cool-season crops that perform best in temperatures between 15°C and 20°C. They require fertile, well-drained soil with plenty of organic matter and consistent moisture.',
    nutritionalValue: 'Low in calories and rich in vitamins C and K. Also contains folate, manganese, and dietary fiber. Red cabbage contains anthocyanins, which are powerful antioxidants.',
    marketInfo: 'Widely consumed in Kenya, often cooked as a side dish (sukuma wiki style) or in salads. Demand is consistent in local markets. Relatively easy to transport.',
    harvestingTips: 'Harvest when the head is firm and solid. Cut the head at the base with a sharp knife, leaving the outer leaves to protect it. Can be stored for several weeks in a cool, humid environment.',
    varieties: ['Copenhagen Market', 'Gloria F1', 'Pruktor F1']
  },
   beans: {
    id: 'beans',
    name: 'Beans',
    history: 'Common beans (Phaseolus vulgaris) originated in Mesoamerica and have been cultivated for thousands of years. They are a vital source of protein for millions of people worldwide and are a staple in many cuisines.',
    commonPests: ['Bean weevil', 'Aphids', 'Bean fly', 'Rust'],
    optimalConditions: 'Beans thrive in well-drained soil with moderate rainfall and warm temperatures. As nitrogen-fixing legumes, they naturally improve the fertility of the soil they are planted in.',
    nutritionalValue: 'An excellent source of plant-based protein, dietary fiber, folate, iron, and magnesium. They are a cornerstone of a healthy and balanced diet.',
    marketInfo: 'High demand for dry beans (e.g., Rosecoco, Mwitemania) in Kenya for staple dishes like Githeri and Madondo. They store very well, making them a reliable, non-perishable commodity for farmers.',
    harvestingTips: 'Harvest when the pods are fully dry and brittle on the plant. Thresh the beans to separate them from the pods, then dry them further in the sun before storage to prevent weevil infestation and mold.',
    varieties: ['Rosecoco', 'Mwitemania', 'Wairimu', 'Nyayo']
  },
  'green beans': {
    id: 'green beans',
    name: 'Green Beans',
    history: 'Green beans are the unripe, young fruit of various cultivars of the common bean (Phaseolus vulgaris). They have been cultivated for thousands of years in the Americas and were introduced to Europe in the 16th century.',
    commonPests: ['Bean leaf beetle', 'Aphids', 'Spider mites', 'Bean rust'],
    optimalConditions: 'Green beans grow best in full sun with well-drained soil. They are relatively easy to grow and tolerate a range of soil types. They need consistent water, especially during flowering and pod development.',
    nutritionalValue: 'A good source of vitamin K, vitamin C, fiber, and vitamin A. They also provide some protein and iron.',
    marketInfo: 'Popular both for local consumption and for export, especially to European markets. The export market requires high-quality, blemish-free pods (French beans).',
    harvestingTips: 'Harvest when pods are young and tender, before the seeds inside have fully developed. Pick regularly to encourage the plant to produce more pods.',
    varieties: ['Amy', 'Teresa', 'Serengeti', 'Julia']
  },
  avocado: {
    id: 'avocado',
    name: 'Avocado',
    history: 'The avocado (Persea americana) is a tree native to south-central Mexico. It is a member of the flowering plant family Lauraceae. The fruit of the plant, also called an avocado, is botanically a large berry containing a single large seed.',
    commonPests: ['Avocado thrips', 'Mites', 'Fruit flies', 'Anthracnose'],
    optimalConditions: 'Avocado trees need well-drained soil and are sensitive to frost and wind. They thrive in tropical and subtropical climates. Young trees require regular watering.',
    nutritionalValue: 'Rich in healthy monounsaturated fats, fiber, potassium, and various vitamins like K, C, B5, and B6. They are known for being very nutrient-dense.',
    marketInfo: 'A major export crop for Kenya, with high demand in Europe and the Middle East. The Hass variety is particularly popular for export, while Fuerte is common in local markets.',
    harvestingTips: 'Harvest when mature, but still hard. Avocados ripen off the tree. The maturity can be checked by the color and size, depending on the variety. Use clippers to cut the stem, leaving a small piece attached to the fruit.',
    varieties: ['Hass', 'Fuerte', 'Kienyeji', 'Pinkerton']
  },
  'sukuma wiki (kale)': {
    id: 'sukuma wiki (kale)',
    name: 'Sukuma Wiki (Kale)',
    history: 'Kale (Brassica oleracea var. sabellica) is a variety of cabbage with green or purple leaves, in which the central leaves do not form a head. It is considered to be closer to wild cabbage than most domesticated forms of B. oleracea. In East Africa, it is known as Sukuma Wiki.',
    commonPests: ['Aphids', 'Cabbage worms', 'Flea beetles'],
    optimalConditions: 'Kale is a hardy, cool-season green that is easy to grow. It prefers full sun but can tolerate partial shade. It grows best in rich, well-drained soil.',
    nutritionalValue: 'Extremely high in Vitamin K and also a great source of Vitamins A and C. It\'s packed with antioxidants and provides a good amount of calcium and manganese.',
    marketInfo: 'A staple vegetable in every Kenyan household, ensuring constant demand. The name "Sukuma Wiki" literally means "to push the week," indicating its role in stretching food budgets.',
    harvestingTips: 'Harvest the outer leaves first, working your way towards the center. This allows the plant to continue producing new leaves from the center for a continuous harvest. Pick leaves when they are young and tender.',
    varieties: ['Thousand Headed', 'Collard Greens (often used interchangeably)', 'Marrow Stem']
  },
  onions: {
    id: 'onions',
    name: 'Onions',
    history: 'The onion (Allium cepa), also known as the bulb onion or common onion, is a vegetable that is the most widely cultivated species of the genus Allium. Its ancestral wild original is not known, but it is thought to have originated in central Asia.',
    commonPests: ['Onion maggots', 'Thrips', 'Downy mildew', 'Purple blotch'],
    optimalConditions: 'Onions grow best in fertile, well-drained soil with full sun. They are a cool-season crop and require consistent moisture for good bulb formation. Proper curing after harvest is essential for long storage.',
    nutritionalValue: 'Good source of vitamin C, vitamin B6, and potassium. They contain antioxidants and compounds that fight inflammation. Red onions are rich in anthocyanins.',
    marketInfo: 'A fundamental ingredient in Kenyan cuisine, leading to high and stable demand. Can be stored for long periods, allowing farmers to wait for better prices. Both bulb onions and spring onions have strong markets.',
    harvestingTips: 'Harvest when the tops begin to yellow and fall over. Pull the bulbs and let them cure in a warm, dry, and airy location for 2-3 weeks until the necks are dry and the skins are papery.',
    varieties: ['Red Creole', 'Bombay Red', 'Texas Grano', 'Jambar F1']
  }
};