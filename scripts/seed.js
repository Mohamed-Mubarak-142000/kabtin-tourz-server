/**
 * Idempotent seed script.
 * Run with: npm run seed
 *
 * - Creates the first admin from ADMIN_USERNAME/ADMIN_PASSWORD when needed.
 * - Upserts the Settings singleton with Arabic website content and hero images.
 * - Upserts branches, trips, testimonials, and FAQs without duplicating records.
 */
const mongoose = require('mongoose');
const env = require('../src/config/env');

const Admin = require('../src/models/Admin');
const Settings = require('../src/models/Settings');
const Branch = require('../src/models/Branch');
const Trip = require('../src/models/Trip');
const Testimonial = require('../src/models/Testimonial');
const Faq = require('../src/models/Faq');

const img = {
  heroHajj: '/hajj-umrah/hajj-kaaba-hero.png',
  heroUmrah: '/hajj-umrah/umrah-kaaba-evening-hero.png',
  mina: '/hajj-umrah/hajj-mina-tents-card.png',
  kiswah: '/hajj-umrah/kaaba-kiswah-detail-card.png',
  hajjPremium: '/seed-images/trip-hajj-premium-haram.png',
  umrahEconomy: '/seed-images/trip-umrah-economy-haram.png',
  umrahVip: '/seed-images/trip-umrah-vip-hotel.png',
  umrahFamily: '/seed-images/trip-umrah-family-haram.png',
  flights: '/seed-images/trip-flights-saudi-airport.png',
  sharm: '/seed-images/trip-sharm-red-sea-resort.png',
  turkey: '/seed-images/trip-turkey-istanbul-bursa.png',
  visa: '/seed-images/trip-visa-documents.png',
};

const legacyTripSlugs = [
  'rhlh-shrm-alshykh-4-ayam',
  'hjz-tdhakr-tyran-alqahrh-jdh',
  'brnamj-alhj-alshaml-1447h-fndq-5-njwm',
  'rhlh-trkya-istnbwl-wbwrsh-7-ayam',
  'baqh-alamrh-alaqtsadyh-10-ayam',
  'baqh-alamrh-vip-fnadq-alabraj',
  'brnamj-alamrh-alaaelyh-fy-alijazh-alsyfyh',
  'astkhraj-tashyrh-shnghn-syahyh',
];

const legacyFaqQuestions = [
  'ما هي المستندات المطلوبة للتقديم على تأشيرة الحج أو العمرة؟',
  'هل يمكن الدفع بالتقسيط لبرامج الحج والعمرة؟',
  'كم تستغرق مدة استخراج تأشيرة العمرة؟',
  'هل يوجد مرافقين خلال رحلة الحج والعمرة؟',
  'كيف يمكنني حجز إحدى الرحلات السياحية؟',
];

async function cleanupLegacySeedData() {
  const [trips, faqs] = await Promise.all([
    Trip.deleteMany({ slug: { $in: legacyTripSlugs }, images: { $size: 0 } }),
    Faq.deleteMany({ question: { $in: legacyFaqQuestions } }),
  ]);

  if (trips.deletedCount || faqs.deletedCount) {
    console.log(
      `[seed] Removed legacy seed data: ${trips.deletedCount} trips, ${faqs.deletedCount} FAQs.`
    );
  }
}

async function seedAdmin() {
  const existing = await Admin.findOne({});
  if (existing) {
    console.log(`[seed] Admin already exists (${existing.username}) - skipping.`);
    return;
  }

  const passwordHash = await Admin.hashPassword(env.ADMIN_PASSWORD);
  await Admin.create({ username: env.ADMIN_USERNAME, passwordHash });
  console.log(`[seed] Created admin user "${env.ADMIN_USERNAME}".`);
}

async function seedSettings() {
  const settings = {
    hero: {
      title: 'كابتن تورز لخدمات الحج والعمرة والسياحة',
      subtitle:
        'رحلتك إلى بيت الله الحرام تبدأ بتنظيم مطمئن، متابعة دقيقة، وباقات تناسب كل احتياج من أول الاستشارة حتى العودة.',
      images: [img.heroHajj, img.heroUmrah, img.hajjPremium],
    },
    phones: ['0103 304 6005', '01003736779', '01287783858'],
    whatsappNumbers: ['01069569024'],
    socialLinks: {
      facebook: 'https://facebook.com/captaintours',
      instagram: 'https://instagram.com/captaintours',
      youtube: '',
      tiktok: '',
    },
    stats: {
      years: 15,
      clients: 12000,
      branchesCount: 3,
      googleRating: 4.7,
    },
    about:
      'كابتن تورز شركة سياحة وسفر متخصصة في تنظيم رحلات الحج والعمرة، مع خدمات متكاملة لحجز الطيران، التأشيرات، والسياحة الداخلية والخارجية. نركز على وضوح البرنامج، جودة الإقامة، وسرعة المتابعة قبل السفر وأثناء الرحلة.',
  };

  await Settings.findByIdAndUpdate(
    Settings.SINGLETON_ID,
    { $set: settings },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );
  console.log('[seed] Settings singleton upserted.');
}

