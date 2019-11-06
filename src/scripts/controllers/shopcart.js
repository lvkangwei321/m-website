const shopcartView = require('../views/shopcart.art')
const postionModel = require('../models/position');
const ListView = require('../views/list.art');
const particularsData = require('../models/particularsAjax');
const cartlistView = require('../views/cartlist.art')
class Shopcart {
    constructor() {
        var _ = this;
        $('#root').on('tap', '.chose-all', function () {
            _.choseAll.bind(this)(_)
            _.chose()
        })
        $('#root').on('tap', '.num-add', function () {
            _.numAdd.bind(this)(_)
        })
        $('#root').on('tap', '.num-reduce', function () {
            _.numReduce.bind(this)(_)
        })
        $('#root').on('tap','.guess img',function(){
            _.like()
        })
    }
    init() {
        this.render();
        this.like();
    }

    numAdd(_) {
        let num = $(this.parentNode).attr('data-id')
        num = num.substr(0, 7)
        let localNum = localStorage.getItem(num);
        localNum++;
        localStorage.setItem(num, localNum)
        $(this).prev().html(localNum)
        $(this.parentNode).attr('data-num',localNum)
        _.chose();
    }
    numReduce(_) {
        let num = $(this.parentNode).attr('data-id')
        num = num.substr(0, 7)
        let localNum = localStorage.getItem(num);
        localNum--;
        if (localNum == 0) {
            return false;
        }
        localStorage.setItem(num, localNum)
        $(this).next().html(localNum)
        $(this.parentNode).attr('data-num',localNum)
        _.chose();
    }

    async renderer() {
        this.id = localStorage.getItem('id');
        if (this.id == null) {
            $('.cart-cont').html("")
            $('.chose-all').css({
                display: 'none'
            })
            return false;
        }
        this.id = this.id.split('?').slice(1);
        this.list = [];
        for (var i = 0; i < this.id.length; i++) {
            let result = await particularsData({
                id: this.id[i]
            })
            this.list.push(result)
        }
        let result = this.list
        
        let cartlistHtml = cartlistView({
            result
        })

        var _ = this;
        $('.cart-cont').html(cartlistHtml);

        $.each($('.cart-list'), function (index, item) {
            let num = $(item).attr('data-id')
            num = num.substr(0, 7)
            let localNum = localStorage.getItem(num);
            $('.num')[index].innerHTML = localNum
            $(item).attr('data-num',localNum)
        })
        
        $('h5').on('tap', function () {
            _.delete.bind(this)(_)
        });
        this.listBtn = $('.cart-list h1');
        this.listBtn.on('tap', function () {
            _.btnChange.bind(this)(_)
        });
        this.chose.bind(this)()
    }

    chose() {
        this.list = $('.cart-list')
        this.choseList = $('.cart-list[chose="true"]')
        let totalPrice = 0;
        $.each(this.choseList, function (index, item) {
            totalPrice += (parseInt($(item).attr('data-price')) * $(item).attr('data-num'))
        })
        $('.price').html(totalPrice)
    }

    choseAll(_) {

        if ($(this).attr('chose-all') == 'true') {
            $.each(_.listBtn, function (index, item) {
                $(item.parentNode).attr('chose', 'false')
                $(item).css({
                    background: 'white'
                })
            })
            $(this).css({
                background: 'white'
            })
            $(this).attr('chose-all', 'false')
        } else {
            $.each(_.listBtn, function (index, item) {
                $(item.parentNode).attr('chose', 'true')
                $(item).css({
                    background: 'pink'
                })
            })
            $(this).css({
                background: 'pink'
            })
            $(this).attr('chose-all', 'true')
        }
    }

    btnChange(_) {
        let str = $(this.parentNode).attr('chose');
        if (str == 'true') {
            $(this.parentNode).attr('chose', 'false')
            $(this).css({
                background: 'white'
            })
        } else {
            $(this.parentNode).attr('chose', 'true')
            $(this).css({
                background: 'pink'
            })
        }
        _.chose()
        $.each(_.list,function(index,item){
            if($(item).attr('chose') == 'false'){
                $('.chose-all').attr('chose-all','false')
                $('.chose-all').css({
                    background: 'white'
                })
                return false;
            }
            else{
                $('.chose-all').attr('chose-all','true')
                $('.chose-all').css({
                    background: 'pink'
                })
                
            }
        })
    
    }

    delete(_) {
        this.dataId = $(this).attr('data-id').substr(0, 7)
        localStorage.removeItem(this.dataId)
        let localId = localStorage.getItem('id').split('?').slice(1);
        var index = localId.indexOf(this.dataId);
        if (index > -1) {
            localId.splice(index, 1);
            localId = localId.join("?")
            localId = "?" + localId;
            if (localId == "?") {
                localStorage.removeItem("id");
            } else {
                localStorage.setItem("id", localId);
            }
            _.renderer();
        }
    }
    render() {
        let shopcartHtml = shopcartView({})
        document.querySelector('#root').innerHTML = shopcartHtml;
        $('.return').on('tap', function () {
            window.history.go(-1)
        })
        this.renderer()
        $('.change').on('click',function(){
            this.like()   
        }.bind(this))
    }

    async like() {
        var result = await postionModel({
            start: Math.floor(Math.random() * 11),
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
export default new Shopcart();