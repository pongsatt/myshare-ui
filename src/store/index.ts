import { combineReducers, createStore } from 'redux';
import { enthusiasm } from './reducers';
import { sharesReducer } from './shares/reducer';
import { IShareState } from './shares/types';

export interface IRootState {
    shares: IShareState
}

const store = createStore<IRootState, any, any, any>(
    combineReducers({
        enthusiasm, 
        shares: sharesReducer
    }));

export default store;