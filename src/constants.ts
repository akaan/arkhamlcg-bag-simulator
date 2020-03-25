import {
  Bags,
  darkProphecy,
  jacqueline,
  odds,
  OddsFn,
  oddsWithRedraw,
  oliveMcBride,
  oliveMcBrideAndWinchesterDoing1Damage,
  oliveMcBrideAndWinchesterDoing3Damage,
  oliveMcBrideWithSkull,
  OutcomeFunction,
  recallTheFuture,
  ritualCandles,
  success,
  successChoosingBest,
  Token,
  winchesterDoing1Damage,
  winchesterDoing3Damage
} from "arkham-odds";

export const AvailableBags: Array<[string, Token[]]> = [
  ["Night of the Zealot (Easy)", Bags.NightOfTheZealot.Easy],
  ["Night of the Zealot (Standard)", Bags.NightOfTheZealot.Standard],
  ["Night of the Zealot (Hard)", Bags.NightOfTheZealot.Hard],
  ["Night of the Zealot (Expert)", Bags.NightOfTheZealot.Expert],
  ["The Dunwich Legacy (Easy)", Bags.TheDunwichLegacy.Easy],
  ["The Dunwich Legacy (Standard)", Bags.TheDunwichLegacy.Standard],
  ["The Dunwich Legacy (Hard)", Bags.TheDunwichLegacy.Hard],
  ["The Dunwich Legacy (Expert)", Bags.TheDunwichLegacy.Expert],
  ["The Path to Carcosa (Easy)", Bags.ThePathToCarcosa.Easy],
  ["The Path to Carcosa (Standard)", Bags.ThePathToCarcosa.Standard],
  ["The Path to Carcosa (Hard)", Bags.ThePathToCarcosa.Hard],
  ["The Path to Carcosa (Expert)", Bags.ThePathToCarcosa.Expert],
  ["The Forgotten Age (Easy)", Bags.TheForgottenAge.Easy],
  ["The Forgotten Age (Standard)", Bags.TheForgottenAge.Standard],
  ["The Forgotten Age (Hard)", Bags.TheForgottenAge.Hard],
  ["The Forgotten Age (Expert)", Bags.TheForgottenAge.Expert],
  ["The Circle Undone (Easy)", Bags.TheCircleUndone.Easy],
  ["The Circle Undone (Standard)", Bags.TheCircleUndone.Standard],
  ["The Circle Undone (Hard)", Bags.TheCircleUndone.Hard],
  ["The Circle Undone (Expert)", Bags.TheCircleUndone.Expert],
  [
    "The Dream-Eaters : The Dream-Quest (Easy)",
    Bags.TheDreamEatersTheDreamQuest.Easy
  ],
  [
    "The Dream-Eaters : The Dream-Quest (Standard)",
    Bags.TheDreamEatersTheDreamQuest.Standard
  ],
  [
    "The Dream-Eaters : The Dream-Quest (Hard)",
    Bags.TheDreamEatersTheDreamQuest.Hard
  ],
  [
    "The Dream-Eaters : The Dream-Quest (Expert)",
    Bags.TheDreamEatersTheDreamQuest.Expert
  ],
  [
    "The Dream-Eaters : The Web of Dreams (Easy)",
    Bags.TheDreamEatersTheWebOfDreams.Easy
  ],
  [
    "The Dream-Eaters : The Web of Dreams (Standard)",
    Bags.TheDreamEatersTheWebOfDreams.Standard
  ],
  [
    "The Dream-Eaters : The Web of Dreams (Hard)",
    Bags.TheDreamEatersTheWebOfDreams.Hard
  ],
  [
    "The Dream-Eaters : The Web of Dreams (Expert)",
    Bags.TheDreamEatersTheWebOfDreams.Expert
  ],
  ["Curse of the Rougarou (Standard)", Bags.CurseOfTheRougarou.Standard],
  ["Curse of the Rougarou (Hard)", Bags.CurseOfTheRougarou.Hard],
  ["Carnevale of Horrors (Standard)", Bags.CarnevaleOfHorrors.Standard],
  ["Carnevale of Horrors (Hard)", Bags.CarnevaleOfHorrors.Hard],
  ["The Labyrinths of Lunacy (Standard)", Bags.TheLabyrinthsOfLunacy.Standard],
  ["The Labyrinths of Lunacy (Hard)", Bags.TheLabyrinthsOfLunacy.Hard],
  ["Guardians of the Abyss (Standard)", Bags.GuardiansOfTheAbyss.Standard],
  ["Guardians of the Abyss (Hard)", Bags.GuardiansOfTheAbyss.Hard],
  [
    "Murder at the Excelsior Hotel (Standard)",
    Bags.MurderAtTheExcelsiorHotel.Standard
  ],
  ["Murder at the Excelsior Hotel (Hard)", Bags.MurderAtTheExcelsiorHotel.Hard]
];

export interface PullProtocol {
  numberOfTokensToPull: number;
  oddsFunction: OddsFn;
  outcomeFunction: (d: number) => OutcomeFunction;
}

export const StandardPullProtocol: PullProtocol = {
  numberOfTokensToPull: 1,
  oddsFunction: odds,
  outcomeFunction: success
};

export const AvailableCardAbilities: Array<[string, PullProtocol]> = [
  ["None", StandardPullProtocol],
  [
    "Wendy's ability",
    {
      numberOfTokensToPull: 2,
      oddsFunction: oddsWithRedraw,
      outcomeFunction: successChoosingBest
    }
  ],
  [
    "Ritual Candles",
    {
      numberOfTokensToPull: 1,
      oddsFunction: odds,
      outcomeFunction: ritualCandles
    }
  ],
  [
    "Olive McBride",
    {
      numberOfTokensToPull: 3,
      oddsFunction: odds,
      outcomeFunction: oliveMcBride
    }
  ],
  [
    "Olive McBride (and get a Skull)",
    {
      numberOfTokensToPull: 3,
      oddsFunction: odds,
      outcomeFunction: oliveMcBrideWithSkull
    }
  ],
  [
    "Dark Prophecy",
    {
      numberOfTokensToPull: 5,
      oddsFunction: odds,
      outcomeFunction: darkProphecy
    }
  ],
  [
    "Recall the Future",
    {
      numberOfTokensToPull: 1,
      oddsFunction: odds,
      outcomeFunction: recallTheFuture
    }
  ],
  [
    ".35 Winchester doing exactly 1 damage",
    {
      numberOfTokensToPull: 1,
      oddsFunction: odds,
      outcomeFunction: winchesterDoing1Damage
    }
  ],
  [
    ".35 Winchester doing exactly 3 damage",
    {
      numberOfTokensToPull: 1,
      oddsFunction: odds,
      outcomeFunction: winchesterDoing3Damage
    }
  ],
  [
    "OliveMcBride and .35 Winchester doing exactly 1 damage",
    {
      numberOfTokensToPull: 3,
      oddsFunction: odds,
      outcomeFunction: oliveMcBrideAndWinchesterDoing1Damage
    }
  ],
  [
    "OliveMcBride and .35 Winchester doing exactly 3 damage",
    {
      numberOfTokensToPull: 3,
      oddsFunction: odds,
      outcomeFunction: oliveMcBrideAndWinchesterDoing3Damage
    }
  ],
  [
    "Jacqueline Fine's ability",
    {
      numberOfTokensToPull: 3,
      oddsFunction: odds,
      outcomeFunction: jacqueline
    }
  ]
];
