import type { Locale } from "@/lib/types";

export const locales: Locale[] = ["en", "hi", "mr"];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिंदी",
  mr: "मराठी",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

const copy = {
  en: {
    explore: "Explore Machines",
    contact: "Talk to an expert",
    heroKicker: "Akola’s sewing-machine specialist",
    heroTitle: "The right machine for every stitch of your ambition.",
    heroText: "Domestic, industrial, garment machinery, accessories, spare parts, repair, and practical purchase guidance — all in one place.",
    categories: "Shop by need",
    categoriesText: "Thoughtfully selected equipment and essentials for homes, tailors, and production teams.",
    featured: "Featured machines",
    featuredText: "Explore popular professional and home sewing options. Ask us for the right configuration and current availability.",
    finance: "Make your next machine more accessible.",
    repair: "Keep your work moving.",
    repairText: "Book sewing-machine repair support with our experienced team in Akola.",
    enquiry: "Enquire for price",
    view: "View details",
    allProducts: "View all products",
    trust: "Why customers choose us",
    search: "Search machines, brands, parts…",
    noResults: "No matching products found.",
    formTitle: "Send an enquiry",
    formText: "Tell us what you need. Our team will contact you using the details you provide.",
    submit: "Send enquiry",
    success: "Thank you. Your enquiry has been received.",
  },
  hi: {
    explore: "मशीनें देखें",
    contact: "विशेषज्ञ से बात करें",
    heroKicker: "अकोला के सिलाई-मशीन विशेषज्ञ",
    heroTitle: "आपकी हर सिलाई की ज़रूरत के लिए सही मशीन।",
    heroText: "घरेलू, औद्योगिक, गारमेंट मशीनरी, एक्सेसरीज़, स्पेयर पार्ट्स, मरम्मत और सही खरीद सलाह — सब एक जगह।",
    categories: "ज़रूरत के अनुसार खरीदें",
    categoriesText: "घर, दर्ज़ी और प्रोडक्शन टीम के लिए चुनी हुई मशीनें और ज़रूरी सामग्री।",
    featured: "लोकप्रिय मशीनें",
    featuredText: "पेशेवर और घरेलू सिलाई के लोकप्रिय विकल्प देखें। सही कॉन्फ़िगरेशन और उपलब्धता के लिए हमसे पूछें।",
    finance: "अपनी अगली मशीन को और सुलभ बनाएं।",
    repair: "अपना काम लगातार चलाते रहें।",
    repairText: "अकोला में हमारी अनुभवी टीम के साथ सिलाई मशीन मरम्मत सहायता बुक करें।",
    enquiry: "कीमत के लिए पूछें",
    view: "विवरण देखें",
    allProducts: "सभी उत्पाद देखें",
    trust: "ग्राहक हमें क्यों चुनते हैं",
    search: "मशीनें, ब्रांड, पार्ट्स खोजें…",
    noResults: "कोई मेल खाता उत्पाद नहीं मिला।",
    formTitle: "पूछताछ भेजें",
    formText: "अपनी ज़रूरत बताएं। हमारी टीम आपके दिए गए विवरण पर आपसे संपर्क करेगी।",
    submit: "पूछताछ भेजें",
    success: "धन्यवाद। आपकी पूछताछ प्राप्त हो गई है।",
  },
  mr: {
    explore: "मशिन्स पहा",
    contact: "तज्ज्ञांशी बोला",
    heroKicker: "अकोल्याचे शिवण-मशीन तज्ज्ञ",
    heroTitle: "तुमच्या प्रत्येक शिवणाच्या ध्येयासाठी योग्य मशीन.",
    heroText: "घरगुती, औद्योगिक, गारमेंट मशिनरी, अॅक्सेसरीज, स्पेअर पार्ट्स, दुरुस्ती आणि योग्य खरेदी मार्गदर्शन — सर्व एकाच ठिकाणी.",
    categories: "गरजेनुसार निवडा",
    categoriesText: "घर, टेलर आणि उत्पादन टीमसाठी निवडक उपकरणे आणि आवश्यक वस्तू.",
    featured: "लोकप्रिय मशिन्स",
    featuredText: "व्यावसायिक आणि घरगुती शिवणासाठी लोकप्रिय पर्याय पहा. योग्य कॉन्फिगरेशन आणि उपलब्धतेसाठी विचारा.",
    finance: "तुमची पुढील मशीन अधिक सहज उपलब्ध करा.",
    repair: "तुमचे काम सुरू ठेवा.",
    repairText: "अकोल्यातील आमच्या अनुभवी टीमसोबत शिवण-मशीन दुरुस्ती सहाय्य बुक करा.",
    enquiry: "किंमतीसाठी विचारा",
    view: "तपशील पहा",
    allProducts: "सर्व उत्पादने पहा",
    trust: "ग्राहक आम्हाला का निवडतात",
    search: "मशिन्स, ब्रँड, पार्ट्स शोधा…",
    noResults: "जुळणारे उत्पादन सापडले नाही.",
    formTitle: "चौकशी पाठवा",
    formText: "तुमची गरज सांगा. आमची टीम दिलेल्या तपशीलांवर तुमच्याशी संपर्क करेल.",
    submit: "चौकशी पाठवा",
    success: "धन्यवाद. तुमची चौकशी प्राप्त झाली आहे.",
  },
} as const;

