<template>
  <div class="page-header flex gap-12 items-center mb-16">
    <div class="title">
      <h1 class="white">Statistika</h1>
    </div>
  </div>
  <div class="page-body">
    <div class="rows gap-24">
      <div class="col-12">
        <ChartPie
          uid="top-programs"
          title="Ko'p foydalanilgan ilovalar"
          subtitle="Top 10"
          :data="topPrograms"
          format="<b>{point.name}</b>"
        ></ChartPie>
      </div>
      <div class="col-12">
        <ChartPie
          uid="top-employees"
          title="Ko'p ishlagan xodimlar"
          subtitle="Top 10"
          :data="topEmployees"
          format="<b>{point.name}</b>"
        ></ChartPie>
      </div>
      <div class="col-24">
        <div class="flex space-between center mb-24">
          <h2 class="text-white">Xodimlar hisoboti</h2>
          <Input type="date" v-model="empStatDate" />
        </div>
        <div class="table">
          <table>
            <thead>
              <tr>
                <th class="w-64 t-center">T/r</th>
                <th>Xodim</th>
                <th>Ish vaqti</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(employee, index) in employeeStatistics"
                :key="employee.id"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ employee.employee }}</td>
                <td>{{ formatTime(employee.count * 5) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="page-footer"></div>
</template>

<script setup>
import ChartPie from "@/components/g/ChartPie";
import Input from "@/components/g/Input";
import { ref, onMounted, watch } from "vue";
import axios from "@/plugins/axios";

const topPrograms = ref([]);
const topEmployees = ref([]);
const employeeStatistics = ref([]);
const empStatDate = ref(null);

onMounted(async () => {
  fetchProgramStatistics();
  fetchTopEmployeeStatistics();
  fetchEmployeeStatistics();
});

const fetchProgramStatistics = async () => {
  try {
    const response = await axios.get(
      "/admin/device-activity/active-program/statistics",
      {
        params: {
          limit: 10,
        },
      }
    );
    topPrograms.value = (response || []).map((item) => ({
      name: `${item.activeProgram}: ${formatTime(item.count * 5)}`,
      y: item.count,
    }));
  } catch (error) {
    console.error(error);
  }
};

const fetchTopEmployeeStatistics = async () => {
  try {
    const response = await axios.get(
      "/admin/device-activity/employee/statistics",
      {
        params: {
          limit: 10,
        },
      }
    );
    topEmployees.value = (response || []).map((item) => ({
      name: `${item.employee}: ${formatTime(item.count * 5)}`,
      y: item.count,
    }));
  } catch (error) {
    console.error(error);
  }
};

const fetchEmployeeStatistics = async () => {
  try {
    const response = await axios.get(
      "/admin/device-activity/employee/statistics",
      {
        params: {
          date: empStatDate.value?.split("-").reverse().join("-"),
        },
      }
    );
    employeeStatistics.value = response || [];
  } catch (error) {
    console.error(error);
  }
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = [];
  if (hours > 0) result.push(`${hours} soat`);
  if (minutes > 0) result.push(`${minutes} minut`);

  return result.length > 0 ? result.join(" ") : "0 minut";
};

watch(
  () => empStatDate.value,
  () => {
    fetchEmployeeStatistics();
  }
);
</script>
