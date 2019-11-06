const regView = require('../views/reg.art')
class Reg{
    constructor(){
        $('#root').on('tap','.r-return',function(){
            window.history.go(-1)
        })
        $('#root').on('tap','.jump-login',function(){
            location.hash = 'login'
        })
    }
    init(){
        this.render()
    }
    render(){
        let regHtml = regView({})
        document.querySelector('main').innerHTML = regHtml;
        $('header').css({
            display : 'none'
        })
        $('footer').css({
            display : 'none'
        })
        $('.reg-btn').on('tap',this.reg.bind(this))
    }
    reg(){
        this.account = $('.user-account').val()
        this.password = $('.password').val()
        let src = "/api/users/register"
        $.ajax({
            url:src,
            type : "post",
            dataType:"json",
            data:{
                account :  this.account,
                password : this.password
            },
            success:function(res){
                switch (res.data.message) {
                    case "1":
                      alert("注册成功，即将跳转登录页面")
                      location.hash = 'login';
                      break;
                    case "2":
                      alert("账号已存在");
                      break;
                  }
                 },
                  error:function(){
                    alert("登录失败，请检查您的网络！");
                  }
        })
    }
}
export default new Reg();