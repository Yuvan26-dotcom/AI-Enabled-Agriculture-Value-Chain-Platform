import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Volume2, StopCircle, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const faqData = {
  en: [
    { q: "How do I register?", a: "Click on 'Sign Up' on the login page, select your role (Farmer/Buyer), and fill in your details." },
    { q: "How to check crop prices?", a: "Go to the Dashboard and check the 'Market Trends' section for real-time prices." },
    { q: "How to apply for a loan?", a: "Navigate to the 'Credit & Loans' tab and check your eligibility based on your Trust Score." },
    { q: "What is Trust Score?", a: "It is a credit score based on your farming history and repayment behavior." },
    { q: "How to contact support?", a: "You can call our helpline at 1800-123-4567 or email support@oilseed.gov.in." }
  ],
  hi: [
    { q: "मैं पंजीकरण कैसे करूं?", a: "लॉगिन पेज पर 'साइन अप' पर क्लिक करें, अपनी भूमिका (किसान/खरीदार) चुनें और अपना विवरण भरें।" },
    { q: "फसल की कीमतें कैसे जांचें?", a: "डैशबोर्ड पर जाएं और वास्तविक समय की कीमतों के लिए 'बाजार के रुझान' अनुभाग देखें।" },
    { q: "ऋण के लिए आवेदन कैसे करें?", a: " 'क्रेडिट और ऋण' टैब पर जाएं और अपने ट्रस्ट स्कोर के आधार पर अपनी पात्रता की जांच करें।" },
    { q: "ट्रस्ट स्कोर क्या है?", a: "यह आपके खेती के इतिहास और पुनर्भुगतान व्यवहार पर आधारित एक क्रेडिट स्कोर है।" },
    { q: "समर्थन से संपर्क कैसे करें?", a: "आप हमारी हेल्पलाइन 1800-123-4567 पर कॉल कर सकते हैं या support@oilseed.gov.in पर ईमेल कर सकते हैं।" }
  ],
  ta: [
    { q: "நான் எவ்வாறு பதிவு செய்வது?", a: "உள்நுழைவு பக்கத்தில் 'பதிவுபெறு' என்பதைக் கிளிக் செய்து, உங்கள் பங்கை (விவசாயி/வாங்குபவர்) தேர்ந்தெடுத்து, உங்கள் விவரங்களை நிரப்பவும்." },
    { q: "பயிர் விலைகளை எவ்வாறு சரிபார்ப்பது?", a: "டாஷ்போர்டிற்குச் சென்று நிகழ்நேர விலைகளுக்கு 'சந்தை போக்குகள்' பகுதியைப் பார்க்கவும்." },
    { q: "கடனுக்கு விண்ணப்பிப்பது எப்படி?", a: "'கடன் மற்றும் கடன்கள்' தாவலுக்குச் சென்று உங்கள் நம்பிக்கை மதிப்பெண்ணின் அடிப்படையில் உங்கள் தகுதியைச் சரிபார்க்கவும்." },
    { q: "நம்பிக்கை மதிப்பெண் என்றால் என்ன?", a: "இது உங்கள் விவசாய வரலாறு மற்றும் திருப்பிச் செலுத்தும் நடத்தையின் அடிப்படையில் ஒரு கடன் மதிப்பெண் ஆகும்." }
  ],
  mr: [
    { q: "मी नोंदणी कशी करू?", a: "लॉगिन पृष्ठावर 'साइन अप' वर क्लिक करा, तुमची भूमिका (शेतकरी/खरेदीदार) निवडा आणि तुमचे तपशील भरा." },
    { q: "पिकाचे भाव कसे तपासायचे?", a: "डॅशबोर्डवर जा आणि रिअल-टाइम किमतींसाठी 'मार्केट ट्रेंड' विभाग तपासा." },
    { q: "कर्जासाठी अर्ज कसा करावा?", a: "'क्रेडिट आणि कर्ज' टॅबवर नेव्हिगेट करा आणि तुमच्या ट्रस्ट स्कोअरवर आधारित तुमची पात्रता तपासा." },
    { q: "ट्रस्ट स्कोअर म्हणजे काय?", a: "हा तुमच्या शेतीचा इतिहास आणि परतफेडीच्या वर्तनावर आधारित क्रेडिट स्कोअर आहे." }
  ],
  gu: [
    { q: "હું નોંધણી કેવી રીતે કરી શકું?", a: "લોગિન પૃષ્ઠ પર 'સાઇન અપ' પર ક્લિક કરો, તમારી ભૂમિકા (ખેડૂત/ખરીદનાર) પસંદ કરો અને તમારી વિગતો ભરો." },
    { q: "પાકના ભાવ કેવી રીતે તપાસવા?", a: "ડેશબોર્ડ પર જાઓ અને વાસ્તવિક સમયના ભાવ માટે 'બજાર વલણો' વિભાગ તપાસો." },
    { q: "લોન માટે કેવી રીતે અરજી કરવી?", a: "'ક્રેડિટ અને લોન' ટેબ પર નેવિગેટ કરો અને તમારા ટ્રસ્ટ સ્કોરના આધારે તમારી યોગ્યતા તપાસો." },
    { q: "ટ્રસ્ટ સ્કોર શું છે?", a: "તે તમારા ખેતીના ઇતિહાસ અને ચુકવણીની વર્તણૂક પર આધારિત ક્રેડિટ સ્કોર છે." }
  ],
  te: [
    { q: "నేను ఎలా నమోదు చేసుకోవాలి?", a: "లాగిన్ పేజీలో 'సైన్ అప్' పై క్లిక్ చేయండి, మీ పాత్రను (రైతు/కొనుగోలుదారు) ఎంచుకోండి మరియు మీ వివరాలను పూరించండి." },
    { q: "పంట ధరలను ఎలా తనిఖీ చేయాలి?", a: "డాష్‌బోర్డ్‌కు వెళ్లి, నిజ-సమయ ధరల కోసం 'మార్కెట్ ట్రెండ్స్' విభాగాన్ని తనిఖీ చేయండి." },
    { q: "రుణం కోసం ఎలా దరఖాస్తు చేయాలి?", a: "'క్రెడిట్ & రుణాలు' ట్యాబ్‌కు నావిగేట్ చేయండి మరియు మీ ట్రస్ట్ స్కోర్ ఆధారంగా మీ అర్హతను తనిఖీ చేయండి." },
    { q: "ట్రస్ట్ స్కోర్ అంటే ఏమిటి?", a: "ఇది మీ వ్యవసాయ చరిత్ర మరియు తిరిగి చెల్లించే ప్రవర్తన ఆధారంగా క్రెడిట్ స్కోర్." }
  ],
  kn: [
    { q: "ನಾನು ನೋಂದಾಯಿಸುವುದು ಹೇಗೆ?", a: "ಲಾಗಿನ್ ಪುಟದಲ್ಲಿ 'ಸೈನ್ ಅಪ್' ಕ್ಲಿಕ್ ಮಾಡಿ, ನಿಮ್ಮ ಪಾತ್ರವನ್ನು (ರೈತ/ಖರೀದಿದಾರ) ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ." },
    { q: "ಬೆಳೆ ಬೆಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸುವುದು ಹೇಗೆ?", a: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ ಮತ್ತು ನೈಜ-ಸಮಯದ ಬೆಲೆಗಳಿಗಾಗಿ 'ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳು' ವಿಭಾಗವನ್ನು ಪರಿಶೀಲಿಸಿ." },
    { q: "ಸಾಲಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?", a: "'ಕ್ರೆಡಿಟ್ ಮತ್ತು ಸಾಲಗಳು' ಟ್ಯಾಬ್‌ಗೆ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಟ್ರಸ್ಟ್ ಸ್ಕೋೋರ್ ಆಧಾರದ ಮೇಲೆ ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ." },
    { q: "ಟ್ರಸ್ಟ್ ಸ್ಕೋರ್ ಎಂದರೇನು?", a: "ಇದು ನಿಮ್ಮ ಕೃಷಿ ಇತಿಹಾಸ ಮತ್ತು ಮರುಪಾವತಿ ನಡವಳಿಕೆಯನ್ನು ಆಧರಿಸಿದ ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್ ಆಗಿದೆ." }
  ],
  pa: [
    { q: "ਮੈਂ ਰਜਿਸਟਰ ਕਿਵੇਂ ਕਰਾਂ?", a: "ਲੌਗਇਨ ਪੇਜ 'ਤੇ 'ਸਾਈਨ ਅੱਪ' 'ਤੇ ਕਲਿੱਕ ਕਰੋ, ਆਪਣੀ ਭੂਮਿਕਾ (ਕਿਸਾਨ/ਖਰੀਦਦਾਰ) ਚੁਣੋ ਅਤੇ ਆਪਣੇ ਵੇਰਵੇ ਭਰੋ।" },
    { q: "ਫਸਲਾਂ ਦੀਆਂ ਕੀਮਤਾਂ ਕਿਵੇਂ ਚੈੱਕ ਕਰੀਏ?", a: "ਡੈਸ਼ਬੋਰਡ 'ਤੇ ਜਾਓ ਅਤੇ ਅਸਲ-ਸਮੇਂ ਦੀਆਂ ਕੀਮਤਾਂ ਲਈ 'ਮਾਰਕੀਟ ਰੁਝਾਨ' ਭਾਗ ਦੀ ਜਾਂਚ ਕਰੋ।" },
    { q: "ਕਰਜ਼ੇ ਲਈ ਅਰਜ਼ੀ ਕਿਵੇਂ ਦੇਣੀ ਹੈ?", a: "'ਕ੍ਰੈਡਿਟ ਅਤੇ ਲੋਨ' ਟੈਬ 'ਤੇ ਜਾਓ ਅਤੇ ਆਪਣੇ ਟਰੱਸਟ ਸਕੋਰ ਦੇ ਆਧਾਰ 'ਤੇ ਆਪਣੀ ਯੋਗਤਾ ਦੀ ਜਾਂਚ ਕਰੋ।" },
    { q: "ਟਰੱਸਟ ਸਕੋਰ ਕੀ ਹੈ?", a: "ਇਹ ਤੁਹਾਡੇ ਖੇਤੀ ਇਤਿਹਾਸ ਅਤੇ ਮੁੜ ਅਦਾਇਗੀ ਦੇ ਵਿਵਹਾਰ 'ਤੇ ਅਧਾਰਤ ਇੱਕ ਕ੍ਰੈਡਿਟ ਸਕੋਰ ਹੈ।" }
  ],
  ur: [
    { q: "میں رجسٹر کیسے کروں؟", a: "لاگ ان پیج پر 'سائن اپ' پر کلک کریں، اپنا کردار (کسان/خریدار) منتخب کریں اور اپنی تفصیلات پُر کریں۔" },
    { q: "فصل کی قیمتیں کیسے چیک کریں؟", a: "ڈیش بورڈ پر جائیں اور حقیقی وقت کی قیمتوں کے لیے 'مارکیٹ کے رجحانات' سیکشن کو چیک کریں۔" },
    { q: "قرض کے لیے درخواست کیسے دیں؟", a: "'کریڈٹ اور لون' ٹیب پر جائیں اور اپنے ٹرسٹ سکور کی بنیاد پر اپنی اہلیت چیک کریں۔" },
    { q: "ٹرسٹ سکور کیا ہے؟", a: "یہ آپ کی کاشتکاری کی تاریخ اور ادائیگی کے رویے پر مبنی کریڈٹ سکور ہے۔" }
  ],
  or: [
    { q: "ମୁଁ କିପରି ପଞ୍ଜିକରଣ କରିବି?", a: "ଲଗଇନ୍ ପୃଷ୍ଠାରେ 'ସାଇନ୍ ଅପ୍' ଉପରେ କ୍ଲିକ କରନ୍ତୁ, ଆପଣଙ୍କର ଭୂମିକା (କୃଷକ / କ୍ରେତା) ଚୟନ କରନ୍ତୁ ଏବଂ ଆପଣଙ୍କର ବିବରଣୀ ପୁରଣ କରନ୍ତୁ |" },
    { q: "ଫସଲ ମୂଲ୍ୟ କିପରି ଯାଞ୍ଚ କରିବେ?", a: "ଡ୍ୟାସବୋର୍ଡକୁ ଯାଆନ୍ତୁ ଏବଂ ପ୍ରକୃତ ସମୟର ମୂଲ୍ୟ ପାଇଁ 'ବଜାର ଧାରା' ବିଭାଗ ଯାଞ୍ଚ କରନ୍ତୁ |" },
    { q: "ଋଣ ପାଇଁ କିପରି ଆବେଦନ କରିବେ?", a: "'କ୍ରେଡିଟ୍ ଏବଂ ଲୋନ୍' ଟ୍ୟାବ୍ କୁ ଯାଆନ୍ତୁ ଏବଂ ଆପଣଙ୍କର ଟ୍ରଷ୍ଟ ସ୍କୋର ଉପରେ ଆଧାର କରି ଆପଣଙ୍କର ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ |" },
    { q: "ଟ୍ରଷ୍ଟ ସ୍କୋର କ’ଣ?", a: "ଏହା ଆପଣଙ୍କର କୃଷି ଇତିହାସ ଏବଂ ପରିଶୋଧ ଆଚରଣ ଉପରେ ଆଧାରିତ ଏକ କ୍ରେଡିଟ୍ ସ୍କୋର |" }
  ],
  ml: [
    { q: "എനിക്ക് എങ്ങനെ രജിസ്റ്റർ ചെയ്യാം?", a: "ലോഗിൻ പേജിലെ 'സൈൻ അപ്പ്' ക്ലിക്ക് ചെയ്യുക, നിങ്ങളുടെ റോൾ (കർഷകൻ/വാങ്ങുന്നയാൾ) തിരഞ്ഞെടുത്ത് നിങ്ങളുടെ വിവരങ്ങൾ പൂരിപ്പിക്കുക." },
    { q: "വിളകളുടെ വില എങ്ങനെ പരിശോധിക്കാം?", a: "ഡാഷ്‌ബോർഡിലേക്ക് പോയി തത്സമയ വിലകൾക്കായി 'മാർക്കറ്റ് ട്രെൻഡുകൾ' വിഭാഗം പരിശോധിക്കുക." },
    { q: "വായ്പയ്ക്ക് എങ്ങനെ അപേക്ഷിക്കാം?", a: "'ക്രെഡിറ്റ് & ലോണുകൾ' ടാബിലേക്ക് നാവിഗേറ്റ് ചെയ്ത് നിങ്ങളുടെ ട്രസ്റ്റ് സ്കോർ അടിസ്ഥാനമാക്കി നിങ്ങളുടെ യോഗ്യത പരിശോധിക്കുക." },
    { q: "ട്രസ്റ്റ് സ്കോർ എന്താണ്?", a: "നിങ്ങളുടെ കാർഷിക ചരിത്രത്തെയും തിരിച്ചടവ് പെരുമാറ്റത്തെയും അടിസ്ഥാനമാക്കിയുള്ള ക്രെഡിറ്റ് സ്കോർ ആണിത്." }
  ],
  bn: [
    { q: "আমি কিভাবে নিবন্ধন করব?", a: "লগইন পৃষ্ঠায় 'সাইন আপ'-এ ক্লিক করুন, আপনার ভূমিকা (কৃষক/ক্রেতা) নির্বাচন করুন এবং আপনার বিবরণ পূরণ করুন।" },
    { q: "ফসলের দাম কিভাবে চেক করবেন?", a: "ড্যাশবোর্ডে যান এবং রিয়েল-টাইম দামের জন্য 'বাজারের প্রবণতা' বিভাগটি দেখুন।" },
    { q: "ঋণের জন্য কিভাবে আবেদন করবেন?", a: "'ক্রেডিট এবং ঋণ' ট্যাবে নেভিগেট করুন এবং আপনার ট্রাস্ট স্কোরের উপর ভিত্তি করে আপনার যোগ্যতা পরীক্ষা করুন।" },
    { q: "ট্রাস্ট স্কোর কি?", a: "এটি আপনার চাষের ইতিহাস এবং পরিশোধের আচরণের উপর ভিত্তি করে একটি ক্রেডিট স্কোর।" }
  ],
  as: [
    { q: "মই কেনেকৈ পঞ্জীয়ন কৰিম?", a: "লগইন পৃষ্ঠাত 'চাইন আপ'ত ক্লিক কৰক, আপোনাৰ ভূমিকা (কৃষক/ক্ৰেতা) বাছনি কৰক আৰু আপোনাৰ সবিশেষ পূৰণ কৰক।" },
    { q: "শস্যৰ মূল্য কেনেকৈ পৰীক্ষা কৰিব?", a: "ডেশ্ববৰ্ডলৈ যাওক আৰু প্ৰকৃত সময়ৰ মূল্যৰ বাবে 'বজাৰৰ ধাৰা' শাখা পৰীক্ষা কৰক।" },
    { q: "ঋণৰ বাবে কেনেকৈ আবেদন কৰিব?", a: "'ক্ৰেডিট আৰু ঋণ' টেবত নেভিগেট কৰক আৰু আপোনাৰ ট্ৰাষ্ট স্ক'ৰৰ ওপৰত ভিত্তি কৰি আপোনাৰ যোগ্যতা পৰীক্ষা কৰক।" },
    { q: "ট্ৰাষ্ট স্ক’ৰ কি?", a: "ই আপোনাৰ কৃষি ইতিহাস আৰু পৰিশোধৰ আচৰণৰ ওপৰত ভিত্তি কৰি এটা ক্ৰেডিট স্ক'ৰ।" }
  ]
};

const ChatWidget = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentLang = i18n.language || 'en';
  const synth = window.speechSynthesis;

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = {
        en: "Hello! How can I help you today? Select a question below.",
        hi: "नमस्ते! आज मैं आपकी कैसे मदद कर सकता हूँ? नीचे एक प्रश्न चुनें।",
        ta: "வணக்கம்! இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்? கீழே ஒரு கேள்வியைத் தேர்ந்தெடுக்கவும்.",
        mr: "नमस्कार! आज मी तुम्हाला कशी मदत करू शकतो? खालील प्रश्न निवडा.",
        gu: "નમસ્તે! આજે હું તમને કેવી રીતે મદદ કરી શકું? નીચે એક પ્રશ્ન પસંદ કરો.",
        te: "హలో! ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను? క్రింద ఒక ప్రశ్నను ఎంచుకోండి.",
        kn: "ನಮಸ್ಕಾರ! ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು? ಕೆಳಗಿನ ಪ್ರಶ್ನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
        pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ? ਹੇਠਾਂ ਇੱਕ ਸਵਾਲ ਚੁਣੋ।",
        ur: "ہیلو! میں آج آپ کی کیسے مدد کر سکتا ہوں؟ نیچے ایک سوال منتخب کریں۔",
        or: "ନମସ୍କାର! ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି? ନିମ୍ନରେ ଏକ ପ୍ରଶ୍ନ ବାଛନ୍ତୁ |",
        ml: "ഹലോ! ഇന്ന് എനിക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും? താഴെ ഒരു ചോദ്യം തിരഞ്ഞെടുക്കുക.",
        bn: "হ্যালো! আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি? নিচে একটি প্রশ্ন নির্বাচন করুন।",
        as: "নমস্কাৰ! আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰো? তলত এটা প্ৰশ্ন বাছনি কৰক।"
      };
      
      const msgText = welcomeMsg[currentLang] || welcomeMsg['en'];
      setMessages([{ 
        type: 'bot', 
        text: msgText 
      }]);
      
      // Speak welcome message automatically
      speak(msgText);
    }
  }, [isOpen, currentLang]);

  const handleQuestionClick = (qa) => {
    // Add user question
    setMessages(prev => [...prev, { type: 'user', text: qa.q }]);
    
    // Simulate bot thinking delay
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: qa.a }]);
      speak(qa.a);
    }, 500);
  };

  const speak = (text) => {
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a voice for the current language
    const voices = synth.getVoices();
    // Map i18n codes to BCP 47 language tags
    const langMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'te': 'te-IN',
      'kn': 'kn-IN',
      'pa': 'pa-IN',
      'ur': 'ur-IN',
      'or': 'or-IN',
      'ml': 'ml-IN',
      'bn': 'bn-IN',
      'as': 'as-IN'
    };
    
    const targetLang = langMap[currentLang] || 'en-US';
    
    // Robust voice selection
    let voice = voices.find(v => v.lang === targetLang);
    if (!voice) {
        voice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
    }
    
    if (voice) {
      utterance.voice = voice;
    }
    utterance.lang = targetLang;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    synth.cancel();
    setIsSpeaking(false);
  };

  const currentFaqs = faqData[currentLang] || faqData['en'];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-green-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <span className="font-bold">Help Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              {isSpeaking && (
                <button onClick={stopSpeaking} className="hover:bg-green-700 p-1 rounded-full transition-colors" title="Stop Speaking">
                  <StopCircle size={18} />
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="hover:bg-green-700 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 h-80 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  msg.type === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                  {msg.type === 'bot' && (
                    <button 
                      onClick={() => speak(msg.text)}
                      className="ml-2 inline-block align-middle text-gray-400 hover:text-green-600"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Options */}
          <div className="p-3 bg-white border-t border-gray-100 max-h-40 overflow-y-auto">
            <p className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Suggested Questions</p>
            <div className="flex flex-col gap-2">
              {currentFaqs.map((qa, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuestionClick(qa)}
                  className="text-left text-sm p-2 hover:bg-green-50 text-green-700 rounded-md transition-colors border border-transparent hover:border-green-100 truncate"
                >
                  {qa.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'} text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatWidget;
