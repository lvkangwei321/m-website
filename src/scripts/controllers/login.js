const loginView = require('../views/login.art')
class Login{
    constructor(){
        $('#root').on('tap','.l-return',function(){
            window.history.go(-1)
        })
        $('#root').on('tap','.jump-reg',function(){
            location.hash = 'reg'
        })
    }
    init(){
        this.render()
    }
    render(){
        let loginHtml = loginView({})
        document.querySelector('main').innerHTML = loginHtml;
        $('header').css({
            display : 'none'
        })
        $('footer').css({
            display : 'none'
        })
        $('.reg-btn').on('tap',this.login.bind(this))
    }
    login(){
        let src = '/api/users/login'
        this.account = $('.user-account').val()
        this.password = $('.password').val()
        $.ajax({
            url:src,
            type:"post",
            dataType:"json",
            data:{
                account :  this.account,
                password : this.password
            },
            success:function(res){
                console.log(res);
                var usermsg = this.account
                $.fn.cookie('user', usermsg, { expires: 7, path: '/' });
                switch (res.data.message) {
                    case "1":
                        alert("登陆成功，即将跳转主页")
                     location.hash = 'mine'
                      break;
                    case "3":
                      alert("账号或密码缺失不全");
                      break;
                  }
                 }.bind(this),
                  error:function(){
                    alert("登录失败，请检查您的网络！");
                  }
        })
    }
}
export default new Login();