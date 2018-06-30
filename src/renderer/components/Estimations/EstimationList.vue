<template>
    <div class="estimations-list">

        <div class="row justify-content-end">
            <div class="col-2 estimation-list--date text-secondary">
                {{ currentDateAndTime }}
            </div>
        </div>

        <!-- Title -->
        <div class="estimation-list--title">
            <!-- None-edit mode title -->
            <h1
                    class="font-italic"
                    v-if="!editTitle"
                    v-on:dblclick="showEditTitle"
            >
                {{ title }}

                <small>
                    <button
                            class="btn btn-link"
                            role="button"
                            title="Edit title of this estimation"
                            v-on:click="showEditTitle"
                    >
                        edit
                    </button>
                </small>
            </h1>

            <div
                    class="estimation-list--tile--form row"
                    v-if="editTitle"
            >
                <div class="col">
                    <input
                            type="text"
                            placeholder="Task name"
                            :id="'estimation_title'"
                            :data-vv-name="'Estimation Title'"
                            class="form-control"
                            v-validate="'required|min:0|max:150'"
                            v-model="title"
                            @keyup.enter="closeEditTitle"
                            @keyup.esc="closeEditTitle"
                    >
                </div>
                <div class="col">
                    <button
                            class="btn btn-link"
                            role="button"
                            title="Save and close estimation title"
                            v-on:click="closeEditTitle"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
        <!-- End Title -->

        <!-- Actual list -->
        <div class="estimation-list--list">
            <table class="table table-striped table-hover table-responsive-sm">
                <thead>
                    <tr>
                        <th scope="col" title="Task name">Name</th>
                        <th scope="col" title="Optimistic">O</th>
                        <th scope="col" title="Pessimistic">P</th>
                        <th scope="col" title="Most Likely">M</th>
                        <th scope="col" title="PERT Estimate: (O + (4 * M) + P) / 6">Estimate</th>
                        <th scope="col" title="Standard Deviation (Sigma): (P - O) / 6">SD (&sigma;)</th>
                        <th scope="col" title="Variance: (sigma)^2">Variance</th>
                        <th scope="col">
                            <div class="estimation-list--unit font-weight-normal">
                                <span class="estimation-list--unit--label text-secondary">
                                    ( In:

                                    <span class="estimation-list--unit--value text-secondary"> {{ unit }} </span> )
                                </span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Items in estimation -->
                    <estimate
                            v-for="estimation in estimations"
                            :key="estimation.id"
                            :estimation="estimation"
                    >
                    </estimate>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4"> Total </td>
                        <td> <span class="font-weight-bold">{{ totalEstimate }}</span> </td>
                        <td> </td>
                        <td> {{ totalVariance }} </td>
                        <td> </td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <!-- List End -->

        <!-- Add new Estimation Item -->
        <div class="estimation-list--new-task-form">
            <form>
                <!-- Labels -->
                <div class="form-row">
                    <div class="col-4">
                        <!-- Item name -->
                        <label for="itemName">Name</label>
                    </div>
                    <div class="col">
                        <!-- Optimistic Estimate -->
                        <label for="itemOptimistic">Optimistic</label>
                    </div>
                    <div class="col">
                        <!-- Pessimistic Estimate -->
                        <label for="itemPessimistic">Pessimistic</label>
                    </div>
                    <div class="col">
                        <!-- Most Likely Estimate -->
                        <label for="itemMostLikely">Most Likely</label>
                    </div>
                    <div class="col-auto">
                        <!-- Submit -->
                        <label for="submitBtn"> &plus; </label>
                    </div>
                </div>

                <!-- Input Fields -->
                <div class="form-row">
                    <div class="col-4">
                        <!-- Item name -->
                        <input
                            type="text"
                            placeholder="Task name"
                            id="itemName"
                            name="name"
                            class="form-control"
                            v-validate="'required|min:0|max:150'"
                            v-model.trim="newItem.name"
                            @keyup.enter="addItem"
                        >
                        <div class="invalid-feedback">
                            {{ errors.first('name') }}
                        </div>
                    </div>
                    <div class="col">
                        <!-- Optimistic Estimate -->
                        <input
                            type="number"
                            class="form-control"
                            id="itemOptimistic"
                            name="optimistic"
                            v-validate="'decimal:2|min_value:0|max_value:9999.99'"
                            v-model.number="newItem.optimistic"
                            @keyup.enter="addItem"
                        >
                        <div class="invalid-feedback">
                            {{ errors.first('optimistic') }}
                        </div>
                    </div>
                    <div class="col">
                        <!-- Pessimistic Estimate -->
                        <input
                            type="number"
                            class="form-control"
                            id="itemPessimistic"
                            name="pessimistic"
                            v-validate="'decimal:2|min_value:0|max_value:9999.99'"
                            v-model.number="newItem.pessimistic"
                            @keyup.enter="addItem"
                        >
                        <div class="invalid-feedback">
                            {{ errors.first('pessimistic') }}
                        </div>
                    </div>
                    <div class="col">
                        <!-- Most Likely Estimate -->
                        <input
                            type="number"
                            class="form-control"
                            id="itemMostLikely"
                            name="mostLikely"
                            v-validate="'decimal:2|min_value:0|max_value:9999.99'"
                            v-model.number="newItem.mostLikely"
                            @keyup.enter="addItem"
                        >
                        <div class="invalid-feedback">
                            {{ errors.first('mostLikely') }}
                        </div>
                    </div>
                    <div class="col-auto">
                        <!-- Submit -->
                        <button
                            type="button"
                            class="btn btn-primary mb-2"
                            id="submitBtn"
                            title="Add new Task"
                            v-on:click="addItem"
                            @keyup.enter="addItem"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <!-- End Add new Estimation Item -->

        <!-- Estimation Results -->
        <div class="estimation-list--results">
            <hr />
            <h4>
                Estimation Results
            </h4>

            <!-- Notification on low item count -->
            <div
                    v-if="estimations.length < 15 && estimations.length !== 0"
                    class="alert alert-light"
                    role="alert"
            >
                You should have at least 15 tasks before PERT estimation has value...
            </div>


            <table class="table table-striped table-responsive-sm">
                <thead>
                <tr>
                    <th> </th>
                    <th scope="col" title="68,26% probability to complete project between min. & max."> +/- 1 sigma <span class="text-muted">(68,26%)</span> </th>
                    <th scope="col" title="95,46% probability to complete project between min. & max."> +/- 2 sigma <span class="text-muted">(95,46%)</span> </th>
                    <th scope="col" title="99,73% probability to complete project between min. & max."> +/- 3 sigma <span class="text-muted">(99,73%)</span> </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td> Minimum </td>
                    <td> {{ lowerSigmaOne }} </td>
                    <td> {{ lowerSigmaTwo }} </td>
                    <td> {{ lowerSigmaThree }} </td>
                </tr>
                <tr>
                    <td> Maximum </td>
                    <td> {{ upperSigmaOne }} </td>
                    <td> <span class="font-weight-bold"> {{ upperSigmaTwo }} </span> </td>
                    <td> {{ upperSigmaThree }} </td>
                </tr>
                </tbody>
            </table>
        </div>
        <!-- End Estimation Results -->
    </div>
