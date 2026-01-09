<template>
  <vue3-datatable
    :rows="rows"
    :columns="cols"
    :loading="loading"
    :isServerMode="true"
    :totalRows="totalRows"
    :pageSize="params.pagesize"
    :sortable="true"
    :hasCheckbox="true"
    @change="changeServer"
  >
    <!-- Tabel index -->
    <template #__index="rows">
      <div class="flex center">
        {{ rows.value.__index }}
      </div>
    </template>

    <!-- Product name -->
    <template #name="rows">
      <div class="flex items-center gap-2">
        <img
          :src="`http://localhost:8980/` + rows.value?.images[0]?.path"
          class="product-image"
          alt="product-image"
          v-if="rows.value.images && rows.value.images.length > 0"
        />
        <img
          src="@/assets/images/product-placeholder.png"
          class="product-image"
          alt="product-image"
          v-else
        />
        <div class="font-semibold">
          {{ rows.value.name }}
        </div>
      </div>
    </template>

    <!-- Product price -->
    <template #price="rows"> {{ formatPrice(rows.value.price) }} </template>

    <!-- Product stock quantity -->
    <template #stock_quantity="rows">
      {{ formatPrice(rows.value.stock_quantity) }}
    </template>

    <!-- Product rating -->
    <template #rating_avg="rows">
      <div class="rating text-warning" v-if="rows.value.rating_avg">
        <div
          v-for="i in getRating(rows.value.rating_avg)"
          :key="i + rows.value.rating_avg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#e2a03f"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-star f-icon-line"
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            ></polygon>
          </svg>
        </div>
      </div>
      <div v-else>-</div>
    </template>

    <!-- Product views count -->
    <template #views_count="rows">
      <div class="views">
        <span class="views__count">
          {{ formatPrice(rows.value.views_count) }}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path
            d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"
          ></path>
        </svg>
      </div>
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

    <!-- Product  discount percent -->
    <template #discount_percent="rows">
      <span
        class="discount"
        :class="
          rows.value.discount_percent > 0
            ? 'discount--active'
            : 'discount--none'
        "
      >
        {{
          rows.value.discount_percent > 0
            ? `-${rows.value.discount_percent}%`
            : "No discount"
        }}
      </span>
    </template>

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
import { useRouter } from "vue-router";

const router = useRouter();
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
});

// emits
const emit = defineEmits([
  "change-server",
  "refetch",
  "delete-product",
  "update-status",
]);

const getRating = (rating) => {
  if (rating === null || rating === undefined || rating === "" || rating === 0)
    return 0;
  return Math.floor(rating);
};

// Table columns
const cols =
  ref([
    {
      field: "__index",
      title: "T/r",
      sort: false,
    },
    { field: "name", title: "Mahsulot nomi", sort: false },
    { field: "category_name", title: "Kategoriya", sort: false },
    { field: "price", title: "Narxi", sort: false },
    { field: "stock_quantity", title: "Qolgan soni", sort: false },
    { field: "stock_quantity", title: "Sotilgan", sort: false },
    {
      field: "rating_avg",
      title: "Reting",
      sort: false,
      minWidth: "120px",
      headerClass: "justify-center",
      cellClass: "justify-center",
    },
    { field: "views_count", title: "Ko'rilgan", sort: false },
    { field: "discount_percent", title: "Chegirma", sort: false },
    { field: "status", title: "Holati", sort: false },
    {
      field: "id",
      title: "",
      sort: false,
      search: false,
    },
  ]) || [];

// Table rows
const rows = computed(() => {
  if (!Array.isArray(props.products)) {
    return [];
  }

  const page = params.current_page || 1;
  const size = params.pagesize || props.products.length;

  return props.products.map((item, index) => ({
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

// Format product price
const formatPrice = (value) => {
  if (value === null || value === undefined) return "0";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

// Delete product
const onDelete = (id) => {
  emit("delete-product", id);
};

// Update product
const onEdit = (id) => {
  router.push(`/cabinet/admin/products/update/${id}`);
};

// Watch product list
watch(
  () => props.products,
  (val) => {
    console.log("PRODUCTS:", val);
    console.log("LENGTH:", val?.length);
  },
  { immediate: true }
);
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
