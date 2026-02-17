import { describe, expect, test } from '@jest/globals';
import { otherPlayer, playerToString, points, love, fifteen, thirty, scoreWhenPoint, forty, scoreWhenDeuce, scoreWhenAdvantage, scoreWhenForty, stringToPoint } from '..';
import { advantage, deuce, game } from '../types/score';
import { stringToPlayer } from '../types/player';

describe('Tests for tooling functions', () => {
  test('Given playerOne when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Given playerOne when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });
});

describe('Tests for transition functions', () => {
 test('Given deuce, score is advantage to winner', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((w) => {
    const score = scoreWhenDeuce(stringToPlayer(w));
    const scoreExpected = advantage(stringToPlayer(w));
    expect(score).toStrictEqual(scoreExpected);
  })
});
  test('Given advantage when advantagedPlayer wins, score is Game avantagedPlayer', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((advantaged) => {
      const advantagedPlayer = stringToPlayer(advantaged);
      const winner = advantagedPlayer;
      const score = scoreWhenAdvantage(advantagedPlayer, winner);
      const scoreExpected = game(winner);
      expect(score).toStrictEqual(scoreExpected);
    });
  });
  test('Given advantage when otherPlayer wins, score is Deuce', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((advantaged) => {
      const advantagedPlayer = stringToPlayer(advantaged);
      const winner = otherPlayer(advantagedPlayer);
      const score = scoreWhenAdvantage(advantagedPlayer, winner);
      const scoreExpected = deuce();
      expect(score).toStrictEqual(scoreExpected);
    });
  });
  test('Given a player at 40 when the same player wins, score is Game for this player', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
    const fortyData = {
      player: stringToPlayer(winner),
      otherPoint: stringToPoint('THIRTY'),
    };
    const score = scoreWhenForty(fortyData, stringToPlayer(winner));
    const scoreExpected = game(stringToPlayer(winner));
    expect(score).toStrictEqual(scoreExpected);
  })
});
  test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
      const fortyData = {
        player: otherPlayer(stringToPlayer(winner)),
        otherPoint: thirty(),
      };
      const score = scoreWhenForty(fortyData, stringToPlayer(winner));
      const scoreExpected = deuce();
      expect(score).toStrictEqual(scoreExpected);
    });
  });
  test('Given player at 40 and other at 15 when other wins, score is 40 - 15', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
      const fortyData = {
        player: otherPlayer(stringToPlayer(winner)),
        otherPoint: fifteen(),
      };
      const score = scoreWhenForty(fortyData, stringToPlayer(winner));
      const scoreExpected = forty(fortyData.player, thirty());
      expect(score).toStrictEqual(scoreExpected);
    });
  });
  // -------------------------TESTS POINTS-------------------------- //
  test('Given players at 0 or 15 points score kind is still POINTS', () => {
    const cases = [
      points(love(), love()),
      points(fifteen(), love()),
      points(love(), fifteen()),
      points(fifteen(), fifteen()),
    ];

    cases.forEach((p) => {
      // player one wins
      const r1 = scoreWhenPoint(p.pointsData, 'PLAYER_ONE');
      expect(r1.kind).toBe('POINTS');
      // player two wins
      const r2 = scoreWhenPoint(p.pointsData, 'PLAYER_TWO');
      expect(r2.kind).toBe('POINTS');
    });
  });

  test('Given one player at 30 and win, score kind is forty', () => {
    const p = points(thirty(), love());
    const r = scoreWhenPoint(p.pointsData, 'PLAYER_ONE');
    expect(r.kind).toBe('FORTY');
    if (r.kind === 'FORTY') expect(r.fortyData.player).toBe('PLAYER_ONE');
  });
});
