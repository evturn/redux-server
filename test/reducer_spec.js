'use strict';
import {Map, fromJS} from 'immutable';
import {expect} from 'chai';
import reducer from '../src/reducer';

describe('reducer', () => {

  it('handles SET_ENTRIES', () => {
    const initialState = Map();
    const action = { type: 'SET_ENTRIES', entries: ['Magic Johnson'] };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Magic Johnson']
    }));
  });

  it('handles NEXT', () => {
    const initialState = fromJS({
      entries: ['Magic Johnson', 'Dominique Wilkins']
    });
    const action = {type: 'NEXT'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Magic Johnson', 'Dominique Wilkins']
      },
      entries: []
    }));
  });

  it('handles VOTE', () => {
    const initialState = fromJS({
      vote: {
        pair: ['Magic Johnson', 'Dominique Wilkins']
      },
      entries: []
    });
    const action = { type: 'VOTE', entry: 'Magic Johnson' };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Magic Johnson', 'Dominique Wilkins'],
        tally: { 'Magic Johnson': 1 }
      },
      entries: []
    }));
  });

  it('has an initial state', () => {
    const action = { type: 'SET_ENTRIES', entries: ['Magic Johnson'] };
    const nextState = reducer(undefined, action);

    expect(nextState).to.equal(fromJS({
      entries: ['Magic Johnson']
    }));
  });

  it('can be used with reduce', () => {
    const actions = [
      {type: 'SET_ENTRIES', entries: ['Magic Johnson', 'Dominique Wilkins']},
      {type: 'NEXT'},
      {type: 'VOTE', entry: 'Magic Johnson'},
      {type: 'VOTE', entry: 'Dominique Wilkins'},
      {type: 'VOTE', entry: 'Magic Johnson'},
      {type: 'NEXT'}
    ];
    const finalState = actions.reduce(reducer, Map());

    expect(finalState).to.equal(fromJS({
      winner: 'Magic Johnson'
    }));
  });

});