async function upsertMany(Model, key, records, label) {
  let changed = 0;
  for (const record of records) {
    await Model.findOneAndUpdate(
      { [key]: record[key] },
      { $set: record },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
    changed += 1;
  }
  console.log(`[seed] Upserted ${changed} ${label}.`);
}

async function seedBranches() {
  const branches = [
    {
      name: 'الفرع الرئيسي - القاهرة',
      address: 'شارع رمسيس، وسط البلد، القاهرة',
      phone: '0103 304 6005',
      location: { lat: 30.0592, lng: 31.2461 },
      googleRating: 4.8,
      mapLink: 'https://maps.google.com/?q=30.0592,31.2461',
    },
    {
      name: 'فرع جنزور',
      address: 'شارع الجمهورية، جنزور',
      phone: '01003736779',
      location: { lat: 32.7856, lng: 13.0192 },
      googleRating: 4.6,
      mapLink: 'https://maps.google.com/?q=32.7856,13.0192',
    },
    {
      name: 'فرع المنوفية',
      address: 'شارع سعد زغلول، شبين الكوم، المنوفية',
      phone: '01287783858',
      location: { lat: 30.5583, lng: 31.0117 },
      googleRating: 4.7,
      mapLink: 'https://maps.google.com/?q=30.5583,31.0117',
    },
  ];

  await upsertMany(Branch, 'name', branches, 'branches');
}

async function seedTrips() {
  const trips = [
    {
      title: 'برنامج الحج الشامل 1447هـ - إقامة 5 نجوم',
      slug: 'hajj-premium-1447',
      category: 'hajj',
      price: 145000,
      currency: 'EGP',
      duration: '25 يوم',
      hotelInfo: 'إقامة فندقية 5 نجوم قريبة من الحرمين مع مخيمات منظمة في المشاعر.',
      includes: [
        'تأشيرة الحج',
        'تذاكر الطيران ذهاب وعودة',
        'إقامة مكة والمدينة',
        'مخيمات منى وعرفات',
        'وجبات يومية',
        'مشرف مرافق طوال الرحلة',
      ],
      images: [img.hajjPremium, img.mina, img.heroHajj],
      location: { lat: 21.4225, lng: 39.8262, address: 'مكة المكرمة - الحرم المكي' },
      description:
        'باقة حج متكاملة لمن يبحث عن أعلى مستوى من التنظيم والراحة، تشمل متابعة قبل السفر، إقامة مميزة، وتنقلات مريحة بين المشاعر المقدسة.',
      featured: true,
      published: true,
    },
    {
      title: 'برنامج الحج الاقتصادي 1447هـ - مخيمات منى',
      slug: 'hajj-economy-mina-1447',
      category: 'hajj',
      price: 98000,
      currency: 'EGP',
      duration: '21 يوم',
      hotelInfo: 'إقامة عملية قريبة من مسارات المناسك مع مخيمات مجهزة في منى.',
      includes: [
        'تأشيرة الحج',
        'تذاكر الطيران',
        'مخيمات منى وعرفات',
        'نقل داخلي مكيف',
        'وجبات أساسية',
        'إرشاد ومتابعة للمناسك',
      ],
      images: [img.mina, img.hajjPremium],
      location: { lat: 21.4133, lng: 39.8933, address: 'منى - مكة المكرمة' },
      description:
        'برنامج حج اقتصادي يركز على الأساسيات المهمة: تنظيم واضح، مخيمات مرتبة، ومشرفين يساعدون الحجاج خطوة بخطوة.',
      featured: false,
      published: true,
    },
    {
      title: 'باقة العمرة الاقتصادية - 10 أيام',
      slug: 'umrah-economy-10-days',
      category: 'umrah',
      price: 18500,
      currency: 'EGP',
      duration: '10 أيام',
      hotelInfo: 'فندق 3 نجوم على مسافة مناسبة من الحرم مع انتقالات منتظمة.',
      includes: [
        'تأشيرة العمرة',
        'تذاكر الطيران',
        'الإقامة الفندقية',
        'الانتقال من وإلى المطار',
        'متابعة قبل السفر',
      ],
      images: [img.umrahEconomy, img.heroUmrah],
      location: { lat: 21.4225, lng: 39.8262, address: 'مكة المكرمة' },
      description:
        'باقة عمرة مناسبة للأفراد والعائلات بسعر متوازن وخدمات أساسية واضحة، مع متابعة للحجوزات حتى نهاية الرحلة.',
      featured: true,
      published: true,
    },
    {
      title: 'باقة العمرة VIP - فنادق مطلة على الحرم',
      slug: 'umrah-vip-haram-view',
      category: 'umrah',
      price: 42000,
      currency: 'EGP',
      duration: '14 يوم',
      hotelInfo: 'إقامة فاخرة قريبة من الحرم مع إمكانية اختيار غرف بإطلالة مميزة.',
      includes: [
        'تأشيرة العمرة',
        'إقامة 5 نجوم',
        'انتقالات خاصة',
        'مندوب خاص للمجموعة',
        'زيارة المعالم الدينية',
      ],
      images: [img.umrahVip, img.kiswah],
      location: { lat: 21.4225, lng: 39.8262, address: 'مكة المكرمة - المنطقة المركزية' },
      description:
        'تجربة عمرة فاخرة لمن يريد راحة أعلى وتفاصيل أكثر خصوصية، من اختيار الفندق حتى ترتيب الزيارات والتنقلات.',
      featured: true,
      published: true,
    },
    {
      title: 'برنامج العمرة العائلية في الإجازة الصيفية',
      slug: 'family-umrah-summer',
      category: 'umrah',
      price: 22000,
      currency: 'EGP',
      duration: '12 يوم',
      hotelInfo: 'غرف عائلية في فندق 4 نجوم قريب من الحرم مع ترتيب مناسب للأطفال.',
      includes: [
        'تأشيرات العمرة للعائلة',
        'تذاكر الطيران',
        'غرف عائلية',
        'مرافقة خاصة للعائلات',
        'تنسيق مواعيد الزيارة والتنقل',
      ],
      images: [img.umrahFamily, img.heroUmrah],
      location: { lat: 21.4225, lng: 39.8262, address: 'مكة المكرمة والمدينة المنورة' },
      description:
        'برنامج مريح للعائلات يجمع بين أداء العمرة وتنظيم يناسب الأطفال وكبار السن، مع اهتمام بتفاصيل الغرف والتنقلات.',
      featured: false,
      published: true,
    },
    {
      title: 'حجز تذاكر طيران القاهرة - جدة',
      slug: 'cairo-jeddah-flights',
      category: 'flights',
      price: 8500,
      currency: 'EGP',
      duration: 'ذهاب وعودة',
      hotelInfo: '',
      includes: [
        'اختيار أفضل مواعيد الطيران',
        'مقارنة الأسعار المتاحة',
        'إمكانية إضافة وزن حسب الطلب',
        'متابعة التعديل أو الاسترجاع',
      ],
      images: [img.flights],
      location: { lat: 30.1123, lng: 31.4000, address: 'مطار القاهرة الدولي' },
      description:
        'خدمة حجز تذاكر الطيران إلى جدة والمدينة المنورة بأفضل الخيارات المتاحة، مع متابعة تفاصيل الرحلة حتى إصدار التذكرة.',
      featured: false,
      published: true,
    },
    {
      title: 'رحلة شرم الشيخ - 4 أيام',
      slug: 'sharm-el-sheikh-4-days',
      category: 'domestic',
      price: 6500,
      currency: 'EGP',
      duration: '4 أيام / 3 ليالي',
      hotelInfo: 'منتجع 5 نجوم على البحر الأحمر بنظام نصف إقامة أو كل شامل حسب الاختيار.',
      includes: [
        'الإقامة الفندقية',
        'الإفطار والعشاء',
        'الانتقال من وإلى المطار',
        'اختيار رحلات بحرية إضافية',
      ],
      images: [img.sharm],
      location: { lat: 27.9158, lng: 34.3299, address: 'شرم الشيخ - جنوب سيناء' },
      description:
        'عطلة داخلية قصيرة على البحر الأحمر تناسب العائلات والأزواج، مع منتجعات مريحة ومياه صافية وأنشطة اختيارية.',
      featured: true,
      published: true,
    },
    {
      title: 'رحلة تركيا - إسطنبول وبورصة',
      slug: 'turkey-istanbul-bursa-7-days',
      category: 'international',
      price: 32000,
      currency: 'EGP',
      duration: '7 أيام / 6 ليالي',
      hotelInfo: 'فنادق 4 نجوم في إسطنبول وبورصة مع إفطار يومي.',
      includes: [
        'تذاكر الطيران',
        'الإقامة الفندقية',
        'الإفطار يوميا',
        'جولات سياحية مع مرشد',
        'تنقلات داخلية',
      ],
      images: [img.turkey],
      location: { lat: 41.0082, lng: 28.9784, address: 'إسطنبول وبورصة - تركيا' },
      description:
        'برنامج سياحي متكامل لاكتشاف إسطنبول وبورصة، يجمع بين المزارات التاريخية والطبيعة والأسواق بتنسيق مريح.',
      featured: true,
      published: true,
    },
    {
      title: 'استخراج تأشيرة شنغن سياحية',
      slug: 'schengen-tourist-visa',
      category: 'visa',
      price: 4500,
      currency: 'EGP',
      duration: 'من 10 إلى 15 يوم عمل',
      hotelInfo: '',
      includes: [
        'استشارة مجانية',
        'مراجعة المستندات',
        'حجز موعد السفارة',
        'تجهيز ملف التقديم',
        'متابعة حالة الطلب',
      ],
      images: [img.visa],
      location: { lat: 30.0444, lng: 31.2357, address: 'القاهرة - خدمات التأشيرات' },
      description:
        'خدمة تجهيز ومراجعة ملف تأشيرة شنغن السياحية باهتمام بالتفاصيل المطلوبة، لتقليل الأخطاء وتسريع خطوات التقديم.',
      featured: false,
      published: true,
    },
  ];

  await upsertMany(Trip, 'slug', trips, 'trips');
}

async function seedTestimonials() {
  const testimonials = [
    {
      name: 'أحمد السيد',
      text: 'رحلة العمرة كانت منظمة جدا من أول الحجز لحد العودة. الفندق مناسب، والمشرف كان متابع معانا في كل خطوة.',
      rating: 5,
      source: 'facebook',
      avatar: '',
    },
    {
      name: 'منى عبد الرحمن',
      text: 'حجزنا برنامج الحج مع كابتن تورز وكانت التفاصيل واضحة من البداية. أكثر حاجة فرقت معانا المتابعة وقت المناسك.',
      rating: 5,
      source: 'google',
      avatar: '',
    },
    {
      name: 'محمود فتحي',
      text: 'استخراج التأشيرة كان سريع ومنظم، راجعوا الورق معايا قبل التقديم ووضحوا لي كل المطلوب.',
      rating: 4,
      source: 'facebook',
      avatar: '',
    },
    {
      name: 'سارة إبراهيم',
      text: 'رحلة شرم الشيخ كانت جميلة والفندق ممتاز. التنظيم كان مريح والأسعار واضحة بدون مفاجآت.',
      rating: 5,
      source: 'google',
      avatar: '',
    },
  ];

  await upsertMany(Testimonial, 'name', testimonials, 'testimonials');
}

async function seedFaqs() {
  const faqs = [
    {
      question: 'ما المستندات المطلوبة للتقديم على الحج أو العمرة؟',
      answer:
        'عادة نحتاج إلى جواز سفر سار لمدة لا تقل عن 6 أشهر، صور شخصية حديثة، وشهادات التطعيم المطلوبة، مع أي مستندات إضافية حسب الموسم ونوع البرنامج.',
      order: 1,
    },
    {
      question: 'هل توجد باقات تناسب العائلات وكبار السن؟',
      answer:
        'نعم، نوفر برامج بإقامة قريبة وانتقالات مريحة ومشرفين مرافقين، ويمكننا ترشيح الباقة الأنسب حسب عدد الأفراد والميزانية.',
      order: 2,
    },
    {
      question: 'كم تستغرق تأشيرة العمرة؟',
      answer:
        'غالبا تستغرق من 5 إلى 10 أيام عمل بعد اكتمال المستندات، وقد تختلف المدة حسب ضغط الموسم وتعليمات الجهات المختصة.',
      order: 3,
    },
    {
      question: 'هل يمكن حجز الطيران فقط بدون باقة كاملة؟',
      answer:
        'نعم، نوفر حجز تذاكر الطيران بشكل مستقل، ويمكن إضافة خدمات أخرى مثل التأشيرة أو الفندق أو الانتقالات عند الحاجة.',
      order: 4,
    },
    {
      question: 'كيف أبدأ الحجز؟',
      answer:
        'يمكنك التواصل معنا عبر الهاتف أو واتساب، وسنراجع معك الوجهة والميزانية وعدد المسافرين ثم نرسل أنسب الخيارات المتاحة.',
      order: 5,
    },
  ];

  await upsertMany(Faq, 'question', faqs, 'FAQs');
}

async function main() {
  console.log('[seed] Connecting to MongoDB...');
  await mongoose.connect(env.MONGODB_URI);
  console.log(`[seed] Connected -> ${mongoose.connection.name}`);

  await cleanupLegacySeedData();
  await seedAdmin();
  await seedSettings();
  await seedBranches();
  await seedTrips();
  await seedTestimonials();
  await seedFaqs();

  console.log('[seed] Done.');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
