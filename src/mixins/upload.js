
// 定义一个混入对象

import { BASICURL } from '@/service/getData';

export default {
  data() {
    return {
      uploadAction: `${BASICURL}/admin/common/upload/oss/image`,
      startPageImg: "",//启动页图片
      imgUrl: "",
      visible: false,
      imgList: ["https://zhengtuo.oss-cn-qingdao.aliyuncs.com/2019/03/05/26b4bebf-7575-4f43-ae8a-ba59e98edae2.jpeg", "https://zhengtuo.oss-cn-qingdao.aliyuncs.com/2019/03/05/2e9fbd24-437a-41a5-af58-ed4fb8c617a6.png"] //引导页图片
    };
  },
  methods: {
    onImgMoveLeft(index) {
      if (index - 1 >= 0) {
        let imgs = [...this.imgList];
        [imgs[index - 1], imgs[index]] = [imgs[index], imgs[index - 1]]
        this.imgList = imgs
      }
    },
    onImgMoveRight(index) {
      let imgs = [...this.imgList];
      if (index + 1 < imgs.length) {
        [imgs[index + 1], imgs[index]] = [imgs[index], imgs[index + 1]]
        this.imgList = imgs
      }
    },
    handleView(url) {
      this.imgUrl = url;
      this.visible = true;
    },
    handleRemove(index) {
      this.imgList.splice(index, 1);
    },
    handleSuccessStartPage(res) {
      this.startPageImg = res.data
    },
    handleSuccess(res, file) {
      this.imgList.push(res.data)
    },
    handleError() {
      this.$Message.error("上传失败");
    },
    handleFormatError(file) {
      this.$Message.error("不支持的文件类型");
    },
    handleMaxSize(file) {
      this.$Message.error("单个文件不能超过1M");
    }
  }
}
