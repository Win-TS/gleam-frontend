export const SportsFitness = {
  FOOTBALL: "football",
  ROCK_CLIMBING: "rock climbing",
  BASKETBALL: "basketball",
  VOLLEYBALL: "volleyball",
  GOLF: "golf",
  BOXING: "boxing",
  BADMINTON: "badminton",
  BOWLING: "bowling",
  ICE_SKATING: "ice skating",
  RACQUET: "racquet",
  TENNIS: "tennis",
  TABLE_TENNIS: "table tennis",
  SWIMMING: "swiming",
  POOL: "pool",
  SNOOKER: "snooker",
  RUNNING: "running",
  YOGA: "yoga",
  PILATES: "pilates",
  HIKING: "hiking",
  TAEKWONDO: "taekwondo",
  KARATE: "karate",
  CYCLING: "cycling",
  FIGURE_SKATING: "figure skating",
  SKIING: "skiing",
  HOCKEY: "hockey",
} as const;

export const LearningDevelopment = {
  ONLINE_COURSE: "Online course",
  EXAM_PREP: "exam prep",
  INVESTING: "Investing",
  PUBLIC_SPEAKING: "public speaking",
  LANGUAGE: "language",
  PROGRAMMING: "programming",
  SAT: "SAT",
  IELTS: "IELTS",
} as const;

export const HealthWellness = {
  FITNESS_GYM: "fitness and gym",
  DIETARY: "dietary",
  BULKING: "bulking",
  MEDITATION: "meditation",
  VEGAN: "vegan",
} as const;

export const EntertainmentMedia = {
  MUSIC: "music",
  THEATER: "theater",
  PODCAST: "podcast",
  MOVIE: "movie",
  SERIES: "series",
} as const;

export const HobbiesLeisure = {
  BAKING: "baking",
  GARDENING: "gardening",
  COOKING: "cooking",
  PLANTING: "planting",
  KNITTING: "knitting",
  POTTERY: "pottery",
  CALLIGRAPHY: "calligrpahy",
  TRAVELING: "traveling",
  BOARD_GAMES: "board games",
} as const;

const Categories = {
  SPORT_FITNESS: SportsFitness,
  LEARNING_DEVELOPMENT: LearningDevelopment,
  HEALTH_WELLNESS: HealthWellness,
  ENTERTAINMENT_MEDIA: EntertainmentMedia,
  HOBBIES_LEISURE: HobbiesLeisure,
} as const;

export default Categories;
