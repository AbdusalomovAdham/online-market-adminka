<template>
    <g-modal title="Rasmni tahrirlash">
        <template v-slot:body>
            <VueCropper ref="cropper" class="cropper mb-24" :aspect-ratio="3 / 4" :src="$props.file" :auto-crop-area-ratio="1"
                @cropend="cropImage" />
            <div class="flex gap-8 content-end">
                <Button class="main" @click="upload">Yuklash</Button>
                <Button @click="cancel">Bekor qilish</Button>
            </div>
        </template>
    </g-modal>
</template>
<script>
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import { defineComponent, ref } from "vue";
import GModal from '@/components/g/Modal.vue'
import Button from '@/components/g/Button.vue'

export default defineComponent({
    name: "GCropped",
    props: {
        file: {
            type: String,
            required: true,
        },
    },
    components: {
        VueCropper,
        GModal,
        Button
    },
    emits: ["onCrop", "onClose"],
    setup(_, { emit }) {
        const cropper = ref();
        const file = ref(null);

        const upload = () => {
            console.log('upload', file.value)
            emit("onCrop", file.value);
            emit("onClose");
        };

        const cancel = () => {
            emit("onClose");
        };

        const cropImage = () => {
            const _cropper = cropper.value;
            const croppedCanvas = _cropper.getCroppedCanvas();
            croppedCanvas.toBlob((blob) => {
                file.value = new File([blob], "cropped_image.jpeg", {
                    type: "image/jpeg",
                });
            }, "image/jpeg");
        };

        return {
            cropImage,
            cropper,
            upload,
            cancel,
        };
    },
});
</script>

<style lang="scss">
.g-cropper-modal {
    background-color: transparent;

    .ant-modal-content {
        background-color: transparent;
        padding: 0 !important;

        .ant-modal-body {
            .t-modal-body {
                gap: 0;
            }
        }
    }
}

.cropper {
    height: 600px;
    width: 100%;
    background: #ddd;
}
</style>