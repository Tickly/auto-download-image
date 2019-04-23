<template>
  <div>
    <label>存放文件夹<input v-model="dir"></label>

    <section>
      <label>
        <input type="checkbox">
        <span>hostname</span>
      </label>
      <label>
        <input type="checkbox">
        <span>pathname</span>
      </label>
    </section>
    <section v-if="false">
      <el-tree :props="defaultProps" :data="treeData" show-checkbox></el-tree>
    </section>
    <section>
      <button @click="download">下载</button>
      <button @click="showDefaultFolder">打开文件夹</button>
    </section>
    <hr>
    <p v-text="msg"></p>
  </div>
</template>
<script>
const Downloads = chrome.downloads;


export default {
  data () {
    return {
      dir: null,
      msg: '自动下载网站图片，支持翻页',

      // 下载队列
      queue: [],

      // 进度展示
      // 所有下载数量
      all: 0,
      // 下载完成数量
      d: 0,


      // 
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [

        {
          label: '一级 1',
          children: [

            {
              label: '二级 1-1',
              children: [{
                label: '三级 1-1-1'
              }]
            }]
        },
        {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        },
        {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }
      ]

    }
  },
  created () {
    this.getDomain()

    Downloads.onDeterminingFilename.addListener((downloadItem, suggest) => {
      console.log('onDeterminingFilename', downloadItem)
      suggest({
        filename: `${this.dir}/${downloadItem.filename}`
      })
    })

    Downloads.onChanged.addListener((delta) => {
      console.log('onChanged', delta);
      if (delta.state && delta.state.current === 'complete') {
        this.onComplete(delta.id);
      }
    })

    Downloads.onCreated.addListener(item => {
      console.log('onCreated', item);
      this.onCreated(item.id);
    })



  },
  mounted () {
    // 监听事件，获取到images
    chrome.runtime.onMessage.addListener(function (request, sender) {
      console.log(arguments)
      return;
      if ('on-images-got' === request.action) {
        onImagesGot(request.data)
      }
    })

    function onImagesGot (imgs) {
      console.log('get images', imgs)
      for (const img of imgs) {
        console.log('get images src', img.src)
        Downloads.download({
          url: img.src,
        })
      }
    }
  },
  methods: {

    // 下载开始（单个文件
    onCreated (id) {
      //   this.queue.push(id)
      this.all++
    },

    // 下载结束（单个文件
    onComplete (id) {
      this.d++
      this.msg = `onComplete, ${this.d}/${this.all}`
      Downloads.erase({
        id
      })
    },

    getItem (id) {

    },


    getDomain () {
      chrome.tabs.getSelected(null, tab => {
        let url = new URL(tab.url);
        this.dir = url.host
      })
    },

    download () {
      chrome.tabs.executeScript(null, {
        file: 'getImages.js'
      }, function () {
        console.log('what')
      })
    },
    showDefaultFolder () {
      // Downloads.showDefaultFolder();
    }
  }
}
</script>

