import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      appName: 'Stadium Ticket Pro',
      home: 'Accueil',
      matches: 'Matchs',
      login: 'Connexion',
      register: 'Inscription',
      logout: 'Déconnexion',
      searchMatches: 'Rechercher des matchs',
      selectSeats: 'Choisir vos sièges',
      zone: 'Zone',
      price: 'Prix',
      available: 'Disponible',
      reserved: 'Réservé',
      sold: 'Vendu',
      lockSeats: 'Réserver ces sièges',
      checkout: 'Payer',
      total: 'Total',
      footer: 'Projet réalisé par : Amine Annouka',
      email: 'Email',
      password: 'Mot de passe',
      nom: 'Nom',
      prenom: 'Prénom',
      demoAccounts: 'Comptes démo',
    },
  },
  ar: {
    translation: {
      appName: 'تذاكر الملاعب برو',
      home: 'الرئيسية',
      matches: 'المباريات',
      login: 'تسجيل الدخول',
      register: 'التسجيل',
      logout: 'تسجيل الخروج',
      searchMatches: 'البحث عن مباريات',
      selectSeats: 'اختر مقاعدك',
      zone: 'المنطقة',
      price: 'السعر',
      available: 'متاح',
      reserved: 'محجوز',
      sold: 'مباع',
      lockSeats: 'حجز هذه المقاعد',
      checkout: 'الدفع',
      total: 'المجموع',
      footer: 'المشروع من إنجاز : أمين أنوكة',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      nom: 'الاسم',
      prenom: 'اللقب',
      demoAccounts: 'حسابات تجريبية',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
});

export default i18n;
