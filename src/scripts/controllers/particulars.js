const particularsView = require('../views/particulars.art')
const particularsData = require('../models/particularsAjax');
const ListView = require('../views/list.art');
const postionModel = require('../models/position');
class Particulars{
    constructor (){
        
    }
    init(){
        this.getData()
        this.render();
        this.like()
    }
    render(){
        document.querySelector('#root').innerHTML = "";
    }
  async  getData(){
      let id = location.hash.split('=')[1]
      this.id = id;
      this.id = "?"+this.id;
        let result = await particularsData({
            id:id
        })
        this.renderer(result)
    }
    renderer(result){
      let  list = result.data.message[0]
      localStorage.setItem(list.goodsId,1);
        const particularsHtml = particularsView({
            list 
        })
        document.querySelector('#root').innerHTML = particularsHtml;
        this.bindEvent()
        this.main = $(".main")
            this.scroll();
     
    }
    scroll(){
      
        let bScroll = new BScroll( this.main.get(0), {
            probeType: 2
          })
          bScroll.on('scrollEnd',function(){
              if(-this.y > document.body.clientHeight){
                  $('.to-top').css({
                      display : "block"
                  })
              }
              else{
                $('.to-top').css({
                    display : "none"
                })
              }
          })
          $(".to-top").on("tap",function(){
            bScroll.scrollTo(0,0,1000)
          })
          bScroll.on("scrollEnd",function(){
                if($('.good-intro').offset().top <= 0 ){
                    $(".goods-intro").css({
                        background: "linear-gradient(#aeaeae,#b3b3b3)"
                    })
                    $(".goods-intro").siblings().css({
                        background:"#f2f2f2"
                    })
                }
                else{
                    $(".goods").css({
                        background: "linear-gradient(#aeaeae,#b3b3b3)"
                    })
                    $(".goods").siblings().css({
                        background:"#f2f2f2"
                    })
                }
                 if($('.guess').offset().top <= 100){
                    $(".guess-like").css({
                        background: "linear-gradient(#aeaeae,#b3b3b3)"
                    })
                    $(".guess-like").siblings().css({
                        background:"#f2f2f2"
                    })
                }
          })
          this.goodsIntro = $('.good-intro').offset().top
          $(".goods").on("click",function(){
            bScroll.scrollTo(0,0,1000)
          })
          $(".goods-intro").on("click",function(){
            bScroll.scrollTo(0,-this.goodsIntro,1000)
          }.bind(this))
          $('.guess-like').on('click',function(){
            bScroll.scrollTo(0,-($('.good-intro').offset().height+this.goodsIntro),1000)
          }.bind(this))
    }
    bindEvent(){
        $('.back').on('tap',function(){
            window.history.go(-1)
        })
        $('h5').on('tap',this.addCart.bind(this))
    }
    addCart(){
        if(localStorage.getItem('id') == null){
            localStorage.setItem("id", this.id);
            this.localId = localStorage.getItem("id")
        }
        else{
            this.localId = localStorage.getItem("id")
            this.localId += this.id;
            localStorage.setItem("id", this.localId);
        }
      
    }
    async like() {
        var result = await postionModel({
            start: Math.floor(Math.random() * 7),
            pageCount: 6
        })
        let listHtml = ListView({
            list: result.data.list
        })
        $('.like-cont').html(listHtml)
        $('.like-cont div').on('tap', this.bindTap);
    }
    bindTap() {
        var id = $(this).attr('data-id')
        id = id.substr(0, 7);
        location.hash = `particulars=${id}`;
    }
}
export default new Particulars();