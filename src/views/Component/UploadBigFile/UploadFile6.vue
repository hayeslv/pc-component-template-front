<!--
 * @Author: Lvhz
 * @Date: 2021-08-20 09:56:10
 * @Description: 并发数控制 + 报错重试
-->
<template>
  <div>
    <input ref="fileInput" type="file" name="file" @change="handlerFileChange">
    <div>
      <!-- 如果progress < 0，就报错，显示红色；100成功 -->
      <div class="cube-container clearfix" :style="{width: cubeWidth+'px'}">
        <div v-for="chunk in chunkList" :key="chunk.name" class="cube">
          <div :style="{height: chunk.progress+'%'}" :class="{'uploading': chunk.progress > 0 && chunk.progress < 100, 'success': chunk.progress === 100, 'error': chunk.progress < 0}" />
          <i v-if="chunk.progress > 0 && chunk.progress < 100" class="el-icon-loading" style="color: #f56c6c" />
        </div>
      </div>
    </div>

    <el-button type="primary" style="margin-top: 20px;" @click="handlerSubmit">点击上传</el-button>
  </div>
</template>

<script setup>
import { createFileChunk, calculateHashSample } from '@/utils/file'
import { CommonApi } from '@api'
import { ElMessage } from 'element-plus'
import { ref, computed } from 'vue'

const CHUNK_SIZE = 100 * 1024 // 初始化切片大小为 200kb

const fileInput = ref(null)
const fileRef = ref(null)
const chunkList = ref([])

const cubeWidth = computed(() => Math.ceil(Math.sqrt(chunkList.value.length)) * 16) 

const handlerFileChange = async (e) => {
  const [file] = e.target.files
  if (!file) return null
  fileRef.value = file

  // 计算切片
  const chunks = createFileChunk(fileRef.value, CHUNK_SIZE)
  chunkList.value = chunks
}

// 上传按钮点击
const handlerSubmit = async () => {
  if(!fileRef.value) return

  const hash = await calculateHashSample(fileRef.value)

  // 问一下后端，文件是否上传过，如果没有，是否有存在的切片
  const res = await CommonApi.checkfile({
    hash: hash,
    ext: fileRef.value.name.split('.').pop()
  })
  const { uploaded, uploadedList } = res.data
  console.log(uploadedList);

  if (uploaded) {
    return ElMessage.success('秒传成功')
  }

  // 分隔文件，切片
  chunkList.value = chunkList.value.map((chunk, index) => {
    // 切片的名字，hash + index
    const name = hash + '-' + index
    return {
      hash,
      name,
      index,
      chunk: chunk.file,
      progress: uploadedList.includes(name) ? 100 : 0
    }
  })

  // 上传切片
  await uploadChunks(chunkList.value, uploadedList)
  // 切片传送完毕，发送合并切片请求
  await mergeRequest(fileRef.value, CHUNK_SIZE, hash)
}
// 上传切片
const uploadChunks = async (chunks, uploadedList = []) => {
  const requests = chunks
  .filter(chunk => !uploadedList.includes(chunk.name))
  .map((chunk) => {
    return {
      form: {
        chunk: chunk.chunk,
        hash: chunk.hash,
        name: chunk.name
      },
      index: chunk.index,
      error: 0
    }
  })

  // 尝试申请tcp链接过多，也会造成卡顿
  // await Promise.all(requests)
  await sendRequest(requests)
}
const mergeRequest = async (file, size, hash) => {
  const params = {
    ext: file.name.split('.').pop(),
    size: size,
    hash: hash
  }
  await CommonApi.mergefile(params)
}
// 发送请求
const sendRequest = (chunks, limit = 3) => {
  // 核心的思路是用一个数组，数组的长度是limit
  return new Promise((resolve, reject) => {
    const len = chunks.length // 总任务数
    let count = 0 // 已完成任务数
    let isStop = false
    const start = async () => {
      if (isStop) return
      const task = chunks.shift()
      if(task) {
        const { form, index } = task
        try {
          await CommonApi.uploadfileChunk(form, {
            onUploadProgress: (progress) => {
              chunkList.value[index].progress = Number(((progress.loaded / progress.total) * 100).toFixed(2))
            }
          })
          if(count === len - 1) {
            // 完成最后一个任务
            resolve()
          } else {
            count++
            // 当前任务完成，启动下一个任务
            start()
          }
        } catch (error) {
          chunkList.value[index].progress = -1
          console.log(chunkList.value);
          if (task.error < 3) {
            task.error++
            chunks.unshift(task)
            start()
          }else {
            // 错误三次
            isStop = true
            reject(error)
          }
        }
      }
    }

    while(limit > 0) {
      // 启动limit个任务
      start()
      limit--
    }
  })
}

</script>

<style lang="scss" scoped>
.cube-container{
  margin-top: 10px;
  .cube{
    width: 14px;
    height: 14px;
    line-height: 12px;
    border: 1px solid black;
    background-color: #eee;
    float: left;
    >.success{
      background-color: green;
    }
    >.uploading{
      background-color: blue;
    }
    >.error{
      background-color: red;
    }
  }
}
</style>
