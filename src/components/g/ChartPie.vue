<template>
  <div class="chart">
    <div class="chart-wrapper">
      <div class="chart-filter">
        <div
          :id="`chart-pie-container-${$props.uid}`"
          :class="[chartClass]"
        ></div>
      </div>
      <div class="chart-body"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, watch } from "vue";

const $props = defineProps({
  title: {
    type: String,
    default: "Statistika",
  },
  data: {
    type: Array,
    default: [
      {
        name: "Data",
        y: 100,
      },
    ],
  },
  uid: {
    type: String,
    default: "0",
  },
  subtitle: {
    type: String,
    default: "Statistika",
  },
  chartClass: {
    type: String,
    default: null,
  },
  format: {
    type: String,
    default: "<b>{point.name}:</b> {point.y}",
  },
});

onMounted(() => {
  setChart();
});

watch(
  () => $props.data,
  (v) => {
    setChart();
  }
);

const setChart = () => {
  Highcharts.chart(`chart-pie-container-${$props.uid}`, {
    chart: {
      type: "pie",
    },
    title: {
      text: $props.title,
      align: "left",
    },
    subtitle: {
      text: $props.subtitle,
      align: "left",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        borderWidth: 2,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: $props.format,
          distance: 20,
        },
      },
    },
    series: [
      {
        // Disable mouse tracking on load, enable after custom animation
        enableMouseTracking: false,
        animation: {
          duration: 2000,
        },
        colorByPoint: true,
        data: $props.data,
      },
    ],
  });
};
</script>

<style scoped>
.chart-wrapper {
  padding: 8px;
  border-radius: 8px;
  background-color: #fff;
}
</style>
