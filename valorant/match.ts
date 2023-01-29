export interface Match {
  id: string;
  seasonId: string;
  map: string;
  gemeLength: number;
  gameStart: number;
  gameStartPatched: Date;
  hasWon: boolean;
  roundsWon: number;
  roundsLost: number;
  player: {
    currentTier: number;
    currentTierPatched: string;
    rankingInTier: number | null;
    mmrChangeToLastGame: number | null;
    character: string;
    stats: {
      score: number;
      kills: number;
      deaths: number;
      assists: number;
      bodyShots: number;
      headShots: number;
      legShots: number;
    };
  };
  assets: {
    tierIcon: string;
    mapIcon: string;
    agentIcon: string;
  };
}
