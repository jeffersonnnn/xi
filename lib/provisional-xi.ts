import type { SlotCode } from './constants';

export type ProvisionalPlayer = {
  name: string;
  shortName: string;
  nationalityCode: string;
  club: string;
  photoUrl: string;
};

export const PROVISIONAL_XI: Record<SlotCode, ProvisionalPlayer> = {
  GK: {
    name: 'Emiliano Martínez',
    shortName: 'E. Martínez',
    nationalityCode: 'ARG',
    club: 'Aston Villa',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/St._Louis_City_vs_Aston_Villa_%28Jul_2025%29_14_%28Emiliano_Mart%C3%ADnez%29.jpg/250px-St._Louis_City_vs_Aston_Villa_%28Jul_2025%29_14_%28Emiliano_Mart%C3%ADnez%29.jpg',
  },
  LB: {
    name: 'Alphonso Davies',
    shortName: 'Davies',
    nationalityCode: 'CAN',
    club: 'Bayern Munich',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Alphonso_Davies_in_2022.jpg/250px-Alphonso_Davies_in_2022.jpg',
  },
  CB_L: {
    name: 'Virgil van Dijk',
    shortName: 'van Dijk',
    nationalityCode: 'NED',
    club: 'Liverpool',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/20160604_AUT_NED_8876_%28cropped%29.jpg/250px-20160604_AUT_NED_8876_%28cropped%29.jpg',
  },
  CB_R: {
    name: 'Rúben Dias',
    shortName: 'R. Dias',
    nationalityCode: 'POR',
    club: 'Manchester City',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Portugal_national_football_team_0866_%28R%C3%BAben_Dias%29.jpg/250px-Portugal_national_football_team_0866_%28R%C3%BAben_Dias%29.jpg',
  },
  RB: {
    name: 'Trent Alexander-Arnold',
    shortName: 'Alexander-Arnold',
    nationalityCode: 'ENG',
    club: 'Real Madrid',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Trent_Alexander-Arnold_2018_%28cropped%29.jpg/250px-Trent_Alexander-Arnold_2018_%28cropped%29.jpg',
  },
  CM_L: {
    name: 'Jude Bellingham',
    shortName: 'Bellingham',
    nationalityCode: 'ENG',
    club: 'Real Madrid',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Jude_Bellingham_-_240422_190551-2_%28cropped%29.jpg/250px-25th_Laureus_World_Sports_Awards_-_Red_Carpet_-_Jude_Bellingham_-_240422_190551-2_%28cropped%29.jpg',
  },
  CM_C: {
    name: 'Rodri',
    shortName: 'Rodri',
    nationalityCode: 'ESP',
    club: 'Manchester City',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/RODRI_-_SWE_vs_ESP_-_UEFA_EURO_2020_QUALIFIERS_-_2019.10.15_%28cropped%29.jpg/250px-RODRI_-_SWE_vs_ESP_-_UEFA_EURO_2020_QUALIFIERS_-_2019.10.15_%28cropped%29.jpg',
  },
  CM_R: {
    name: 'Kevin De Bruyne',
    shortName: 'De Bruyne',
    nationalityCode: 'BEL',
    club: 'Manchester City',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg/250px-Kevin_De_Bruyne_USMNT_v_Belgium_Mar_28_2026-64_%28cropped%29.jpg',
  },
  LW: {
    name: 'Kylian Mbappé',
    shortName: 'Mbappé',
    nationalityCode: 'FRA',
    club: 'Real Madrid',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Picture_with_Mbapp%C3%A9_%28cropped_and_rotated%29.jpg/250px-Picture_with_Mbapp%C3%A9_%28cropped_and_rotated%29.jpg',
  },
  ST: {
    name: 'Erling Haaland',
    shortName: 'Haaland',
    nationalityCode: 'NOR',
    club: 'Manchester City',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Erling_Haaland_June_2025.jpg/250px-Erling_Haaland_June_2025.jpg',
  },
  RW: {
    name: 'Lamine Yamal',
    shortName: 'Yamal',
    nationalityCode: 'ESP',
    club: 'Barcelona',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Lamine_Yamal_in_2025.jpg/250px-Lamine_Yamal_in_2025.jpg',
  },
};
