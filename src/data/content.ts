export type ContentSection = {
  headingAr: string;
  headingEn: string;
  bodyAr: string;
  bodyEn: string;
};

export type ContentPage = {
  titleAr: string;
  titleEn: string;
  introAr: string;
  introEn: string;
  image?: string;
  sections: ContentSection[];
};

export const CONTENT_PAGES: Record<string, ContentPage> = {
  about: {
    titleAr: "عن ريحان",
    titleEn: "About RE7AN",
    introAr:
      "ريحان علامة عطرية مصرية، بنتها فكرة بسيطة: عطر يفهم ذوق المصري ويحترم جيبه. نعمل على تركيبات مستوحاة من المكوّن العربي الأصيل — العود والعنبر والمسك والورد والياسمين — ونقدمها بأسعار منطقية داخل مصر.",
    introEn:
      "RE7AN is an Egyptian fragrance house built on a simple idea: a perfume that understands Egyptian taste and respects your budget. We work with the classic Arabic palette — oud, amber, musk, rose and jasmine — and offer it at fair local prices.",
    image: "/images/hero-re7an.jpg",
    sections: [
      {
        headingAr: "من الفكرة",
        headingEn: "The idea",
        bodyAr:
          "بدأت ريحان من سؤال متكرر: ليه العطر الفخم لازم يكون مستورد بسعر صعب؟ جمعنا مكوّنات التقليد العربي في التركيب مع معايير تصنيع حديثة، وخرجنا بعطور مصممة للأجواء المصرية.",
        bodyEn:
          "RE7AN started from a recurring question: why must a fine fragrance be an expensive import? We paired the Arabic perfumery tradition with modern production standards and created scents designed for Egyptian weather and life.",
      },
      {
        headingAr: "من المكوّن",
        headingEn: "From the ingredient",
        bodyAr:
          "نختار كل تركيبة حوالين مكوّن رئيسي واحد: الياسمين المصري، العود، الورد البلدي، أو الحمضيات. وبعدين نبني حوله تلات طبقات واضحة تحس بها من أول رشة.",
        bodyEn:
          "Each composition is built around one lead ingredient — Egyptian jasmine, oud, damask rose or citrus — then structured into three clear layers you can read from the first spray.",
      },
      {
        headingAr: "التغليف",
        headingEn: "Packaging",
        bodyAr:
          "العلبة مصممة تصلح للإهداء مباشرة: كرتون صلب، فواصل واقية، وبطاقة إهداء تقدر تكتب فيها رسالتك وقت الطلب.",
        bodyEn:
          "Every order arrives gift-ready: a rigid box, protective inserts, and an optional gift card with your own message added at checkout.",
      },
    ],
  },
  contact: {
    titleAr: "تواصل معنا",
    titleEn: "Contact us",
    introAr:
      "فريق خدمة العملاء بتاع ريحان موجود لمساعدتك في اختيار العطر، تتبع الطلب، أو أي استفسار عن التوصيل. أسرع طريقة للتواصل هي واتساب.",
    introEn:
      "The RE7AN support team can help you pick a fragrance, track an order or answer delivery questions. WhatsApp is the fastest way to reach us.",
    sections: [
      {
        headingAr: "واتساب",
        headingEn: "WhatsApp",
        bodyAr: "+20 100 000 0000 — من ١٠ صباحاً حتى ١٠ مساءً، طوال أيام الأسبوع. (رقم تجريبي للنسخة التجريبية)",
        bodyEn: "+20 100 000 0000 — from 10:00 to 22:00, seven days a week. (Demo number for this prototype.)",
      },
      {
        headingAr: "البريد الإلكتروني",
        headingEn: "Email",
        bodyAr: "hello@re7an.example — بنرد خلال ٢٤ ساعة عمل.",
        bodyEn: "hello@re7an.example — we reply within 24 working hours.",
      },
      {
        headingAr: "ساعات العمل",
        headingEn: "Working hours",
        bodyAr: "السبت إلى الخميس: ١٠ ص – ١٠ م. الجمعة: ٢ م – ١٠ م.",
        bodyEn: "Saturday to Thursday: 10:00-22:00. Friday: 14:00-22:00.",
      },
    ],
  },
  faq: {
    titleAr: "أسئلة متكررة",
    titleEn: "FAQ",
    introAr: "أكثر الأسئلة اللي بيوصلنا من عملائنا في مصر.",
    introEn: "The questions we hear most from customers in Egypt.",
    sections: [
      {
        headingAr: "الدفع عند الاستلام متاح؟",
        headingEn: "Is cash on delivery available?",
        bodyAr:
          "أيوه، الدفع عند الاستلام (كاش) متاح في جميع المحافظات المصرية اللي بنخدمها، ومن غير أي رسوم إضافية.",
        bodyEn:
          "Yes. Cash on delivery is available in every Egyptian governorate we serve, with no extra handling fee.",
      },
      {
        headingAr: "البطاقة والدفع الإلكتروني؟",
        headingEn: "Card and online payment?",
        bodyAr:
          "البنية جاهزة لربط بوابة دفع مصرية أو Stripe، لكن الربط الفعلي لسه مش مفعّل في النسخة التجريبية دي. لحد ما يتم الربط، الدفع عند الاستلام هو الطريقة المتاحة.",
        bodyEn:
          "The checkout is structured for an Egyptian gateway or Stripe, but no payment gateway is connected in this prototype. Until then, cash on delivery is the only active method.",
      },
      {
        headingAr: "الشحن بياخد قد إيه؟",
        headingEn: "How long does delivery take?",
        bodyAr:
          "القاهرة والجيزة من ١ لـ ٢ يوم عمل، والدلتا والإسكندرية ٢-٣ أيام، والصعيد والمحافظات البعيدة ٣-٦ أيام عمل. تقدر تشوف التفاصيل لكل محافظة في صفحة الشحن.",
        bodyEn:
          "Cairo and Giza 1-2 working days, Delta and Alexandria 2-3 days, Upper Egypt and remote governorates 3-6 working days. Full details per governorate are on the shipping page.",
      },
      {
        headingAr: "أقدر أغيّر أو ألغي الطلب؟",
        headingEn: "Can I change or cancel an order?",
        bodyAr:
          "أيوه، طالما الطلب لسه ما اتشحنش. كلّمنا على واتساب برقم الطلب وهنساعدك.",
        bodyEn:
          "Yes, as long as the order has not shipped yet. Message us on WhatsApp with your order reference.",
      },
      {
        headingAr: "المنتجات أصلية؟",
        headingEn: "Are the products authentic?",
        bodyAr:
          "كل عطريات ريحان بتتنتج لنا بمواصفات خاصة، وبنصفّرها كمكوّنات على صفحة كل عطر. مفيش أي ادعاءات عن شهادات أو اعتمادات لحد ما تتوفر لنا مستندات رسمية.",
        bodyEn:
          "RE7AN fragrances are produced to our own specification and each ingredient list is published on the product page. We make no certification claims until official documentation is available to us.",
      },
      {
        headingAr: "بتقدّموا تغليف هدايا؟",
        headingEn: "Do you offer gift packaging?",
        bodyAr:
          "أيوه، تقدر تختار «تغليف هدية» في صفحة الدفع مع كتابة رسالتك، والفاتورة بتتبعت من غير السعر لو طلبت هدية.",
        bodyEn:
          "Yes — choose gift wrapping at checkout, add your message, and we can send the invoice without prices for gifts.",
      },
    ],
  },
  shipping: {
    titleAr: "الشحن والتوصيل",
    titleEn: "Shipping & Delivery",
    introAr:
      "بنوصل عطرك لباب بيتك في جميع أنحاء مصر. مصاريف الشحن ب تتحدد لكل محافظة على حدة، وممكن تتغيّر من لوحة التحكم من غير ما نعدّل الواجهة.",
    introEn:
      "We deliver to your door across Egypt. Delivery fees are configured per governorate and can be updated from the admin panel without touching the frontend.",
    image: "/images/gift-set.jpg",
    sections: [
      {
        headingAr: "مدة التوصيل",
        headingEn: "Delivery time",
        bodyAr:
          "القاهرة والجيزة: ١-٢ يوم عمل. الإسكندرية والدلتا: ٢-٣ أيام. الصعيد وسيناء والمحافظات البعيدة: ٣-٦ أيام عمل. الطلبات اللي بتتأكد قبل ٣ عصراً بتتحرك في نفس اليوم.",
        bodyEn:
          "Cairo & Giza: 1-2 working days. Alexandria & Delta: 2-3 days. Upper Egypt, Sinai and remote governorates: 3-6 working days. Orders confirmed before 15:00 move the same day.",
      },
      {
        headingAr: "مصاريف التوصيل",
        headingEn: "Delivery fee",
        bodyAr:
          "المصاريف تظهر لك بوضوح في صفحة الدفع بعد اختيار المحافظة. الشحن مجاني فوق حد معين في محافظات مختارة (٢٥٠٠ جنيه في القاهرة والجيزة مثلًا).",
        bodyEn:
          "The exact fee is shown at checkout once you pick your governorate. Free delivery applies above a threshold in selected zones (EGP 2,500 in Cairo and Giza, for example).",
      },
      {
        headingAr: "تتبع الطلب",
        headingEn: "Order tracking",
        bodyAr:
          "بعد تأكيد الطلب بيوصلك رقم طلب، وممكن تبعتلنا على واتساب تسأل عن حالة الشحنة في أي وقت.",
        bodyEn:
          "After confirmation you receive an order reference; message us on WhatsApp any time to check shipment status.",
      },
    ],
  },
  returns: {
    titleAr: "الاستبدال والاسترجاع",
    titleEn: "Returns",
    introAr:
      "هدفنا إنك تكون مرتاح لاختيارك. السياسة دي نموذجية وقابلة للتعديل حسب سياسة الشركة النهائية قبل الإطلاق.",
    introEn:
      "Our goal is for you to feel confident in your choice. This is a draft policy, editable before launch.",
    sections: [
      {
        headingAr: "العطر لسه مقفول",
        headingEn: "Sealed product",
        bodyAr:
          "لو العطر مقفول ولسه في تغليفه الأصلي، تقدر تستبدله أو ترجّعه خلال ١٤ يوم من الاستلام، ومصاريف الشحن بتحاسب حسب الحالة.",
        bodyEn:
          "Sealed, unused products in original packaging can be exchanged or returned within 14 days of delivery; shipping costs depend on the case.",
      },
      {
        headingAr: "عطر مفتوح",
        headingEn: "Opened product",
        bodyAr:
          "بسبب طبيعة العطور، العطر المفتوح بيتقبل للاستبدال فقط لو فيه عيب في التصنيع أو طلع مختلف تماماً عن الوصف.",
        bodyEn:
          "Because of the nature of fragrance, opened bottles are eligible for exchange only in case of a manufacturing fault or a clear mismatch with the published description.",
      },
      {
        headingAr: "عيب في التصنيع",
        headingEn: "Manufacturing fault",
        bodyAr:
          "لو وصلك عطر به عيب، صوّره وابعتلنا على واتساب، وهنستبدله على حسابنا في أسرع وقت.",
        bodyEn:
          "If a faulty bottle arrives, photograph it and send it to us on WhatsApp — we replace it at our own cost.",
      },
    ],
  },
  privacy: {
    titleAr: "سياسة الخصوصية",
    titleEn: "Privacy Policy",
    introAr:
      "نجمع أقل قدر ممكن من بياناتك، وبنستخدمها لتنفيذ الطلب وخدمتك فقط. النص ده نموذجي ويحتاج مراجعة قانونية قبل الإطلاق.",
    introEn:
      "We collect the minimum data needed to fulfil your order and support you. This draft requires legal review before launch.",
    sections: [
      {
        headingAr: "البيانات اللي بنجمعها",
        headingEn: "Data we collect",
        bodyAr:
          "الاسم، رقم الهاتف، البريد الإلكتروني، العنوان، وتفاصيل الطلب. بنحتاجها لتنفيذ الشحن والتواصل معك.",
        bodyEn:
          "Name, phone number, email, address and order details — required for shipping and customer support.",
      },
      {
        headingAr: "الاستخدام",
        headingEn: "Usage",
        bodyAr:
          "بنستخدم البيانات لتنفيذ الطلب، خدمة العملاء، وإرسال العروض لو اشتركت في القائمة البريدية. مبنبيع بياناتك لأي طرف تالت.",
        bodyEn:
          "Used for order fulfilment, customer support and — only if you subscribe — marketing updates. We do not sell your data.",
      },
      {
        headingAr: "التحليلات",
        headingEn: "Analytics",
        bodyAr:
          "الكود جاهز لإضافة Google Analytics و Meta Pixel لاحقاً. مش هيشتغلوا إلا بعد إضافة المفاتيح وطلب موافقة المستخدم.",
        bodyEn:
          "The codebase is ready for Google Analytics and Meta Pixel. Neither runs until keys are supplied and user consent is captured.",
      },
    ],
  },
  terms: {
    titleAr: "الشروط والأحكام",
    titleEn: "Terms & Conditions",
    introAr:
      "باستخدامك موقع ريحان فأنت موافق على الشروط دي. دي نسخة نموذجية للنشر التجريبي.",
    introEn: "By using the RE7AN site you agree to these terms. This is a prototype draft.",
    sections: [
      {
        headingAr: "الأسعار",
        headingEn: "Pricing",
        bodyAr:
          "كل الأسعار بالجنيه المصري وتشمل ضريبة القيمة المضافة حسب ما ينطبق. بنحفظ حق تعديل الأسعار قبل تأكيد الطلب.",
        bodyEn:
          "All prices are in Egyptian Pounds and include VAT where applicable. We reserve the right to change prices before an order is confirmed.",
      },
      {
        headingAr: "الطلبات",
        headingEn: "Orders",
        bodyAr:
          "الطلب بيتأكد بعد تأكيد الهاتف أو تأكيد الدفع. لو العنصر غير متوفر بنتواصل معك لاقتراح بديل أو إلغاء الطلب.",
        bodyEn:
          "An order is confirmed after phone confirmation or payment. If an item is unavailable we contact you with an alternative or cancel the order.",
      },
      {
        headingAr: "حقوق الملكية",
        headingEn: "Intellectual property",
        bodyAr:
          "كل صور ونصوص وتصاميم موقع ريحان مملوكة للعلامة، ولا يجوز استخدامها بدون إذن.",
        bodyEn: "All imagery, copy and design on this site belong to RE7AN and may not be reused without permission.",
      },
    ],
  },
};

export function getContentPage(slug: string): ContentPage | undefined {
  return CONTENT_PAGES[slug];
}
