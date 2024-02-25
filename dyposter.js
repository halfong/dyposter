/**
 * 根据容器及配置生成poster
 * @依赖 zepto.js, fabric.js
 * - 宽度由box元素样式决定，高度按poster比例自动确定
 *  - box element决定最终输出img大小
 * @todo 自定义fabric库，无需交互功能
 */
class Dyposter {

  $canvas
  $box   //DOM元素
  $img   //显示图片结果

  scaleRate

  //最终输出
  width = 400;
  height = 400;
  format = 'jpeg';
  quality = 90;

  //Canvas设置
  backgroundColor = '#F4F4F4';
  /**
   * 
   * @param {string} id box元素id
   * @param {object} options { witdh, height, format, quality }
   */
  constructor(id, options = {}) {
    Object.assign(this, options)
    //初始化$box
    this.$box = $('#' + id)
    this.scaleRate = this.$box.width() / this.width
    this.$box.height(this.height * this.scaleRate).css('position', 'relative')

    //初始化$canvas
    this.$box.append($('<canvas></canvas>', { id: 'dyposter-canvas' }))
    this.$canvas = new fabric.Canvas('dyposter-canvas', {
      interactive: false,
      selection: false,
      backgroundColor: this.backgroundColor,
    });
    this.$canvas.setWidth(this.$box.width())
    this.$canvas.setHeight(this.$box.height())
    this.$canvas.setZoom(this.scaleRate)

    //初始化$img，盖在$canvas上面
    this.$img = $('<img/>', {
      id: 'dyposter-image', css: {
        width: this.$box.width(), height: this.$box.height(),
        position: 'absolute', left: 0, top: 0, 'z-index': 2,
      }
    })
    this.$box.append(this.$img)
  }

  draw(objects = []) {
    Promise.all( objects.map( (o,idx) => this[`__${o.type}`](o,idx) ) )
    .then( _objs => {
      const oG = new fabric.Group( _objs )
      // console.log( _objs )
      this.$canvas.add( oG )
      this.__buildImage()
      // this.__buildImage()
    })
  }

  __textbox( obj, idx ){
    const oText = new fabric.Textbox( obj.text )
    oText.set( obj )
    return Promise.resolve( oText )
  }

  //扩展了`mode`参数，若有将scale到width和height中
  __image( obj, idx ){
    const that = this
    return getURLBase64( obj.src ).then( b64 => new Promise( ( res, rej )=>{
      fabric.Image.fromURL( b64, function( oImg ){
        delete obj.src, obj.mode
        Object.assign( obj, that.__scaleFit( obj.mode, obj.width, obj.height, oImg.width, oImg.height ) )
        console.log( obj )
        oImg.set( obj )
        res( oImg )
      })
    }) )
  }

  __scaleFit( mode, width, height, ow, oh ){
    const radio = width / height
    const byW = ( ow/oh ) < radio

    let scaleX = 1, scaleY = 1
    switch(mode){
      case 'cover':
        if( byW ){
          scaleX = width/ow
          scaleY = scaleX
          width = ow
          height = ow / radio
        }else{
          scaleY = height/oh
          scaleX = scaleY
          height = oh
          width = oh * radio
        }
        break;
    }
    return { width, height, scaleX , scaleY }
  }

  __buildImage() {
    console.log( this.$canvas.toJSON() )
    console.log( this.$canvas.getObjects() )
    this.$img.attr('src', this.$canvas.toDataURL({ format: this.format, quality: this.quality, multiplier: 1 / this.scaleRate }))
  }

}



function getURLBase64(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.responseType = 'blob'
    xhr.onload = function() {
      if (this.status === 200) {
        var blob = this.response
        var fileReader = new FileReader()
        fileReader.onloadend = function(e) {
          var result = e.target.result
          resolve(result)
        }
        fileReader.readAsDataURL(blob)
      }
    }
    xhr.onerror = function() {
      reject()
    }
    xhr.send()
  })
}