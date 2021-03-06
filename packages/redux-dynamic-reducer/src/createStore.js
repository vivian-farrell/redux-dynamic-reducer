/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createStore as baseCreateStore, combineReducers } from 'redux'
import concatenateReducers from 'redux-concatenate-reducers'
import filteredReducer from './filteredReducer'

const DEFAULT_REDUCER = (state) => state

const createStore = (reducer, ...rest) => {
    let dynamicReducers = {}

    const createReducer = () => {
        const reducers = []

        if (reducer) {
            reducers.push(filteredReducer(reducer))
        }

        if (Object.keys(dynamicReducers).length !== 0) {
            reducers.push(filteredReducer(combineReducers(dynamicReducers)))
        }

        return Object.keys(reducers).length > 0 ? concatenateReducers(reducers) : DEFAULT_REDUCER
    }

    const attachReducers = (reducers) => {
        dynamicReducers = {...dynamicReducers, ...reducers}
        store.replaceReducer(createReducer())
    }

    const store = baseCreateStore(createReducer(), ...rest)

    store.attachReducers = attachReducers

    return store
}

export default createStore
