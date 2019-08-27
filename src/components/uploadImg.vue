<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :http-request="uploadFile"
      :limit="1"
      action
      :show-file-list="false"
      :file-list="fileLists"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "service",
  data() {
    return { imageUrl: "", fileLists: [] };
  },
  created() {},
  methods: {
    uploadFile(item) {
      const formdata = new FormData();
      formdata.append("upload_img", item.file);
      formdata.append("type", 0);
      axios
        .post("http://120.79.28.58/index/base/upload", formdata)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.imageUrl = res.data.data.http_image;
         
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {});
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
