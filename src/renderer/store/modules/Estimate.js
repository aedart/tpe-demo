import Item from './Item'
import {
    ADD_ESTIMATION_ITEM,
    REMOVE_ESTIMATION_ITEM,
    UPDATE_ESTIMATION_ITEM,
    EDIT_ESTIMATION_TITLE
} from './mutations/types'

const state = {

    /**
     * Name of estimation
     */
    name: 'New estimation',

    /**
     * List of estimations
     */
    list: [
        new Item('Task A', 1, 4, 3),
        new Item('Task B', 3, 10, 5),
        new Item('Task C', 10, 25, 13.5)
    ]
}

const mutations = {

    /**
     * Add estimation item
     * @param {Vuex} state
     * @param {Item} [payload] If none given, then blank item is added
     */
    [ ADD_ESTIMATION_ITEM ] (state, payload) {
        if (payload === undefined) {
            payload = new Item('N/A')
        }

        // Trim name
        payload.name = payload.name.trim()

        // Cast estimates to number (just in case)
        payload.optimistic = parseFloat(payload.optimistic)
        payload.pessimistic = parseFloat(payload.pessimistic)
        payload.mostLikely = parseFloat(payload.mostLikely)

        state.list.push(payload)
    },

    /**
     * Remove estimation item
     * @param {Vuex} state
     * @param {Item} payload
     */
    [ REMOVE_ESTIMATION_ITEM ] (state, payload) {
        if (!(payload instanceof Item)) {
            throw new TypeError('Unable to remove Item, incorrect type provided: ' + typeof payload)
        }

        let index = state.list.findIndex((item) => {
            return item.id === payload.id
        })

        if (index === -1) {
            throw new TypeError('Unable to remove Item, item with id "' + payload.id + '" does not appear to exist')
        }

        state.list.splice(index, 1)
    },

    /**
     * Update existing item
     * @param {Vuex} state
     * @param {{id: string, name: string, optimistic: float, pessimistic: float, mostLikely: float}} payload Must have id!
     */
    [ UPDATE_ESTIMATION_ITEM ] (state, payload) {
        // Find item
        let index = state.list.findIndex((item) => {
            return item.id === payload.id
        })

        if (index === -1) {
            throw new TypeError('Unable to remove Item, item with id "' + payload.id + '" does not appear to exist')
        }

        let item = state.list[index]

        // Trim name
        item.name = payload.name.trim()

        // Cast estimates to number (just in case)
        item.optimistic = parseInt(payload.optimistic)
        item.pessimistic = parseInt(payload.pessimistic)
        item.mostLikely = parseInt(payload.mostLikely)
    },
    /**
     * Update estimation title
     * @param {Vuex} state
     * @param {string}
     */
    [ EDIT_ESTIMATION_TITLE ] (state, payload) {
        state.name = payload
    }
}

/*
const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}
*/

const getters = {

    /**
     * Calculates the PERT Beta (or weighted) distribution,
     * based on given estimation item's three-point estimates
     *
     * @see Item
     * @see https://blog.masterofproject.com/estimation-technique/
     * @see https://www.agile-code.com/blog/easy-task-estimation-with-three-point-estimation-technique/
     * @param {Item} estimate
     * @return {float}
     */
    pertEstimate: (state) => (estimate) => {
        if (estimate === undefined) {
            return 0
        }

        let o = estimate.optimistic
        let p = estimate.pessimistic
        let m = estimate.mostLikely

        return (o + (4 * m) + p) / 6
    },

    /**
     * Calculates the standard deviation (sigma)
     *
     * @see https://www.youtube.com/watch?v=CsJeCOzsJVs&index=1&list=PLbHGGJy5AwP_hdG7LoR0Uilw4tpl_pxWq
     *
     * @param {Item} estimate
     * @return {float}
     */
    pertStandardDeviation: (state) => (estimate) => {
        if (estimate === undefined) {
            return 0
        }

        let o = estimate.optimistic
        let p = estimate.pessimistic

        return (p - o) / 6
    },

    /**
     * Calculates the variance of the given estimation item
     *
     * @see https://www.pmbypm.com/critical-path-pert-and-standard-deviation/
     *
     * @param {Item} estimate
     * @return {float}
     */
    pertVariance: (state, store) => (estimate) => {
        let sigma = store.pertStandardDeviation(estimate)

        return Math.pow(sigma, 2)
    },

    /**
     * Calculates the total PERT estimate, based on the accumulated
     * PERT estimates of each estimation-item
     * @param {Vuex} state
     * @param {Vuex} store
     * @return {float}
     */
    totalEstimate: (state, store) => {
        return state.list.reduce((previousValue, item) => {
            return previousValue + store.pertEstimate(item)
        }, 0)
    },

    /**
     * Calculates the total variance
     * @param {Vuex} state
     * @param {Vuex} store
     * @return {float}
     */
    totalVariance: (state, store) => {
        return state.list.reduce((previousValue, item) => {
            return previousValue + store.pertVariance(item)
        }, 0)
    },

    lowerRangeEstimate: (state, store) => (sigma) => {
        return store.totalEstimate - sigma * Math.sqrt(store.totalVariance)
    },

    upperRangeEstimate: (state, store) => (sigma) => {
        return store.totalEstimate + sigma * Math.sqrt(store.totalVariance)
    }
}

export default {
    state,
    mutations,
    // actions
    getters
}
