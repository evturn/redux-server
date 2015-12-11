'use strict';
import {expect} from 'chai';
import {List, Map} from 'immutable';

describe('immutability', () => {

  describe('a tree', () => {

    function addPlayer(currentState, player) {
      return currentState.update('players', (players) => players.push(player));
    }

    it('is immutable', () => {
      let state = Map({
        players: List.of('Magic Johnson', 'Dominique Wilkins')
      });
      let nextState = addPlayer(state, 'Clyde Drexler');

      expect(nextState).to.equal(Map({
        players: List.of(
          'Magic Johnson',
          'Dominique Wilkins',
          'Clyde Drexler'
        )
      }));
      expect(state).to.equal(Map({
        players: List.of(
          'Magic Johnson',
          'Dominique Wilkins'
        )
      }));
    });

  });

});