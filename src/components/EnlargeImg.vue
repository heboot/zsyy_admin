<template>
    <div>
        <Modal
        v-model="modal"
        title="查看图片"
        @on-ok="ok">
        <img :src="imgsrc" alt="" style="width:100%;">
        </Modal>
    </div>
</template>
<script>
export default {
    name:"enlargeImg",
    props:["imgsrc"],
    data(){
        return{
            modal:false,
        }
    },
    methods:{
        ok(){
            this.$emit("clickOK");
        }
    }
}
</script>
<style lang="less" scoped>

</style>

