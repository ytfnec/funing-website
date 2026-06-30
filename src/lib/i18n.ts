export interface Translations {
  zh: Record<string, string>;
  en: Record<string, string>;
}

const translations: Translations = {
  zh: {
    // Nav
    nav_home: '首页',
    nav_about: '关于我们',
    nav_products: '产品中心',
    nav_news: '新闻资讯',
    nav_contact: '联系我们',
    nav_lang: 'EN',

    // Hero
    hero_bg_image: '',
    hero_title: '烟台富宁电子有限公司',
    hero_subtitle: '专业电子制造服务商',
    hero_cta: '了解更多',

    // About
    about_image: '',
    about_title: '关于我们',
    about_subtitle: '专注电子制造，品质值得信赖',
    about_desc: '烟台富宁电子有限公司成立于多年以前，是一家专业从事电子元器件制造、PCB组装及整机制造的高新技术企业。公司拥有先进的生产设备和专业的技术团队，为客户提供从设计到量产的一站式电子制造服务。',
    about_desc2: '我们始终坚持"质量第一、客户至上"的经营理念，通过了ISO9001质量管理体系认证，产品广泛应用于消费电子、工业控制、汽车电子、医疗设备等领域。',
    about_feature1_title: '专业技术',
    about_feature1_desc: '拥有多年电子制造经验的技术团队',
    about_feature2_title: '品质保障',
    about_feature2_desc: 'ISO9001认证，严格质量控制体系',
    about_feature3_title: '快速交付',
    about_feature3_desc: '高效生产流程，确保准时交付',

    // Products
    prod_pcb_image: '',
    prod_pcb_title: 'PCB制造',
    prod_pcb_desc: '专业PCB设计与制造，多层板、高频板、HDI板等各类PCB产品',
    prod_pcba_image: '',
    prod_pcba_title: 'PCBA组装',
    prod_pcba_desc: 'SMT贴片、DIP插件、整机组装等全流程PCBA服务',
    prod_odm_image: '',
    prod_odm_title: 'ODM服务',
    prod_odm_desc: '从产品设计到量产的一站式ODM解决方案',
    prod_viewmore: '查看更多产品',

    // News
    news_title: '新闻资讯',
    news_subtitle: '了解公司最新动态',
    news_readmore: '阅读更多',
    news_placeholder_image: '',

    // Contact
    contact_title: '联系我们',
    contact_subtitle: '期待与您的合作',
    contact_address_label: '地址',
    contact_address: '山东省烟台市',
    contact_phone_label: '电话',
    contact_phone: '',
    contact_email_label: '邮箱',
    contact_email: '',
    contact_message_placeholder: '请输入您的留言',
    contact_submit: '发送留言',

    // Footer
    footer_copyright: '© 2024 烟台富宁电子有限公司 版权所有',
  },
  en: {
    // Nav
    nav_home: 'Home',
    nav_about: 'About',
    nav_products: 'Products',
    nav_news: 'News',
    nav_contact: 'Contact',
    nav_lang: '中文',

    // Hero
    hero_bg_image: '',
    hero_title: 'Yantai Funing Electronics Co., Ltd.',
    hero_subtitle: 'Professional Electronics Manufacturing Services',
    hero_cta: 'Learn More',

    // About
    about_image: '',
    about_title: 'About Us',
    about_subtitle: 'Dedicated to Electronics Manufacturing, Trusted Quality',
    about_desc: 'Yantai Funing Electronics Co., Ltd. is a high-tech enterprise specializing in electronic component manufacturing, PCB assembly, and complete machine manufacturing. With advanced production equipment and a professional technical team, we provide one-stop electronics manufacturing services from design to mass production.',
    about_desc2: 'We always adhere to the business philosophy of "Quality First, Customer Supreme". We are ISO9001 certified, and our products are widely used in consumer electronics, industrial control, automotive electronics, medical equipment, and other fields.',
    about_feature1_title: 'Professional Technology',
    about_feature1_desc: 'Experienced technical team with years of electronics manufacturing expertise',
    about_feature2_title: 'Quality Assurance',
    about_feature2_desc: 'ISO9001 certified with strict quality control system',
    about_feature3_title: 'Fast Delivery',
    about_feature3_desc: 'Efficient production process ensuring on-time delivery',

    // Products
    prod_pcb_image: '',
    prod_pcb_title: 'PCB Manufacturing',
    prod_pcb_desc: 'Professional PCB design and manufacturing, including multi-layer, high-frequency, and HDI boards',
    prod_pcba_image: '',
    prod_pcba_title: 'PCBA Assembly',
    prod_pcba_desc: 'Full-process PCBA services including SMT, DIP, and complete machine assembly',
    prod_odm_image: '',
    prod_odm_title: 'ODM Services',
    prod_odm_desc: 'One-stop ODM solutions from product design to mass production',
    prod_viewmore: 'View More Products',

    // News
    news_title: 'News',
    news_subtitle: 'Stay Updated with Our Latest',
    news_readmore: 'Read More',
    news_placeholder_image: '',

    // Contact
    contact_title: 'Contact Us',
    contact_subtitle: 'Looking Forward to Cooperating with You',
    contact_address_label: 'Address',
    contact_address: 'Yantai, Shandong, China',
    contact_phone_label: 'Phone',
    contact_phone: '',
    contact_email_label: 'Email',
    contact_email: '',
    contact_message_placeholder: 'Enter your message',
    contact_submit: 'Send Message',

    // Footer
    footer_copyright: '© 2024 Yantai Funing Electronics Co., Ltd. All Rights Reserved',
  },
};

export function getTranslations(): Translations {
  return translations;
}

export default translations;
