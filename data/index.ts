export const navItems = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  { name: "Testimonials", link: "#testimonials" },
  { name: "Contact", link: "#contact" },
];

export const gridItems = [
  {
    id: 1,
    title: "I prioritize client collaboration, fostering open communication",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/b1.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "I'm very flexible with time zone communications",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Tech enthusiast with a passion for development.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title:
      "Currently building a JS Game for learning medical students like for Anatomy Class, . . .etc.",
    description: "The Inside Scoop",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export const projects = [
  {
    id: 1,
    title: "PHARMAWISE | PW",
    tp: "PW",
    des: "A multilingual full-stack healthcare platform improving medication education across Ethiopia. Features internationalization (English, Amharic, Afaan Oromo) with a scalable React + TypeScript frontend and MongoDB backend.",
    img: "/pw.png",
    iconLists: ["/re.svg", "/ts.svg", "/tail.svg", "/node.svg", "/mongodb.svg"],
    link: "https://pharmawise-delta.vercel.app/",
  },
  {
    id: 2,
    title: "School Management System | SJCSA",
    tp: "SJCSA",
    des: "A complete digital ecosystem for school administration featuring secure JWT/RBAC portals for students, parents, teachers, finance, and library branches built on a scalable microservices architecture.",
    img: "/sjcs.png",
    iconLists: ["/re.svg", "/ts.svg", "/tail.svg", "/node.svg", "/mongodb.svg"],
    link: "https://sjcs-web-a65p.vercel.app",
  },
  {
    id: 3,
    title: "TrustPay: Payment Verification Platform",
    tp: "TrustPay",
    des: "A cutting-edge fintech platform verifying digital transactions via IDs, QR codes, and OCR processing. Includes a React Native mobile merchant app and an Express administrative dashboard.",
    img: "/trustpay.png", // Replace with your actual asset path
    iconLists: [
      "/apple.svg",
      "/re.svg",
      "/ts.svg",
      "/node.svg",
      "/express.svg",
    ],
    link: "#", // Add your link/repository here if public
  },
  {
    id: 4,
    title: "Bed Notification System | BNS",
    tp: "BNS",
    des: "A real-time hospital dashboard system for patient management, live bed availability monitoring, and streamlined admission notification workflows.",
    img: "/bns.png",
    iconLists: ["/re.svg", "/ts.svg", "/tail.svg", "/gsap.svg"],
    link: "https://bednotify.vercel.app",
  },
  {
    id: 5,
    title: "Procedure Notifier | PN",
    tp: "Procedure Notifier",
    des: "Streamlines real-time clinical procedure notifications to optimize learning opportunities and prevent overcrowding in medical environments.",
    img: "/pn.png",
    iconLists: ["/next.svg", "/ts.svg", "/tail.svg", "/three.svg", "/re.svg"],
    link: "https://pn-jet.vercel.app",
  },
  {
    id: 6,
    title: "Adama Bakery & Cake",
    tp: "nyAdamaCake",
    des: "A comprehensive bakery ordering platform featuring customer workflows, live order tracking, online payment integration, and a dedicated React Native mobile app for merchants.",
    img: "/abc.png",
    iconLists: ["/apple.svg", "/re.svg", "/ts.svg", "/tail.svg", "/three.svg"],
    link: "https://adama-bakery.vercel.app",
  },
  {
    id: 7,
    title: "JobsPark: Job Marketplace Platform",
    tp: "JobsPark",
    des: "A complete job marketplace platform featuring robust user authentication, Role-Based Access Control (RBAC), an Express/MongoDB backend, and seamless Chapa payment integration.",
    img: "/jobspark.png", // Replace with your actual asset path
    iconLists: [
      "/re.svg",
      "/node.svg",
      "/mongodb.svg",
      "/tail.svg",
      "/chapa.svg",
    ],
    link: "#",
  },
  {
    id: 8,
    title: "NYDEV Learning & AI Tutoring Platform",
    tp: "NYDL",
    des: "An enterprise SaaS learning management system integrating instructor/student dashboards, quiz workflows, TanStack Query data management, and adaptive AI-ready learning modules.",
    img: "/nydl.png", // Replace with your actual asset path
    iconLists: [
      "/apple.svg",
      "/re.svg",
      "/ts.svg",
      "/tail.svg",
      "/reactquery.svg",
    ],
    link: "#",
  },
  {
    id: 9,
    title: "GreenLeaf: My Personal Herbarium (አረንጓዴ ቅጠል)",
    tp: "GreenLeaf",
    des: "A mobile application designed for plant enthusiasts and researchers to seamlessly record plant species, log field observations, and manage botanical records.",
    img: "/p5.png",
    iconLists: ["/android.svg", "/flutter.svg", "/django.svg", "/sqlite.svg"],
    link: "https://github.com/yamneg96/GreenLeaf",
  },
  {
    id: 10,
    title: "Ethiopian Banking App Reviews Analysis",
    tp: "Banking Sentiment Analysis",
    des: "A data-driven NLP project that scraps and analyzes over 1,200+ Google Play reviews from major Ethiopian banking apps using DistilBERT to classify sentiments with 90%+ coverage.",
    img: "/p6.png",
    iconLists: ["/python.svg", "/bert.svg", "/sklearn.svg", "/nlp.svg"],
    link: "https://github.com/yamneg96/Customer-Experience-Analytics",
  },
  {
    id: 11,
    title: "AlphaCare Insurance Solutions: Risk & Premium Optimization",
    tp: "Insurance ML Optimization",
    des: "A machine learning solution for car insurance risk assessment utilizing XGBoost predictive models, DVC experiment tracking, and SHAP for transparent, explainable AI pricing.",
    img: "/p7.png",
    iconLists: ["/python.svg", "/xgboost.svg", "/sklearn.svg", "/dvc.svg"],
    link: "https://github.com/yamneg96/acis-risk-analysis",
  },
  {
    id: 12,
    title: "Nike Clone: Your Ultimate Sportswear Destination",
    tp: "nyNIKE",
    des: "Shop a wide range of athletic gear and footwear, featuring fluid layouts and user-friendly navigation.",
    img: "/p2.png",
    iconLists: ["/tail.svg", "/ts.svg", "/re.svg"],
    link: "https://nynike.netlify.app",
  },
];

export const testimonials = [
  {
    quote:
      "Collaborating with Yamlak was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Yamlak's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    name: "Abenezer Negash",
    title: "Radiology Technologist",
    img: "/pro0.jpg",
  },
  {
    quote:
      "Working with Yamlak was a game-changer for our project. His innovative approach and deep understanding of web development made all the difference. Highly recommended for anyone looking to enhance their online presence!",
    name: "Sana Matusala",
    title: "Developer and Civil Engineer",
    img: "/pro1.jpg",
  },
  {
    quote:
      "Teaming with Yamlak exceeded my expectations. His professionalism and creativity transformed our ideas into reality. If you want to elevate your website, Yamlak is the right choice!",
    name: "Besukal Getamesay",
    title: "Electrical Engineer & IT Technologist",
    img: "/pro2.jpg",
  },
  {
    quote:
      "Yamlak's expertise and dedication were invaluable to our project. He not only met our needs but also provided insights that improved our overall strategy. A fantastic partner for any web development journey!",
    name: "Samuel Tesfaye",
    title: "Economist & Architectural Engineer",
    img: "/pro3.jpg",
  },
];

export const companies = [
  {
    id: 1,
    name: "cloudinary",
    img: "/cloud.svg",
    nameImg: "/cloudName.svg",
  },
  {
    id: 2,
    name: "appwrite",
    img: "/app.svg",
    nameImg: "/appName.svg",
  },
  {
    id: 3,
    name: "HOSTINGER",
    img: "/host.svg",
    nameImg: "/hostName.svg",
  },
  {
    id: 4,
    name: "stream",
    img: "/s.svg",
    nameImg: "/streamName.svg",
  },
  {
    id: 5,
    name: "docker.",
    img: "/dock.svg",
    nameImg: "/dockerName.svg",
  },
];

export const workExperience = [
  {
    id: 1,
    title: "Frontend Engineer Intern",
    desc: "Assisted in the development of a web-based platform using React.js, enhancing interactivity.",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
  },
  {
    id: 2,
    title: "Mobile App Dev",
    desc: "Designed and developed mobile app for both iOS & Android platforms using ReactNative.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp2.svg",
  },
  {
    id: 3,
    title: "Backend Developer Intern",
    desc: "Utilized Django to develop a robust backend for a mobile application, integration with Flutter and Jetpack.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp3.svg",
  },
  {
    id: 4,
    title: "Lead Frontend Developer",
    desc: "Developed and maintained user-facing features using modern frontend technologies.",
    className: "md:col-span-2",
    thumbnail: "/exp4.svg",
  },
];

export const socialMedia = [
  {
    id: 1,
    name: "GitHub",
    img: "/git.svg",
    link: "https://github.com/yamneg96",
    label: "Check out my repositories on GitHub",
    duration: 3000,
  },
  {
    id: 2,
    name: "X",
    img: "/twit.svg",
    link: "https://x.com/MtntL55385",
    label: "Follow my latest updates on X",
    duration: 3000,
  },
  {
    id: 3,
    name: "Telegram",
    img: "/tg.png",
    link: "https://t.me/user1name_123",
    label: "Let's chat directly on Telegram",
    duration: 3000,
  },
  {
    id: 4,
    name: "Upwork",
    img: "/upwork.png",
    link: "https://www.upwork.com/freelancers/~01f9a25c19a4aae39e?mp_source=share",
    label: "Available for Hire! Let's work together",
    duration: 6000, // 2x longer than the others
  },
];
