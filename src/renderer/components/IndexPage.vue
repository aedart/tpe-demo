<template>
    <div id="index-page">

        <!-- List of estimations -->
        <estimations-list></estimations-list>

    </div>
</template>

<script>
    import EstimationsList from './Estimations/EstimationList'

    export default {
        name: 'index-page',
        components: {
            'estimations-list': EstimationsList
        }
    }
</script>
