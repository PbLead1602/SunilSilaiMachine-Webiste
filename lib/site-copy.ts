import type { Locale } from "@/lib/types";

type Card = { title: string; text: string };

type SiteCopy = {
  categoryNames: Record<string, string>;
  featuredSort: string;
  about: { eyebrow: string; title: string; text: string; cards: Card[]; talk: string; callout: string; contact: string; imageAlt: string };
  contact: { eyebrow: string; title: string; text: string; call: string; address: string; hours: string; whatsapp: string; enquiry: string; help: string; helpText: string; mapAlt: string; openMap: string };
  product: { breadcrumbHome: string; breadcrumbShop: string; price: string; whatsapp: string; sendEnquiry: string; availability: string; specifications: string; applications: string; questions: string; questionOne: string; answerOne: string; questionTwo: string; answerTwo: string; enquiryEyebrow: string; enquiryTitle: string; enquiryText: string; related: string };
  compare: { emptyTitle: string; emptyText: string; browse: string; selected: string; clear: string; tableTitle: string; category: string; description: string; features: string; applications: string; pricing: string };
  images: { tailoringStudio: string; serviceDetail: string; workshop: string; finance: string; showroom: string };
};

const copy: Record<Locale, SiteCopy> = {
  en: {
    categoryNames: { "domestic-machines": "Domestic machines", "industrial-machines": "Industrial machines", "garment-machinery": "Garment machinery", accessories: "Accessories", "spare-parts": "Spare parts" },
    featuredSort: "Featured",
    about: {
      eyebrow: "About Sunil Silai Machine", title: "Built around the work that good sewing makes possible.", text: "Sunil Silai Machine brings together machines, practical accessories, spare parts, repair support, and product guidance for customers in and around Akola.",
      cards: [{ title: "A focused local showroom", text: "Visit us to discuss your sewing requirement." }, { title: "Guidance that starts with your work", text: "We help you choose according to your fabric and output." }, { title: "Akola, Maharashtra", text: "Located near Shastri Stadium at Fateh Chowk." }, { title: "Support beyond the machine", text: "Parts, accessories, repairs, and after-sales help." }],
      talk: "Come and talk to us", callout: "A local team for home sewing, tailoring, and production needs.", contact: "Contact Sunil Silai Machine", imageAlt: "Sewing work detail",
    },
    contact: { eyebrow: "Contact us", title: "Let's find the right setup for your work.", text: "Call, WhatsApp, visit the showroom, or send an enquiry. We are happy to discuss machines, parts, accessories, repair, and finance assistance.", call: "Call us", address: "Showroom address", hours: "Business hours", whatsapp: "Message on WhatsApp", enquiry: "General enquiry", help: "How can we help?", helpText: "Send your question and our team will contact you.", mapAlt: "Sunil Silai Machine showroom service", openMap: "Open in Google Maps" },
    product: { breadcrumbHome: "Home", breadcrumbShop: "Shop", price: "Enquire for price", whatsapp: "WhatsApp enquiry", sendEnquiry: "Send an enquiry", availability: "Ask our team for current availability, suitable setup guidance, and EMI purchase assistance where applicable.", specifications: "Specifications & key features", applications: "Applications", questions: "Common questions", questionOne: "Can you help me select the right model?", answerOne: "Yes. Contact us with your fabric type, use case, and expected workload for practical guidance.", questionTwo: "Can I ask about finance assistance?", answerTwo: "Yes. Use the finance enquiry form or call us to discuss the current process.", enquiryEyebrow: "Product enquiry", enquiryTitle: "Interested in this machine?", enquiryText: "Share your requirement and we will help with the next step.", related: "Related equipment" },
    compare: { emptyTitle: "No machines selected for comparison", emptyText: "Use the compare button on any product card to place up to four products here.", browse: "Browse machines", selected: "{count} machines selected", clear: "Clear comparison", tableTitle: "Compare", category: "Category", description: "Description", features: "Key features", applications: "Applications", pricing: "Pricing" },
    images: { tailoringStudio: "Tailoring studio", serviceDetail: "Sewing service detail", workshop: "Sewing machine workshop", finance: "Sewing machine promotion", showroom: "Sunil Silai Machine showroom service" },
  },
  hi: {
    categoryNames: { "domestic-machines": "घरेलू मशीनें", "industrial-machines": "औद्योगिक मशीनें", "garment-machinery": "गारमेंट मशीनरी", accessories: "एक्सेसरीज़", "spare-parts": "स्पेयर पार्ट्स" },
    featuredSort: "लोकप्रिय",
    about: {
      eyebrow: "सनिल सिलाई मशीन के बारे में", title: "अच्छी सिलाई से संभव होने वाले काम के लिए बनी।", text: "सनिल सिलाई मशीन अकोला और आसपास के ग्राहकों के लिए मशीनें, उपयोगी एक्सेसरीज़, स्पेयर पार्ट्स, मरम्मत सहायता और उत्पाद मार्गदर्शन एक साथ उपलब्ध कराती है।",
      cards: [{ title: "स्थानीय शोरूम", text: "अपनी सिलाई की जरूरत पर चर्चा करने के लिए हमसे मिलें।" }, { title: "आपके काम से शुरू होने वाला मार्गदर्शन", text: "हम कपड़े और उत्पादन के अनुसार सही विकल्प चुनने में मदद करते हैं।" }, { title: "अकोला, महाराष्ट्र", text: "फतेह चौक में शास्त्री स्टेडियम के पास स्थित।" }, { title: "मशीन के बाद भी सहायता", text: "पार्ट्स, एक्सेसरीज़, मरम्मत और बिक्री के बाद मदद।" }],
      talk: "आइए, हमसे बात करें", callout: "घरेलू सिलाई, टेलरिंग और उत्पादन की जरूरतों के लिए स्थानीय टीम।", contact: "सनिल सिलाई मशीन से संपर्क करें", imageAlt: "सिलाई कार्य का विवरण",
    },
    contact: { eyebrow: "संपर्क करें", title: "आपके काम के लिए सही सेटअप चुनते हैं।", text: "कॉल करें, WhatsApp करें, शोरूम आएँ या पूछताछ भेजें। हम मशीन, पार्ट्स, एक्सेसरीज़, मरम्मत और फाइनेंस सहायता पर बात करने के लिए उपलब्ध हैं।", call: "कॉल करें", address: "शोरूम का पता", hours: "व्यावसायिक समय", whatsapp: "WhatsApp पर संदेश भेजें", enquiry: "सामान्य पूछताछ", help: "हम कैसे मदद कर सकते हैं?", helpText: "अपना प्रश्न भेजें; हमारी टीम आपसे संपर्क करेगी।", mapAlt: "सनिल सिलाई मशीन शोरूम सेवा", openMap: "Google Maps में खोलें" },
    product: { breadcrumbHome: "होम", breadcrumbShop: "उत्पाद", price: "कीमत के लिए पूछें", whatsapp: "WhatsApp पूछताछ", sendEnquiry: "पूछताछ भेजें", availability: "मौजूदा उपलब्धता, उपयुक्त सेटअप मार्गदर्शन और जहाँ लागू हो वहाँ EMI खरीद सहायता के लिए हमारी टीम से पूछें।", specifications: "विशेषताएँ और मुख्य जानकारी", applications: "उपयोग", questions: "सामान्य प्रश्न", questionOne: "क्या आप सही मॉडल चुनने में मदद कर सकते हैं?", answerOne: "हाँ। व्यावहारिक मार्गदर्शन के लिए अपने कपड़े, उपयोग और अपेक्षित कार्यभार के साथ हमसे संपर्क करें।", questionTwo: "क्या मैं फाइनेंस सहायता के बारे में पूछ सकता हूँ?", answerTwo: "हाँ। वर्तमान प्रक्रिया पर बात करने के लिए फाइनेंस पूछताछ फ़ॉर्म का उपयोग करें या हमें कॉल करें।", enquiryEyebrow: "उत्पाद पूछताछ", enquiryTitle: "इस मशीन में रुचि है?", enquiryText: "अपनी जरूरत बताइए; हम अगले चरण में मदद करेंगे।", related: "संबंधित उपकरण" },
    compare: { emptyTitle: "तुलना के लिए कोई मशीन नहीं चुनी गई", emptyText: "यहाँ अधिकतम चार उत्पाद रखने के लिए किसी भी उत्पाद कार्ड पर तुलना बटन का उपयोग करें।", browse: "मशीनें देखें", selected: "{count} मशीनें चुनी गईं", clear: "तुलना हटाएँ", tableTitle: "तुलना", category: "श्रेणी", description: "विवरण", features: "मुख्य विशेषताएँ", applications: "उपयोग", pricing: "कीमत" },
    images: { tailoringStudio: "टेलरिंग स्टूडियो", serviceDetail: "सिलाई सेवा का विवरण", workshop: "सिलाई मशीन कार्यशाला", finance: "सिलाई मशीन प्रचार", showroom: "सनिल सिलाई मशीन शोरूम सेवा" },
  },
  mr: {
    categoryNames: { "domestic-machines": "घरगुती मशिन्स", "industrial-machines": "औद्योगिक मशिन्स", "garment-machinery": "गारमेंट मशिनरी", accessories: "अॅक्सेसरीज", "spare-parts": "स्पेअर पार्ट्स" },
    featuredSort: "निवडक",
    about: {
      eyebrow: "सुनील सिलाई मशीनबद्दल", title: "उत्तम शिवणकामामुळे शक्य होणाऱ्या कामासाठी तयार.", text: "सुनील सिलाई मशीन अकोला आणि परिसरातील ग्राहकांसाठी मशिन्स, उपयुक्त अॅक्सेसरीज, स्पेअर पार्ट्स, दुरुस्ती मदत आणि उत्पादन मार्गदर्शन एकाच ठिकाणी आणते.",
      cards: [{ title: "स्थानिक शोरूम", text: "तुमच्या शिवणकामाच्या गरजेबद्दल चर्चा करण्यासाठी भेट द्या." }, { title: "तुमच्या कामापासून सुरू होणारे मार्गदर्शन", text: "फॅब्रिक आणि अपेक्षित उत्पादनानुसार निवड करण्यात आम्ही मदत करतो." }, { title: "अकोला, महाराष्ट्र", text: "फतेह चौक येथे, शास्त्री स्टेडियमजवळ स्थित." }, { title: "मशिनपलीकडची मदत", text: "पार्ट्स, अॅक्सेसरीज, दुरुस्ती आणि विक्रीनंतरची मदत।" }],
      talk: "या, आमच्याशी बोला", callout: "घरगुती शिवणकाम, टेलरिंग आणि उत्पादनाच्या गरजांसाठी स्थानिक टीम.", contact: "सुनील सिलाई मशीनशी संपर्क करा", imageAlt: "शिवणकामाचा तपशील",
    },
    contact: { eyebrow: "संपर्क", title: "तुमच्या कामासाठी योग्य सेटअप शोधूया.", text: "कॉल करा, WhatsApp करा, शोरूमला भेट द्या किंवा चौकशी पाठवा. मशिन्स, पार्ट्स, अॅक्सेसरीज, दुरुस्ती आणि फायनान्स मदतीबद्दल आम्ही बोलण्यास उपलब्ध आहोत।", call: "कॉल करा", address: "शोरूमचा पत्ता", hours: "व्यावसायिक वेळ", whatsapp: "WhatsApp वर संदेश पाठवा", enquiry: "सामान्य चौकशी", help: "आम्ही कशी मदत करू शकतो?", helpText: "तुमचा प्रश्न पाठवा; आमची टीम तुमच्याशी संपर्क करेल।", mapAlt: "सुनील सिलाई मशीन शोरूम सेवा", openMap: "Google Maps मध्ये उघडा" },
    product: { breadcrumbHome: "मुख्यपृष्ठ", breadcrumbShop: "उत्पादने", price: "किंमतीसाठी विचारा", whatsapp: "WhatsApp चौकशी", sendEnquiry: "चौकशी पाठवा", availability: "सध्याची उपलब्धता, योग्य सेटअपचे मार्गदर्शन आणि लागू असल्यास EMI खरेदी मदतीबद्दल आमच्या टीमला विचारा।", specifications: "तपशील आणि प्रमुख वैशिष्ट्ये", applications: "उपयोग", questions: "सामान्य प्रश्न", questionOne: "योग्य मॉडेल निवडण्यात तुम्ही मदत करू शकता का?", answerOne: "होय. व्यावहारिक मार्गदर्शनासाठी फॅब्रिक, वापर आणि अपेक्षित कामाच्या प्रमाणासह आमच्याशी संपर्क करा।", questionTwo: "मी फायनान्स मदतीबद्दल विचारू शकतो का?", answerTwo: "होय. सध्याच्या प्रक्रियेबद्दल बोलण्यासाठी फायनान्स चौकशी फॉर्म वापरा किंवा आम्हाला कॉल करा।", enquiryEyebrow: "उत्पादन चौकशी", enquiryTitle: "या मशिनमध्ये रस आहे?", enquiryText: "तुमची गरज सांगा; आम्ही पुढच्या टप्प्यात मदत करू।", related: "संबंधित उपकरणे" },
    compare: { emptyTitle: "तुलनेसाठी कोणतीही मशिन निवडलेली नाही", emptyText: "येथे चारपर्यंत उत्पादने ठेवण्यासाठी कोणत्याही उत्पादन कार्डावरील तुलना बटण वापरा।", browse: "मशिन्स पहा", selected: "{count} मशिन्स निवडल्या", clear: "तुलना हटवा", tableTitle: "तुलना", category: "श्रेणी", description: "वर्णन", features: "प्रमुख वैशिष्ट्ये", applications: "उपयोग", pricing: "किंमत" },
    images: { tailoringStudio: "टेलरिंग स्टुडिओ", serviceDetail: "शिवण सेवा तपशील", workshop: "शिवण मशिन कार्यशाळा", finance: "शिवण मशिन प्रचार", showroom: "सुनील सिलाई मशीन शोरूम सेवा" },
  },
};

export function siteCopy(locale: Locale) {
  return copy[locale];
}

export function categoryName(locale: Locale, slug: string, fallback: string) {
  return copy[locale].categoryNames[slug] ?? fallback;
}
