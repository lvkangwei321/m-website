const mineView = require('../views/mine.art')
class Mine{
    constructor(){
    }
  async  init(){
       await this.render();
       this.cookie = $.fn.cookie('user')
        window.onload = this.change.bind(this)()
    }
    render(){
       let mineHtml = mineView({});
        document.querySelector('main').innerHTML = mineHtml;
       new BScroll($('main').get(0), {
            probeType: 2
          })
          $('header').css({
            display:'none'
        })
        this.user = $('.user-mes')
        this.bindEvent();
    }
    bindEvent(){{
        $('.reg').on('tap',function(){
            location.hash = 'reg';
        })
        $('.login').on('tap',function(){
            location.hash = 'login';
        })
     
    }}
    change(){
        console.log(this.cookie);
        if(this.cookie !== "null" && this.cookie != undefined){
            this.user.html(this.cookie)
            this.user.append($("<a href='' class = 'quit'>退出登录</a>"))
            this.quit = $(".quit")
            this.quit.on("tap",function(){
                console.log(1);
                $.fn.cookie('user', '0', { expires: -1, path:'/' })
                window.location.reload()
            })
        }
    }
}
export default new Mine();