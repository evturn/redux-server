'use strict';
import {List, Map} from 'immutable';
import {expect} from 'chai';
import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {

  describe('setEntries', () => {

    it('adds the entries to the state', () => {
      const state = Map();
      const entries = List.of('Magic Johnson', 'Dominique Wilkins');
      const nextState = setEntries(state, entries);

      expect(nextState).to.equal(Map({
        entries: List.of('Magic Johnson', 'Dominique Wilkins')
      }));
    });

    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Magic Johnson', 'Dominique Wilkins'];
      const nextState = setEntries(state, entries);

      expect(nextState).to.equal(Map({
        entries: List.of('Magic Johnson', 'Dominique Wilkins')
      }));
    });

  });

  describe('next', () => {

    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Magic Johnson', 'Dominique Wilkins', 'Clyde Drexler')
      });
      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Magic Johnson', 'Dominique Wilkins')
        }),
        entries: List.of('Clyde Drexler')
      }));
    });

  });


  describe('vote', () => {

    it('creates a tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Magic Johnson', 'Dominique Wilkins')
      });
      const nextState = vote(state, 'Magic Johnson');

      expect(nextState).to.equal(Map({
        pair: List.of('Magic Johnson', 'Dominique Wilkins'),
        tally: Map({
          'Magic Johnson': 1
        })
      }));
    });

    it('adds to existing tally for the voted entry', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Magic Johnson', 'Dominique Wilkins'),
          tally: Map({
            'Magic Johnson': 3,
            'Dominique Wilkins': 2
          })
        }),
        entries: List()
      });
      const nextState = vote(state, 'Magic Johnson');

      expect(nextState).to.equal(Map({
        pair: List.of('Magic Johnson', 'Dominique Wilkins'),
        tally: Map({
          'Magic Johnson': 4,
          'Dominique Wilkins': 2
        })
      }));
    });

  it('puts winner of current vote back to entries', () => {
      const state = Map({
          pair: List.of('Magic Johnson', 'Dominique Wilkins'),
          tally: Map({
            'Magic Johnson': 4,
            'Dominique Wilkins': 2
          })
        }),
        entries: List.of('Clyde Drexler', 'Patrick Ewing', 'Michael Jordan')
      });
      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Clyde Drexler', 'Patrick Ewing')
        }),
        entries: List.of('Michael Jordan', 'Magic Johnson')
      }));
    });

    it('puts both from tied vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Magic Johnson', 'Dominique Wilkins'),
          tally: Map({
            'Magic Johnson': 3,
            'Dominique Wilkins': 3
          })
        }),
        entries: List.of('Clyde Drexler', 'Patrick Ewing', 'Michael Jordan')
      });
      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Clyde Drexler', 'Patrick Ewing')
        }),
        entries: List.of('Michael Jordan', 'Magic Johnson', 'Dominique Wilkins')
      }));
    });

  });

  it('marks winner when just one entry left', () => {
    const state = Map({
      vote: Map({
        pair: List.of('Magic Johnson', 'Dominique Wilkins'),
        tally: Map({
          'Magic Johnson': 4,
          'Dominique Wilkins': 2
        })
      }),
      entries: List()
    });
    const nextState = next(state);

    expect(nextState).to.equal(Map({
      winner: 'Magic Johnson'
    }));
  });

});