export function t(locale: Locale) {
  return copy[locale];
}

const uiCopy = {
  en: {
    utility: "Domestic · Industrial · Repairs · Spare Parts", home: "Home", shop: "Shop", domestic: "Domestic", industrial: "Industrial", services: "Services", finance: "Finance", about: "About", contact: "Contact", search: "Search", searchPlaceholder: "Search machines, brands, parts…", compare: "Compare machines", saved: "Saved machines", call: "Call us",
    explore: "Explore", allProducts: "All products", repairBooking: "Repair booking", financeAssistance: "Finance assistance", aboutUs: "About us", categories: "Categories", visitOrCall: "Visit or call", localSource: "Your local source for domestic and industrial sewing machines, practical support, parts, and accessories.", chatWhatsapp: "Chat on WhatsApp", rights: "All rights reserved.", footerLine: "Designed for every kind of sewing work.", mapTitle: "Find our Akola showroom", directions: "Get directions",
    details: "Details", enquiry: "Enquire", enquirePrice: "Enquire for price", emi: "EMI assistance", filter: "Filter machines", clearAll: "Clear all", category: "Category", brand: "Brand", allBrands: "All brands", helpChoice: "Need help selecting a machine? Tell us the fabric, use case, and expected daily workload.", productsAvailable: "products available to enquire about", reset: "Reset filters", noProducts: "No matching products found", browse: "Browse full catalogue",
    name: "Your name *", phone: "Phone / WhatsApp number *", email: "Email address (optional)", message: "What do you need help with? *", machine: "Machine brand / model *", address: "Address or area in Akola *", repairIssue: "Tell us about the issue *", privacy: "We use these details only to respond to your enquiry. Please do not share PAN, Aadhaar, or bank details online.", sending: "Sending…", sendEnquiry: "Send enquiry", received: "Your enquiry is with us.", receivedText: "Our team will contact you using the number you shared.", formError: "We could not send this yet. Please call or WhatsApp us directly.",
    range: "Extensive machine range", rangeText: "From home sewing to factory-ready equipment.", guidance: "Expert guidance", guidanceText: "Help choosing a setup suited to your work.", parts: "Parts & accessories", partsText: "Support for the essentials that keep work moving.", repairSupport: "Repair support", repairSupportText: "Practical service assistance in Akola.", selected: "Selected for you", financeKicker: "Finance assistance", financeText: "Speak with our team about suitable machine options and available purchase-assistance guidance. We will explain the process clearly before you proceed.", emiGuidance: "EMI guidance", clearSteps: "Clear next steps", talkToUs: "Talk to us", supportKicker: "Our support", adviceTitle: "A helpful answer before you buy.", adviceText: "Tell us about your fabrics, volume, and workspace. We will help you understand which category and machine type is suitable.", productGuidance: "Get product guidance", brandsTitle: "Find a machine that fits your way of working.", brandsText: "Explore well-known domestic and industrial names with support from our team.", visitTitle: "Located in the heart of Akola.",
  },
  hi: {
    utility: "घरेलू · औद्योगिक · मरम्मत · स्पेयर पार्ट्स", home: "होम", shop: "उत्पाद", domestic: "घरेलू", industrial: "औद्योगिक", services: "सेवाएँ", finance: "फाइनेंस", about: "हमारे बारे में", contact: "संपर्क", search: "खोजें", searchPlaceholder: "मशीन, ब्रांड, पार्ट्स खोजें…", compare: "मशीन तुलना", saved: "सहेजी मशीनें", call: "कॉल करें",
    explore: "जानें", allProducts: "सभी उत्पाद", repairBooking: "मरम्मत बुकिंग", financeAssistance: "फाइनेंस सहायता", aboutUs: "हमारे बारे में", categories: "श्रेणियाँ", visitOrCall: "मिलें या कॉल करें", localSource: "घरेलू और औद्योगिक सिलाई मशीन, सहायक सामग्री, पार्ट्स और मार्गदर्शन के लिए आपका स्थानीय केंद्र।", chatWhatsapp: "WhatsApp पर बात करें", rights: "सर्वाधिकार सुरक्षित।", footerLine: "हर तरह के सिलाई कार्य के लिए।", mapTitle: "अकोला शोरूम का स्थान", directions: "दिशा देखें",
    details: "विवरण", enquiry: "पूछताछ", enquirePrice: "कीमत के लिए पूछें", emi: "EMI सहायता", filter: "मशीन फ़िल्टर करें", clearAll: "साफ़ करें", category: "श्रेणी", brand: "ब्रांड", allBrands: "सभी ब्रांड", helpChoice: "मशीन चुनने में मदद चाहिए? कपड़ा, उपयोग और दैनिक काम की जानकारी दें।", productsAvailable: "उत्पादों के बारे में पूछताछ की जा सकती है", reset: "फ़िल्टर हटाएँ", noProducts: "कोई मिलान उत्पाद नहीं मिला", browse: "पूरा कैटलॉग देखें",
    name: "आपका नाम *", phone: "फोन / WhatsApp नंबर *", email: "ईमेल पता (वैकल्पिक)", message: "आपको किस मदद की आवश्यकता है? *", machine: "मशीन ब्रांड / मॉडल *", address: "अकोला में पता या क्षेत्र *", repairIssue: "समस्या के बारे में बताएं *", privacy: "इन विवरणों का उपयोग केवल जवाब देने के लिए होता है। PAN, Aadhaar या बैंक विवरण ऑनलाइन न भेजें।", sending: "भेज रहे हैं…", sendEnquiry: "पूछताछ भेजें", received: "आपकी पूछताछ प्राप्त हो गई है।", receivedText: "हमारी टीम आपके दिए नंबर पर संपर्क करेगी।", formError: "अभी भेजा नहीं जा सका। कृपया कॉल या WhatsApp करें।",
    range: "विस्तृत मशीन रेंज", rangeText: "घर की सिलाई से फैक्टरी-तैयार उपकरण तक।", guidance: "विशेषज्ञ मार्गदर्शन", guidanceText: "आपके काम के अनुसार सही सेटअप चुनने में मदद।", parts: "पार्ट्स और एक्सेसरीज़", partsText: "काम को चलाते रखने वाली आवश्यक सामग्री।", repairSupport: "मरम्मत सहायता", repairSupportText: "अकोला में व्यावहारिक सेवा सहायता।", selected: "आपके लिए चुनी हुई", financeKicker: "फाइनेंस सहायता", financeText: "मशीन विकल्प और उपलब्ध खरीद-सहायता प्रक्रिया के बारे में हमारी टीम से बात करें।", emiGuidance: "EMI मार्गदर्शन", clearSteps: "स्पष्ट अगले चरण", talkToUs: "हमसे बात करें", supportKicker: "हमारी सहायता", adviceTitle: "खरीदने से पहले उपयोगी सलाह।", adviceText: "अपने कपड़े, काम की मात्रा और जगह के बारे में बताएं। हम सही मशीन श्रेणी समझने में मदद करेंगे।", productGuidance: "उत्पाद मार्गदर्शन लें", brandsTitle: "अपने काम के अनुरूप मशीन खोजें।", brandsText: "हमारी टीम के सहयोग से भरोसेमंद घरेलू और औद्योगिक ब्रांड देखें।", visitTitle: "अकोला के केंद्र में स्थित।",
  },
  mr: {
    utility: "घरगुती · औद्योगिक · दुरुस्ती · स्पेअर पार्ट्स", home: "मुख्यपृष्ठ", shop: "उत्पादने", domestic: "घरगुती", industrial: "औद्योगिक", services: "सेवा", finance: "फायनान्स", about: "आमच्याबद्दल", contact: "संपर्क", search: "शोधा", searchPlaceholder: "मशिन्स, ब्रँड, पार्ट्स शोधा…", compare: "मशिन्सची तुलना", saved: "जतन केलेल्या मशिन्स", call: "कॉल करा",
    explore: "पाहा", allProducts: "सर्व उत्पादने", repairBooking: "दुरुस्ती बुकिंग", financeAssistance: "फायनान्स मदत", aboutUs: "आमच्याबद्दल", categories: "श्रेणी", visitOrCall: "भेट द्या किंवा कॉल करा", localSource: "घरगुती व औद्योगिक शिवण-मशिन्स, मार्गदर्शन, पार्ट्स आणि अॅक्सेसरीजसाठी तुमचे स्थानिक केंद्र.", chatWhatsapp: "WhatsApp वर बोला", rights: "सर्व हक्क राखीव.", footerLine: "प्रत्येक प्रकारच्या शिवणकामासाठी.", mapTitle: "आमचे अकोला शोरूम शोधा", directions: "दिशा मिळवा",
    details: "तपशील", enquiry: "चौकशी", enquirePrice: "किंमतीसाठी विचारा", emi: "EMI मदत", filter: "मशिन्स फिल्टर करा", clearAll: "साफ करा", category: "श्रेणी", brand: "ब्रँड", allBrands: "सर्व ब्रँड", helpChoice: "मशीन निवडण्यासाठी मदत हवी आहे? कापड, वापर आणि रोजच्या कामाची माहिती सांगा.", productsAvailable: "उत्पादनांबाबत चौकशी करता येईल", reset: "फिल्टर काढा", noProducts: "जुळणारे उत्पादन सापडले नाही", browse: "पूर्ण कॅटलॉग पहा",
    name: "तुमचे नाव *", phone: "फोन / WhatsApp क्रमांक *", email: "ईमेल पत्ता (पर्यायी)", message: "तुम्हाला कशासाठी मदत हवी आहे? *", machine: "मशीन ब्रँड / मॉडेल *", address: "अकोल्यातील पत्ता किंवा परिसर *", repairIssue: "समस्येबद्दल सांगा *", privacy: "ही माहिती फक्त उत्तर देण्यासाठी वापरली जाईल. PAN, Aadhaar किंवा बँक तपशील ऑनलाइन देऊ नका.", sending: "पाठवत आहे…", sendEnquiry: "चौकशी पाठवा", received: "तुमची चौकशी आम्हाला मिळाली आहे।", receivedText: "आमची टीम दिलेल्या क्रमांकावर संपर्क करेल।", formError: "सध्या पाठवता आले नाही. कृपया कॉल किंवा WhatsApp करा।",
    range: "विस्तृत मशीन रेंज", rangeText: "घरगुती शिवणकामापासून फॅक्टरीसाठी उपकरणांपर्यंत।", guidance: "तज्ज्ञ मार्गदर्शन", guidanceText: "तुमच्या कामासाठी योग्य सेटअप निवडण्यास मदत।", parts: "पार्ट्स व अॅक्सेसरीज", partsText: "काम सुरू ठेवण्यासाठी आवश्यक वस्तू।", repairSupport: "दुरुस्ती मदत", repairSupportText: "अकोल्यामध्ये व्यावहारिक सेवा मदत।", selected: "तुमच्यासाठी निवडक", financeKicker: "फायनान्स मदत", financeText: "योग्य मशीन पर्याय आणि उपलब्ध खरेदी-सहाय्य प्रक्रियेबद्दल आमच्या टीमशी बोला।", emiGuidance: "EMI मार्गदर्शन", clearSteps: "स्पष्ट पुढील टप्पे", talkToUs: "आमच्याशी बोला", supportKicker: "आमची मदत", adviceTitle: "खरेदीपूर्वी उपयुक्त सल्ला।", adviceText: "कापड, कामाचे प्रमाण आणि जागेबद्दल सांगा. योग्य मशीन श्रेणी समजून घेण्यास आम्ही मदत करू।", productGuidance: "उत्पादन मार्गदर्शन घ्या", brandsTitle: "तुमच्या कामाला साजेशी मशीन शोधा।", brandsText: "आमच्या टीमच्या मदतीने ओळखीचे घरगुती आणि औद्योगिक ब्रँड पहा।", visitTitle: "अकोल्याच्या मध्यवर्ती ठिकाणी।",
  },
} as const;

export function ui(locale: Locale) {
  return uiCopy[locale];
}
