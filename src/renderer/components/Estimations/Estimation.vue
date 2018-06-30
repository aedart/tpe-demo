<template>
    <tr
        class="estimation"
        tabindex="0"
        @keyup.enter="editItem"
        v-on:dblclick="editItem"
        @keyup.esc="closeItem"
    >
        <td>
            <!-- Name -->
            <span v-if="!editMode"> {{ taskName }} </span>

            <span v-if="editMode">
                    <input
                        type="text"
                        placeholder="Task name"
                        :id="'name_input_' + estimation.id"
                        :data-vv-name="'name_' + estimation.id"
                        class="form-control"
                        v-validate="'required|min:0|max:150'"
                        v-model="taskName"
                        @keyup.enter="closeItem"
                    >
            </span>
        </td>
        <td>
            <!-- Optimistic -->
            <span v-if="!editMode"> {{ optimistic }} </span>

            <span v-if="editMode">
                    <input
                        type="number"
                        class="form-control"
                        :data-vv-name="'optimistic' + estimation.id"
                        v-validate="'decimal:2|min_value:0|max_value:9999.99'"
                        v-model="optimistic"
                        @keyup.enter="closeItem"
                    >
            </span>
        </td>
        <td>
            <!-- Pessimistic -->
            <span v-if="!editMode"> {{ pessimistic }} </span>

            <span v-if="editMode">
                    <input
                        type="number"
                        class="form-control"
                        :data-vv-name="'pessimistic' + estimation.id"
                        v-validate="'decimal:2|min_value:0|max_value:9999.99'"
                        v-model="pessimistic"
                        @keyup.enter="closeItem"
                    >
            </span>
        </td>
        <td>
            <!-- Most Likely -->
            <span v-if="!editMode"> {{ mostLikely }} </span>

            <span v-if="editMode">
                    <input
                        type="number"
                        class="form-control"
                        :data-vv-name="'mostLikely' + estimation.id"
                        v-validate="'decimal:2|min_value:0|max_value:9999.99'"
                        v-model="mostLikely"
                        @keyup.enter="closeItem"
                    >
            </span>
        </td>
        <td>
            {{ pertEstimation }}
        </td>
        <td>
            {{ sigma }}
        </td>
        <td>
            {{ variance }}
        </td>
        <td>
            <button
                type="button"
                class="btn btn-sm btn-link"
                title="Remove task"
                v-if="!editMode"
                v-on:click="remove"
            >
                Remove
            </button>

            <button
                type="button"
                class="btn btn-sm btn-link"
                title="Edit task"
                v-if="!editMode"
                v-on:click="editItem"
            >
                Edit
            </button>

            <button
                    type="button"
                    class="btn btn-sm btn-link"
                    title="Close task"
                    v-if="editMode"
                    v-on:click="closeItem"
            >
                Close
            </button>
        </td>
    </tr>
</template>

<script>
    import Item from '../../store/modules/Item'
    import {
        REMOVE_ESTIMATION_ITEM,
        UPDATE_ESTIMATION_ITEM
    } from './../../store/modules/mutations/types'

    export default {
        name: 'estimation',
        props: {
            estimation: {
                type: Item,
                default: () => {
                    return new Item('N/A')
                }
            }
        },
        data: () => {
            return {
                editMode: false,
                updatedItemData: {}
            }
        },
        computed: {

            taskName: {
                get () {
                    return this.estimation.name
                },
                set (value) {
                    this.updatedItemData.name = value
                }
            },
            optimistic: {
                get () {
                    return this.estimation.optimistic
                },
                set (value) {
                    this.updatedItemData.optimistic = value
                }
            },
            pessimistic: {
                get () {
                    return this.estimation.pessimistic
                },
                set (value) {
                    this.updatedItemData.pessimistic = value
                }
            },
            mostLikely: {
                get () {
                    return this.estimation.mostLikely
                },
                set (value) {
                    this.updatedItemData.mostLikely = value
                }
            },
            // --------------------------------------------------- //

            /**
             * Calculates the PERT Beta (or weighted) distribution,
             * based on the estimation item's three-point estimates
             * @return {string}
             */
            pertEstimation: function () {
                return this.$store.getters.pertEstimate(this.estimation).toFixed(2)
            },

            /**
             * Calculates the standard deviation (sigma)
             * @return {string}
             */
            sigma: function () {
                return this.$store.getters.pertStandardDeviation(this.estimation).toFixed(2)
            },

            /**
             * Calculates the variance
             * @return {string}
             */
            variance: function () {
                return this.$store.getters.pertVariance(this.estimation).toFixed(2)
            }
        },
        methods: {

            /**
             * Remove this estimation
             */
            remove: function () {
                if (!confirm('Remove ' + this.estimation.name + '?')) {
                    return
                }

                this.$store.commit(REMOVE_ESTIMATION_ITEM, this.estimation)
            },

            /**
             * Save estimation item
             * Method uses "updatedItemData" as payload to commit
             */
            save: function () {
                this.$store.commit(UPDATE_ESTIMATION_ITEM, this.updatedItemData)
            },

            // ------------------------------------------------------------ //

            editItem: function (e) {
                e.stopPropagation()

                if (!this.editMode) {
                    this.editMode = true
                    this.selectNameInput()
                }
            },

            closeItem: function (e) {
                e.stopPropagation()

                if (this.editMode) {
                    this.editMode = false
                    this.save()
                }
            },

            selectNameInput: function () {
                this.$nextTick(() => {
                    // Abort if not in edit mode
                    if (!this.editMode) {
                        return
                    }

                    // Focus name field, if in edit mode
                    document.getElementById('name_input_' + this.estimation.id).focus()
                })
            }
        },
        created: function () {
            // Copy attributes onto the "updated item data" placeholder
            // We do this so that the initial data is there, in case
            // that only a single attribute is updated.
            for (let key in this.estimation) {
                this.updatedItemData[key] = this.estimation[key]
            }

            // Id isn't auto-copied, so this has to be done manually ( symbol )
            this.updatedItemData.id = this.estimation.id
        }
    }
</script>
