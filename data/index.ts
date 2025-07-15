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
    title: "Currently building a JS Animation library",
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
    title: "A Movie Web-App for Trending Movies",
    tp: "nyMOVIES",
    des: "Explore movies from old to recent with search optimization feater added.",
    img: "/p1.png",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/fm.svg"],
    link: "https://nymovies.netlify.app",
  },
  {
    id: 2,
    title: "Nike Clone: Your Ultimate Sportswear Destination",
    tp: "nyNIKE",
    des: "Shop a wide range of athletic gear and footwear, featuring user-friendly navigation.",
    img: "/p2.png",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/stream.svg", "/c.svg"],
    link: "https://nynike.netlify.app",
  },
  {
    id: 3,
    title: "Adama Bakery & Cake",
    tp: "nyAdamaCake",
    des: "Indulge in a variety of delicious cakes and pastries, made with quality ingredients and available for custom orders.",
    img: "/p3.png",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/c.svg"],
    link: "https://adamabakery.netlify.app",
  },
  {
    id: 4,
    title: "Admin Dashboard: Centralized Control Panel",
    tp: "nyDashboard",
    des: "Manage and monitor your application's performance with intuitive analytics, user management, and customizable settings.",
    img: "/p4.png",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/three.svg", "/gsap.svg"],
    link: "https://nydashboard.netlify.app",
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
      "Collaborating with Yamlak was a game-changer for our project. His innovative approach and deep understanding of web development made all the difference. Highly recommended for anyone looking to enhance their online presence!",
    name: "Sana Matusala",
    title: "Developer and Civil Engineer",
    img: "/profile.svg",
  },
  {
    quote:
      "Working with Yamlak exceeded our expectations. His professionalism and creativity transformed our ideas into reality. If you want to elevate your website, Yamlak is the right choice!",
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
    title: "Mobile App Dev - JSM Tech",
    desc: "Designed and developed mobile app for both iOS & Android platforms using React Native.",
    className: "md:col-span-2", // change to md:col-span-2
    thumbnail: "/exp2.svg",
  },
  {
    id: 3,
    title: "Freelance App Dev Project",
    desc: "Led the dev of a mobile app for a client, from initial concept to deployment on app stores.",
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
    img: "/git.svg",
    link: "https://github.com/yamneg96",
  },
  {
    id: 2,
    img: "/twit.svg",
    link: "https://x.com/MtntL55385",
  },
  {
    id: 3,
    img: "/tg.png",
    link: "https://t.me/user1name_123",
  },
];
