'use strict'

import uuidv4 from 'uuid/v4'

/**
 * id symbol
 *
 * @type {Symbol}
 * @private
 */
const _id = Symbol('id')

/**
 * Estimate Item
 *
 * Contains a name and the tree-point estimates;
 * optimistic, pessimistic and most-likely.
 *
 * @author Alin Eugen Deac <aedart@gmail.com>
 */
class Item {
    /**
     * Constructor
     *
     * @param {string} name
     * @param {float|int} [optimistic]
     * @param {float|int} [pessimistic]
     * @param {float|int} [mostLikely]
     */
    constructor (name, optimistic, pessimistic, mostLikely) {
        this.id = uuidv4()
        this.name = name
        this.optimistic = optimistic || 0
        this.pessimistic = pessimistic || 0
        this.mostLikely = mostLikely || 0
    }

    /**
     * Set id
     *
     * @param {string} value Unique id for this estimation task
     */
    set id (value) {
        this[_id] = value
    }

    /**
     * Get id
     *
     * @return {string} Unique id for this estimation task
     */
    get id () {
        return this[_id]
    }
}

export default Item
