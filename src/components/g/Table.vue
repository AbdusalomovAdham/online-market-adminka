<template>
  <vue3-datatable
    :rows="rows"
    :columns="cols"
    :loading="loading"
    :isServerMode="true"
    :totalRows="totalRows"
    :pageSize="params.pagesize"
    :sortable="true"
    :hasCheckbox="hasCheckbox"
    @change="changeServer"
  >
    <!-- Tabel index -->
    <template #__index="rows">
      <div class="flex center">
        {{ rows.value.__index }}
      </div>
    </template>

    <template #type="rows">
      <div class="">{{ rows.value.type || "Mavjud emas" }}</div>
    </template>

    <!-- Product status -->
    <template #status="rows">
      <span
        class="badge"
        :class="[statusColor(rows.value.status)]"
        @dblclick="toggleStatus(rows.value.id, rows.value.status)"
        >{{ status(rows.value.status) }}</span
      >
    </template>

    <!-- Parent name -->
    <template #parent_name="rows">
      <div class="">{{ rows.value.parent_name || "Mavjud emas" }}</div>
    </template>

    <!-- Product id -->
    <template #id="rows">
      <div class="actions">
        <Button class="blue edit" @click="onEdit(rows.value.id)">
          <IconPencil />
        </Button>

        <Button class="red delete" @click="onDelete(rows.value.id)">
          <IconTrash />
        </Button>
      </div>
    </template>
  </vue3-datatable>
</template>

<script setup>
import { ref, toRaw, computed, onMounted, reactive, watch } from "vue";
import Button from "@/components/g/Button.vue";
import IconTrash from "@/components/icon/Trash.vue";
import IconPencil from "@/components/icon/Pencil.vue";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import "@bhplugin/vue3-datatable/dist/style.css";

// props
const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    required: true,
  },
  totalRows: {
    type: Number,
    default: 0,
  },
  cols: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
  hasCheckbox: {
    type: Boolean,
    default: false,
  },
});

// emits
const emit = defineEmits([
  "change-server",
  "refetch",
  "delete",
  "update-status",
  "update",
]);

// Table columns
const cols = computed(() => props.cols);

// Table rows
const rows = computed(() => {
  if (!Array.isArray(props.rows) || props.rows.length === null) {
    return [];
  }

  const page = params.current_page || 1;
  const size = params.pagesize || props.rows.length;

  return props.rows.map((item, index) => ({
    ...item,
    __index: (page - 1) * size + index + 1,
  }));
});

// Table pagination
const params = reactive({
  current_page: 1,
  pagesize: 10,
  sort_column: "id",
  sort_direction: "desc",
});

// Change server emit
const changeServer = (data) => {
  emit("change-server", {
    page: data.current_page,
    limit: data.pagesize,
    order: `id+${data.sort_direction}`,
  });
};

//Product status color
const statusColor = (status) => {
  return status === false ? "danger" : "success";
};

//Product status
const status = (status) => {
  return status === false ? "INACTIVE" : "ACTIVE";
};

// Update product status
const toggleStatus = (id, val) => {
  emit("update-status", {
    id,
    status: !val,
  });
};

const onEdit = async (id) => {
  emit("update", id);
};

// Delete product
const onDelete = (id) => {
  emit("delete", id);
};

// // Watch product list
// watch(
//   () => props.products,
//   (val) => {},
//   { immediate: true }
// );
</script>

<style scoped>
/*Table body */
.advanced-table .progress-bar {
  width: 80%;
  min-width: 120px;
  height: 8px;
  background-color: #ebedf2;
  border-radius: 9999px;
  display: flex;
}

.advanced-table .progress-line {
  height: 8px;
  border-radius: 9999px;
}

:deep(.bh-table-responsive) {
  background-color: #fff !important;
}

/* Table product image */
.product-image {
  width: 36px;
  height: 40px;
  border-radius: 8px;
  max-width: none;
  margin-right: 10px;
}

/*Table product rating */
.rating {
  display: flex;
  gap: 4px;

  &__star {
    width: 16px;
    height: 16px;
    fill: #e2a03f;
    stroke: currentColor;
  }
}

.text-warning {
  color: #e2a03f;
}

.bh-items-center {
  align-items: center;
}

.bh-flex {
  display: flex;
}

/* Product status style */
.success {
  background-color: #2ecc71;
}

.danger {
  background-color: #e74c3c;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 400;
  color: #fff;
  line-height: 1;
}

/* Product discount style */
.discount {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.discount--none {
  background-color: #f1f3f6;
  color: #9aa4b2;
}

.discount--active {
  background-color: #fff1f2;
  color: #e11d48; /* qizil */
  box-shadow: 0 0 0 1px rgba(225, 29, 72, 0.25);
}

/* Product actions style */
.actions {
  display: flex;
  gap: 8px;
}

/* Product views style */
.views {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 500;
}

.views__icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.views__count {
  line-height: 1;
}
</style>
