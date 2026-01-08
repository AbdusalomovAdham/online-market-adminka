<template>
  <g-modal :title="$props.date" width="1200" @close="$emits('cancel')">
    <template v-slot:body>
      <div class="frame-video">
        <div class="rows mb-18">
          <div class="col-24">
            <Select
              label="Monitor"
              placeholder="Tanlang"
              v-model="activeMonitor"
              :options="detail.monitors"
              option="number"
              value="number"
              unclearable
            ></Select>
          </div>
        </div>
        <div class="player">
          <div class="screen">
            <video
              :src="`https://smart-dm.uz/video?monitor=${activeMonitor}&date=${$props.date
                .split('.')
                .join('-')}&deviceUID=${$props.deviceUID}`"
              controls
            />
          </div>
          <div class="progress-bar mt-24 mb-24" id="progress-bar">
            <div class="frames">
              <div
                @click="activeFrameIdx = idx"
                :class="['frame', idx === activeFrameIdx && 'active']"
                v-for="(f, idx) in frames"
                :key="idx"
                :style="{
                  left: 3 * f.start + 'px',
                  width: 3 * (f.end - f.start) + 'px',
                }"
              >
                <div class="images">
                  <img
                    v-for="i in 4"
                    :key="i"
                    src="https://i.pinimg.com/736x/d4/99/36/d49936efc16bd43b230fb18635a769c5.jpg"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div class="minutes">
              <div v-for="j in 1440" :key="j" class="minute">
                <span v-if="j % 60 === 0 && j != 1440" class="number">
                  {{ j / 60 }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="false" class="controls">
            <div class="buttons">
              <button label="Play" class="play" @click="playVideo">
                <IconPlay></IconPlay>
              </button>
              <button label="Pause" class="pause" @click="pauseVideo">
                <IconPause></IconPause>
              </button>
            </div>
          </div>
        </div>
        <div class="programs">
          <div v-for="p in activeProgramStats" class="item">
            <span>{{ p.activeProgram }}</span>
            <span class="line"></span>
            <span>{{ formatTime(p.count * 5) }}</span>
          </div>
        </div>
      </div>
    </template>
  </g-modal>
</template>

<script setup>
import GModal from "@/components/g/Modal.vue";
import Select from "@/components/g/Select.vue";
import IconPlay from "@/components/icon/Play.vue";
import IconPause from "@/components/icon/Pause.vue";
import { ref, defineEmits, onMounted } from "vue";
import axios from "@/plugins/axios";

const $emits = defineEmits({
  cancel: null,
});
const $props = defineProps({
  date: null,
  deviceId: null,
  deviceUID: null,
});
const detail = ref({});
const activeMonitor = ref(null);
const activeProgramStats = ref([]);
const frames = ref([
  {
    start: 480,
    end: 600,
  },
  {
    start: 630,
    end: 650,
  },
  {
    start: 660,
    end: 662,
  },
  {
    start: 720,
    end: 810,
  },
]);
const activeFrameIdx = ref(null);

const playVideo = () => {
  // Implement play video logic here
};
const pauseVideo = () => {
  // Implement pause video logic here
};

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

const fetchDetail = async () => {
  try {
    const response = await axios.post(`/admin/device-activity/by-date`, {
      date: $props.date,
      deviceId: +$props.deviceId,
    });
    detail.value = response || { monitors: [] };
    if (detail.value.monitors.length > 0) {
      activeMonitor.value = detail.value.monitors[0].number;
    }
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

const fetchActiveProgramStats = async () => {
  try {
    const response = await axios.get(
      `/admin/active-program/statistics/${$props.deviceId}?date=${$props.date
        .split(".")
        .join("-")}`
    );
    activeProgramStats.value = response || [];
  } catch (e) {
    alert(e);
    console.error(e);
  }
};

onMounted(async () => {
  await fetchDetail();
  await fetchActiveProgramStats();

  let progressBar = document.getElementById("progress-bar");

  if (frames.value?.[0]?.start) {
    activeFrameIdx.value = 0;
    progressBar.scrollTo({
      left: frames.value[0].start * 3 - 50,
      behavior: "smooth",
    });
  }
});
</script>
