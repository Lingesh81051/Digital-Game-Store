// backend/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

// Load environment variables (adjust path if needed)
dotenv.config({ path: './backend/.env' });

const sampleProducts = [
  {
    name: 'GTA V',
    description: 'A sprawling open-world game set in Los Santos that delivers cinematic storytelling, intense missions, and endless freedom in the criminal underworld.',
    price: 19.99,
    countInStock: 10,
    image: '/images/games/gta v.jpg',
    categories: ['Action', 'Adventure', 'Trending Games', 'Top Sellers'],
    trailer: 'https://www.youtube.com/embed/N-xHcvug3WI?si=-oD706m00h_-7ZnA',
    developer: 'Rockstar Games',
    releaseDate: new Date('2013-09-17'),
    platform: 'PC, PS4, Xbox One',
    ratings: 4.8,
    minRequirements: {
      os: "Windows 7 Service Pack 1 / Windows 8.1 / Windows 10",
      processor: "Intel Core 2 Quad CPU Q6600 @ 2.40GHz / AMD Phenom 9850 Quad-Core @ 2.5GHz",
      ram: "4 GB",
      hardDrive: "65 GB free",
      videoCard: "NVIDIA 9800 GT 1GB / AMD HD 4870 1GB (DX 10, 10.1, 11)",
      soundCard: "DirectX 10 compatible",
      directX: "10",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: 'Tom Clancy\'s Splinter Cell: Blacklist',
    description: 'A stealth action thriller where you become an elite operative tasked with covert missions, blending tactical espionage with high-stakes adventure.',
    price: 29.99,
    countInStock: 5,
    image: '/images/games/splinter cell.jpg',
    categories: ['Action', 'Adventure', 'New Releases', 'Featured Discounts', 'Top Sellers', 'Most popular'],
    trailer: 'https://www.youtube.com/embed/wYGoFH6bWXg?si=0YEyrnRUejuXP8QX',
    developer: 'Ubisoft',
    releaseDate: new Date('2013-08-20'),
    platform: 'PC, PS3, Xbox 360',
    ratings: 4.3,
    minRequirements: {
      os: "Windows 7 / Windows 8 / Windows 10",
      processor: "Intel Core 2 Duo E8400 @ 3.00GHz / AMD Athlon X2 6400+",
      ram: "2 GB",
      hardDrive: "16 GB free",
      videoCard: "NVIDIA GeForce 8800 GT 512MB / ATI Radeon HD 3870 512MB",
      soundCard: "DirectX 9.0c compatible",
      directX: "9.0c",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: 'The Last Of Us Part 1',
    description: 'A gripping, emotional survival drama set in a post-apocalyptic world where every decision has life-altering consequences.',
    price: 29.99,
    countInStock: 5,
    image: '/images/games/tlou 1.jpg',
    categories: ['Action', 'Adventure', 'New Releases', 'Featured Discounts', 'Top Sellers', 'Most popular'],
    trailer: 'https://www.youtube.com/embed/CxVyuE2Nn_w?si=3Qy4npWvFvNVjwUS',
    developer: 'Naughty Dog',
    releaseDate: new Date('2013-06-14'),
    platform: 'PS3, PS4',
    ratings: 4.9,
    minRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i5-2500K / AMD FX-8350",
      ram: "8 GB",
      hardDrive: "50 GB free",
      videoCard: "NVIDIA GeForce GTX 660 / AMD Radeon HD 7870",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: 'Prince of Persia: The Two Thrones',
    description: 'An action-adventure classic that combines acrobatic platforming and sword-fighting with a rich narrative steeped in Persian mythology.',
    price: 29.99,
    countInStock: 5,
    image: '/images/games/prince of persia.jpg',
    categories: ['Action', 'Adventure', 'New Releases', 'Featured Discounts'],
    trailer: 'https://www.youtube.com/embed/UTE4lU-Of0c?si=mpDVVg8xRF4nMXl1',
    developer: 'Ubisoft',
    releaseDate: new Date('2005-11-16'),
    platform: 'PC, PS2, Xbox',
    ratings: 4.5,
    minRequirements: {
      os: "Windows XP SP3 / Windows Vista",
      processor: "Intel Pentium 4 3.0GHz / AMD Athlon 64 3200+",
      ram: "1.5 GB",
      hardDrive: "8 GB free",
      videoCard: "NVIDIA GeForce 6800 / ATI Radeon 9800 Pro",
      soundCard: "DirectX 9.0c compatible",
      directX: "9.0c",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: 'Red Dead Redemption 2',
    description: 'An epic western saga offering an expansive open world, deep character storytelling, and immersive life in the fading days of the Wild West.',
    price: 29.99,
    countInStock: 5,
    image: '/images/games/rdr2.jpeg',
    categories: ['Action', 'Adventure', 'Most Played', 'Trending Games'],
    trailer: 'https://www.youtube.com/embed/gmA6MrX81z4?si=O4E2HALHnxRtFnHK',
    developer: 'Rockstar Games',
    releaseDate: new Date('2018-10-26'),
    platform: 'PC, PS4, Xbox One',
    ratings: 4.7,
    minRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i7-4770K / AMD Ryzen 5 1500X",
      ram: "8 GB",
      hardDrive: "150 GB free",
      videoCard: "NVIDIA GeForce GTX 770 2GB / AMD Radeon R9 280",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: 'Sekiro Shadow Die Twice',
    description: 'A challenging samurai action game that rewards precision and timing in brutal combat, set against a mythic, war-torn Japan.',
    price: 29.99,
    countInStock: 5,
    image: '/images/games/sekiro.jpg',
    categories: ['Action', 'Adventure', 'Most popular'],
    trailer: 'https://www.youtube.com/embed/rXMX4YJ7Lks?si=Q8gMitrl_pRmbb_r',
    developer: 'FromSoftware',
    releaseDate: new Date('2019-03-22'),
    platform: 'PC, PS4, Xbox One',
    ratings: 4.6,
    minRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i5-2400 / AMD FX-6300",
      ram: "4 GB",
      hardDrive: "50 GB free",
      videoCard: "NVIDIA GeForce GTX 660 / AMD Radeon HD 7870",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: 'Ghost of Tsushima',
    description: 'A visually stunning open-world adventure that immerses you in feudal Japan, where honor and stealth define the lone samurai\'s path.',
    price: 29.99,
    countInStock: 5,
    image: '/images/games/got.jpg',
    categories: ['Action', 'Adventure', 'Top Sellers', 'New Releases'],
    trailer: 'https://www.youtube.com/embed/EzWBNwhb870?si=srytelOW-N5RzY4S',
    developer: 'Sucker Punch Productions',
    releaseDate: new Date('2020-07-17'),
    platform: 'PS4, PS5',
    ratings: 4.8,
    minRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i5-2500K / AMD Ryzen 5 1600",
      ram: "8 GB",
      hardDrive: "50 GB free",
      videoCard: "NVIDIA GeForce GTX 970 / AMD Radeon RX 480",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: 'God of War 2018',
    description: 'A reimagined mythological epic that blends visceral combat and heartfelt narrative as Kratos embarks on a journey through Norse realms.',
    price: 29.99,
    countInStock: 5,
    image: '/images/games/god of war.jpg',
    categories: ['Action', 'Adventure', 'Trending Games', 'Featured Discounts'],
    trailer: 'https://www.youtube.com/embed/RQK_40a0XUY?si=HrqgbuNco7BHHnVm',
    developer: 'Santa Monica Studio',
    releaseDate: new Date('2018-04-20'),
    platform: 'PS4, PS5, PC',
    ratings: 4.9,
    minRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i5-3570K / AMD FX-8350",
      ram: "8 GB",
      hardDrive: "70 GB free",
      videoCard: "NVIDIA GeForce GTX 760 / AMD Radeon R7 260X",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "Uncharted 4: A Thief's End",
    description: 'A cinematic treasure-hunting adventure featuring breathtaking set-pieces, witty banter, and daring escapades across exotic locales.',
    price: 29.99,
    countInStock: 5,
    image: '/images/games/uncharted.jpg',
    categories: ['Action', 'Adventure', 'New Releases'],
    trailer: 'https://www.youtube.com/embed/xeMA3O9pfiY?si=JY9uegwtR5woZhEg',
    developer: 'Naughty Dog',
    releaseDate: new Date('2016-05-10'),
    platform: 'PS4',
    ratings: 4.7,
    minRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i3-6100 / AMD FX-4300",
      ram: "4 GB",
      hardDrive: "40 GB free",
      videoCard: "NVIDIA GeForce GTX 750 Ti / AMD Radeon R7 360",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: 'Manor Lords',
    description: 'A medieval strategy and simulation game where you build kingdoms, manage resources, and lead epic battles to forge your legacy.',
    price: 29.99,
    countInStock: 5,
    image: '/images/games/manor lords.jpg',
    categories: ['Action', 'Adventure', 'Trending Games', 'Most Played'],
    trailer: 'https://www.youtube.com/embed/hhk4HAxLhq8?si=hr5zdmcVkijcAv7u',
    developer: 'WolfEye Studios',
    releaseDate: new Date('2022-03-01'),
    platform: 'PC',
    ratings: 4.2,
    minRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i5-2400 / AMD FX-6300",
      ram: "4 GB",
      hardDrive: "60 GB free",
      videoCard: "NVIDIA GeForce GTX 660 / AMD Radeon HD 7870",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: 'Tomb Raider 2013',
    description: 'A medieval strategy and simulation game where you build kingdoms, manage resources, and lead epic battles to forge your legacy.',
    price: 29.99,
    countInStock: 5,
    image: '/images/games/tomb raider.jpg',
    categories: ['Action', 'Adventure', 'Featured Discounts'],
    trailer: 'https://www.youtube.com/embed/nFBrgeSjj-0?si=LxLk5ycYxl3aZpcp',
    developer: 'Crystal Dynamics',
    releaseDate: new Date('2013-03-05'),
    platform: 'PC, PS3, Xbox 360',
    ratings: 4.4,
    minRequirements: {
      os: "Windows 7 / Windows 8",
      processor: "Intel Core 2 Duo E8400 / AMD Athlon X2 6400+",
      ram: "1.5 GB",
      hardDrive: "8 GB free",
      videoCard: "NVIDIA GeForce 8800 GT / ATI Radeon HD 3870",
      soundCard: "DirectX 9.0c compatible",
      directX: "9.0c",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "Assassin's Creed",
    description: 'An immersive historical adventure that combines stealth, parkour, and rich narratives to uncover the secrets of a centuries-old conspiracy.',
    price: 29.99,
    countInStock: 5,
    image: '/images/games/assassin creed.jpg',
    categories: ['Action', 'Adventure', 'Trending Games', 'Top Sellers'],
    trailer: 'https://www.youtube.com/embed/9ILkoZC5vnI?si=w8uHFnZ0CpUzO_TK',
    developer: 'Ubisoft',
    releaseDate: new Date('2007-11-13'),
    platform: 'PC, PS3, Xbox 360',
    ratings: 4.3,
    minRequirements: {
      os: "Windows XP / Windows Vista",
      processor: "Intel Pentium 4 3.0GHz / AMD Athlon 64 3200+",
      ram: "1.5 GB",
      hardDrive: "8 GB free",
      videoCard: "NVIDIA GeForce 6800 / ATI Radeon 9800 Pro",
      soundCard: "DirectX 9.0c compatible",
      directX: "9.0c",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: 'Watch Dogs 1',
    description: 'An innovative open-world game where hacking is your most powerful tool in a digital battleground, set in a hyper-connected modern city.',
    price: 29.99,
    countInStock: 5,
    image: '/images/games/watch dogs.jpg',
    categories: ['Action', 'Adventure', 'Trending Games', 'Most popular'],
    trailer: 'https://www.youtube.com/embed/PFko4Kut39s?si=lb-amrmpjvVi2pv-',
    developer: 'Ubisoft',
    releaseDate: new Date('2014-05-27'),
    platform: 'PC, PS4, Xbox One',
    ratings: 4.2,
    minRequirements: {
      os: "Windows 8.1 / Windows 10",
      processor: "Intel Core i3-2100 / AMD FX-4100",
      ram: "4 GB",
      hardDrive: "25 GB free",
      videoCard: "NVIDIA GeForce GTX 550 Ti / AMD Radeon HD 7770",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: 'Heavy Rain',
    description: 'A cinematic interactive drama where your choices shape a suspenseful narrative filled with mystery, tension, and emotional depth.',
    price: 29.99,
    countInStock: 5,
    image: '/images/games/heavy rain.jpg',
    categories: ['Action', 'Adventure', 'New Releases'],
    trailer: 'https://www.youtube.com/embed/e4NvqmZ_SiE?si=FWLUf_9pX1Xsdm_7',
    developer: 'Quantic Dream',
    releaseDate: new Date('2010-02-23'),
    platform: 'PC, PS3, PS4',
    ratings: 4.1,
    minRequirements: {
      os: "Windows 7 / Windows 8",
      processor: "Intel Core 2 Duo E8400 / AMD Athlon X2 6400+",
      ram: "2 GB",
      hardDrive: "16 GB free",
      videoCard: "NVIDIA GeForce 8800 GT / ATI Radeon HD 3870",
      soundCard: "DirectX 9.0c compatible",
      directX: "9.0c",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "Marvel's Spiderman",
    description: 'An action-packed superhero adventure that lets you swing through a vibrant New York City while battling iconic villains in high-flying combat.',
    price: 39.99,
    countInStock: 15,
    image: '/images/games/marvel spiderman.jpg',
    categories: ['Action', 'Adventure', 'Trending Games', 'Featured Discounts'],
    trailer: 'https://www.youtube.com/embed/1E051WtpyWg?si=otEmh2eZ78MjsSpz',
    developer: "Insomniac Games",
    releaseDate: new Date('2018-09-07'),
    platform: 'PS4, PS5, PC',
    ratings: 4.8,
    minRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i5-6600K / AMD Ryzen 5 2600",
      ram: "8 GB",
      hardDrive: "50 GB free",
      videoCard: "NVIDIA GeForce GTX 970 / AMD Radeon RX 480",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "Prototype 1",
    description: 'A fast-paced, open-world action game where you harness devastating abilities to battle a mysterious outbreak and unravel a hidden conspiracy.',
    price: 39.99,
    countInStock: 15,
    image: '/images/games/prototype.jpg',
    categories: ['Action', 'Adventure', 'Most Played', 'Fighting', 'Stealth', 'Survival'],
    trailer: 'https://www.youtube.com/embed/Nc3XptLacMM?si=XQR5-tYUN2WzSIOq',
    developer: 'Radical Entertainment',
    releaseDate: new Date('2009-05-20'),
    platform: 'PC, PS3, Xbox 360',
    ratings: 4.0,
    minRequirements: {
      os: "Windows 7",
      processor: "Intel Core i5",
      ram: "4 GB",
      hardDrive: "50 GB free",
      videoCard: "NVIDIA GTX 660",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "The Callisto Protocol",
    description:  'A survival horror experience set on Jupiter\'s moon Callisto, blending tense atmosphere, strategic combat, and a chilling storyline.',
    price: 39.99,
    countInStock: 15,
    image: '/images/games/the callisto protocol.jpg',
    categories: ['Action', 'Adventure', 'Most popular','Most Played', 'Fighting', 'Stealth', 'Survival'],
    trailer: 'https://www.youtube.com/embed/IT7swHyN8FQ?si=I59hvuSX-cazEBiT',
    developer: 'Striking Distance Studios',
    releaseDate: new Date('2020-12-10'),
    platform: 'PC, PS5, Xbox Series X',
    ratings: 3.9,
    minRequirements: {
      os: "Windows 10",
      processor: "Intel Core i7",
      ram: "8 GB",
      hardDrive: "70 GB free",
      videoCard: "NVIDIA GTX 1060",
      soundCard: "DirectX 12",
      directX: "12",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "Prey 2017",
    description: 'A sci-fi thriller that challenges you to navigate a hostile space station overrun by alien threats, using clever tactics and resourcefulness to survive.',
    price: 39.99,
    countInStock: 15,
    image: '/images/games/prey.jpg',
    categories: ['Action', 'Adventure', 'Trending Games', 'Featured Discounts', 'RPG', 'First-person shooter', 'Shooter', 'Most popular'],
    trailer: 'https://www.youtube.com/embed/LNHZ9WAertc?si=PYaayRAAgYO6nlJL',
    developer: 'Arkane Studios',
    releaseDate: new Date('2017-05-05'),
    platform: 'PC, PS4, Xbox One',
    ratings: 4.4,
    minRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i5-6600K",
      ram: "8 GB",
      hardDrive: "60 GB free",
      videoCard: "NVIDIA GTX 970",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "Death Stranding 1",
    description: 'A genre-defying adventure where you traverse a fractured America, reconnecting isolated communities in a haunting, beautifully crafted world.',
    price: 39.99,
    countInStock: 15,
    image: '/images/games/death stranding 1.png',
    categories: ['Action', 'Adventure', 'Trending Games', 'Featured Discounts', 'RPG', 'First-person shooter', 'Shooter', 'Most Played'],
    trailer: 'https://www.youtube.com/embed/tCI396HyhbQ?si=ZfYSi5V9sJ-8ZIYw',
    developer: 'Kojima Productions',
    releaseDate: new Date('2019-11-08'),
    platform: 'PC, PS4, PS5',
    ratings: 4.5,
    minRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i7-7700",
      ram: "16 GB",
      hardDrive: "80 GB free",
      videoCard: "NVIDIA GTX 1060 6GB",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "Black Myth: Wukong",
    description: 'An action RPG inspired by Chinese mythology that offers fluid combat, expansive environments, and a deep narrative centered on the legendary Monkey King.',
    price: 39.99,
    countInStock: 15,
    image: '/images/games/black myth wukong.jpg',
    categories: ['Action', 'Adventure', 'Trending Games', 'Featured Discounts', 'RPG', 'First-person shooter', 'Shooter', 'Most Played', 'Top Sellers'],
    trailer: 'https://www.youtube.com/embed/pnSsgRJmsCc?si=4e55ZKoEuaRwm90p',
    developer: 'Game Science',
    releaseDate: new Date('2022-12-01'),
    platform: 'PC',
    ratings: 4.6,
    minRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i7-9700",
      ram: "16 GB",
      hardDrive: "100 GB free",
      videoCard: "NVIDIA RTX 2060",
      soundCard: "DirectX 12",
      directX: "12",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "Counter-Strike: Global Offensive",
    description: 'A highly competitive first-person shooter that emphasizes teamwork, precision, and tactical strategy in fast-paced online matches.',
    price: 0,
    countInStock: 15,
    image: '/images/games/cs go.jpg',
    categories: ['Action', 'Trending Games', 'Free Games', 'RPG', 'First-person shooter', 'Shooter', 'Most Played', 'Top Sellers', 'Tactical role-playing'],
    trailer: 'https://www.youtube.com/embed/edYCtaNueQY?si=6kZfoWChVEAugimi',
    developer: 'Valve',
    releaseDate: new Date('2012-08-21'),
    platform: 'PC, PS4, Xbox One',
    ratings: 4.7,
    minRequirements: {
      os: "Windows 7/8/10",
      processor: "Intel Core 2 Duo E6600",
      ram: "2 GB",
      hardDrive: "15 GB free",
      videoCard: "NVIDIA GeForce 8600 GT",
      soundCard: "DirectX 9.0c compatible",
      directX: "9.0c",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "Fall Guys",
    description: 'A chaotic, colorful battle royale where quirky mini-games and unpredictable challenges turn every match into a fun, frantic scramble for victory.',
    price: 0,
    countInStock: 15,
    image: '/images/games/fall guys.jpg',
    categories: ['Adventure', 'Free Games', 'RPG', 'Most Played', 'Top Sellers', 'Real-time strategy', 'Massively multiplayer online role-playing'],
    trailer: 'https://www.youtube.com/embed/AyADwdiW7rQ?si=um-Vdbg57aZ0SYgW',
    developer: 'Mediatonic',
    releaseDate: new Date('2020-08-04'),
    platform: 'PC, PS4, PS5',
    ratings: 4.3,
    minRequirements: {
      os: "Windows 10",
      processor: "Intel Core i3",
      ram: "4 GB",
      hardDrive: "10 GB free",
      videoCard: "Intel HD Graphics 4000",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "Sifu",
    description: 'A stylish martial arts game that demands mastery of timing and technique as you fight your way through relentless opponents on a quest for revenge.',
    price: 0,
    countInStock: 15,
    image: '/images/games/sifu.jpg',
    categories: ['Action', 'Adventure', 'Free Games', 'RPG', 'Fighting'],
    trailer: 'https://www.youtube.com/embed/1FQ1YO3Ks2U?si=WSSnoN1UQQa0tdqB',
    developer: 'Sloclap',
    releaseDate: new Date('2022-02-08'),
    platform: 'PC, PS5',
    ratings: 4.5,
    minRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i7",
      ram: "8 GB",
      hardDrive: "50 GB free",
      videoCard: "NVIDIA GTX 1050",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "Rocket League",
    description: 'A high-octane sports game blending soccer with acrobatic vehicles, where precision, timing, and teamwork lead to electrifying matches.',
    price: 0,
    countInStock: 15,
    image: '/images/games/rocket league.jpg',
    categories: ['Action', 'Adventure', 'Trending Games', 'Featured Discounts', 'RPG', 'Sports', 'Shooter', 'Most Played'],
    trailer: 'https://www.youtube.com/embed/Ig5XAB552no?si=VqAXkTE5tTBbaEV2',
    developer: 'Psyonix',
    releaseDate: new Date('2015-07-07'),
    platform: 'PC, PS4, Xbox One, Switch',
    ratings: 4.6,
    minRequirements: {
      os: "Windows 10",
      processor: "Intel Core i5",
      ram: "4 GB",
      hardDrive: "7 GB free",
      videoCard: "NVIDIA GeForce GT 630",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "World War Z",
    description: 'A cooperative third-person shooter set in a zombie apocalypse, where strategic teamwork and quick reflexes are your keys to survival.',
    price: 0,
    countInStock: 15,
    image: '/images/games/world war z.jpg',
    categories: ['Action', 'Adventure', 'Free Games', 'RPG', 'First-person shooter', 'Shooter', 'Most Played', 'Top Sellers', 'Tactical role-playing'],
    trailer: 'https://www.youtube.com/embed/YZ3Dx4tfirE?si=UtzXGO2p7FvXK6L2',
    developer: 'Saber Interactive',
    releaseDate: new Date('2019-03-28'),
    platform: 'PC, PS4, Xbox One',
    ratings: 4.2,
    minRequirements: {
      os: "Windows 10",
      processor: "Intel Core i5",
      ram: "8 GB",
      hardDrive: "40 GB free",
      videoCard: "NVIDIA GTX 750 Ti",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "Marvel Rivals",
    description: 'A competitive multiplayer arena game that pits iconic Marvel heroes and villains against each other in fast, intense combat.',
    price: 0,
    countInStock: 15,
    image: '/images/games/marvel rivals.jpg',
    categories: ['Action', 'Free Games', 'RPG', 'First-person shooter', 'Shooter', 'Most Played'],
    trailer: 'https://www.youtube.com/embed/-b0veB7q9P4?si=O75RdNpmdvAuodBW',
    developer: 'Kung Fu Factory',
    releaseDate: new Date('2021-09-15'),
    platform: 'PC, PS5, Xbox Series X',
    ratings: 4.1,
    minRequirements: {
      os: "Windows 10",
      processor: "Intel Core i5",
      ram: "4 GB",
      hardDrive: "20 GB free",
      videoCard: "NVIDIA GeForce GT 730",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  },
  {
    name: "Destiny 2",
    description: 'An online shooter with MMO elements that offers expansive worlds, epic raids, and an ever-evolving narrative filled with rich lore.',
    price: 0,
    countInStock: 15,
    image: '/images/games/destiny 2.jpg',
    categories: ['Action', 'Adventure', 'Free Games', 'RPG', 'First-person shooter', 'Shooter', 'Massively multiplayer online role-playing'],
    trailer: 'https://www.youtube.com/embed/jn1dML6RC5w?si=Bh3k0nsd0ewUL2jH',
    developer: 'Bungie',
    releaseDate: new Date('2017-09-06'),
    platform: 'PC, PS4, Xbox One',
    ratings: 4.5,
    minRequirements: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i5-2500K",
      ram: "8 GB",
      hardDrive: "20 GB free",
      videoCard: "NVIDIA GTX 660",
      soundCard: "DirectX 11 compatible",
      directX: "11",
      peripherals: "Keyboard and Mouse"
    }
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected for seeding.');
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    console.log('Sample products added successfully.');
    process.exit();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
    process.exit(1);
  });