</template>

<script>
    import Estimation from './Estimation'
    import {
        ADD_ESTIMATION_ITEM,
        EDIT_ESTIMATION_TITLE
    } from './../../store/modules/mutations/types'
    import Item from './../../store/modules/Item'

    export default {
        name: 'estimations-list',
        components: {
            estimate: Estimation
        },
        data: () => {
            return {
                newItem: {},
                editTitle: false
            }
        },
        computed: {
            estimations () {
                return this.$store.state.Estimate.list
            },
            totalEstimate () {
                return this.$store.getters.totalEstimate.toFixed(2)
            },
            totalVariance () {
                return this.$store.getters.totalVariance.toFixed(2)
            },

            // -------------------------------------------- //

            lowerSigmaOne () {
                return this.$store.getters.lowerRangeEstimate(1).toFixed(2)
            },
            upperSigmaOne () {
                return this.$store.getters.upperRangeEstimate(1).toFixed(2)
            },

            lowerSigmaTwo () {
                return this.$store.getters.lowerRangeEstimate(2).toFixed(2)
            },
            upperSigmaTwo () {
                return this.$store.getters.upperRangeEstimate(2).toFixed(2)
            },

            lowerSigmaThree () {
                return this.$store.getters.lowerRangeEstimate(3).toFixed(2)
            },
            upperSigmaThree () {
                return this.$store.getters.upperRangeEstimate(3).toFixed(2)
            },

            // -------------------------------------------- //

            title: {
                get () {
                    return this.$store.state.Estimate.name
                },
                set (value) {
                    this.$store.commit(EDIT_ESTIMATION_TITLE, value)
                }
            },

            unit: {
                get () {
                    return this.$store.state.Estimate.unit
                }
            },

            // -------------------------------------------- //

            currentDateAndTime () {
                let date = new Date()
                return date.toLocaleDateString() + ', ' + date.toLocaleTimeString()
            }
        },
        methods: {
            /**
             * Add new estimation item
             * @param {object} event
             */
            addItem (event) {
                this.$validator.validate().then(result => {
                    // If not valid, abort
                    if (!result) {
                        return
                    }

                    // Add new item via "Item" object
                    this.$store.commit(ADD_ESTIMATION_ITEM, this.newItem)
                    this.reset()
                })
            },

            /**
             * Reset the new item model
             */
            reset () {
                this.$nextTick(() => {
                    // Clear
                    this.newItem = new Item(' ', 0, 0, 0)
                    this.editTitle = false

                    // Rest validation
                    this.$validator.reset()

                    // Focus name input
                    document.getElementById('itemName').focus()
                })
            },

            /**
             * Change state of edit title
             */
            showEditTitle () {
                this.editTitle = true

                this.$nextTick(() => {
                    // Focus title input
                    document.getElementById('estimation_title').focus()
                })
            },

            /**
             * Change state of edit title to false
             */
            closeEditTitle () {
                this.editTitle = false
            }
        },
        created: function () {
            this.reset()
        }
    }
</script>
