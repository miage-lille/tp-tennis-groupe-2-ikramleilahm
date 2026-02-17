import { Player, stringToPlayer } from './types/player';
import { Point, PointsData, Score, points, forty, fifteen, thirty, love } from './types/score';
import { pipe, Option } from 'effect'

// -------- Tooling functions --------- //

export const playerToString = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'Player 1';
    case 'PLAYER_TWO':
      return 'Player 2';
  }
};
export const otherPlayer = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return stringToPlayer('PLAYER_TWO');
    case 'PLAYER_TWO':
      return stringToPlayer('PLAYER_ONE');
  }
};
// Exercice 1 :
export const pointToString = (point: Point): string =>
  (() => {
    switch (point.kind) {
      case 'LOVE':
        return 'Love';
      case 'FIFTEEN':
        return '15';
      case 'THIRTY':
        return '30';
    }
  })();

export const scoreToString = (score: Score): string =>
  (() => {
    switch (score.kind) {
      case 'POINTS': {
        const { pointsData } = score;
        return `${pointToString(pointsData.PLAYER_ONE)} - ${pointToString(
          pointsData.PLAYER_TWO
        )}`;
      }
      case 'FORTY': {
        const { fortyData } = score;
        if (fortyData.player === 'PLAYER_ONE')
          return `40 - ${pointToString(fortyData.otherPoint)}`;
        return `${pointToString(fortyData.otherPoint)} - 40`;
      }
      case 'DEUCE':
        return 'Deuce';
      case 'ADVANTAGE':
        return `Advantage ${playerToString(score.player)}`;
      case 'GAME':
        return `Game ${playerToString(score.player)}`;
    }
  })();

export const scoreWhenDeuce = (winner: Player): Score => {
  throw new Error('not implemented');
};

export const scoreWhenAdvantage = (
  advantagedPlayed: Player,
  winner: Player
): Score => {
  throw new Error('not implemented');
};

export const scoreWhenForty = (
  currentForty: unknown, // TO UPDATE WHEN WE KNOW HOW TO REPRESENT FORTY
  winner: Player
): Score => {
  throw new Error('not implemented');
};



// Exercice 2
// Tip: You can use pipe function from Effect to improve readability.
// See scoreWhenForty function above.
export const incrementPoint = (point: Point): Option.Option<Point> => {
  switch (point.kind) {
    case 'LOVE':
      return Option.some(fifteen());
    case 'FIFTEEN':
      return Option.some(thirty());
    case 'THIRTY':
      return Option.none();
  }
};

export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  if (winner === 'PLAYER_ONE') {
    return pipe(
      incrementPoint(current.PLAYER_ONE),
      Option.match({
        onNone: () => forty('PLAYER_ONE', current.PLAYER_TWO),
        onSome: (p) => points(p, current.PLAYER_TWO),
      })
    );
  }

  return pipe(
    incrementPoint(current.PLAYER_TWO),
    Option.match({
      onNone: () => forty('PLAYER_TWO', current.PLAYER_ONE),
      onSome: (p) => points(current.PLAYER_ONE, p),
    })
  );
};

// Exercice 3
export const scoreWhenGame = (winner: Player): Score => {
  throw new Error('not implemented');
};

export const score = (currentScore: Score, winner: Player): Score => {
  throw new Error('not implemented');
};

// Re-export constructors for tests and external use
export { points, love, fifteen, thirty, forty };
