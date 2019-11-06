const searchView = require('../views/search.art');
const searchData = require('../models/searchAjax');
const searchList = require('../views/search-list.art')
const searchId = require('../models/searchidAjax')
const searchCont = require('../models/particularsAjax')
const contList = require('../views/searchcont-list.art')
const myContList = require('../views/my-search.art')
const _ = require('lodash')
class Search {
    constructor() {}
    init() {
        this.render()
    }
    render() {
        const searchHtml = searchView({})
        $('main').html(searchHtml)
        this.text = $('.search-text');
        this.bindEvent()
    }
    bindEvent() {
        $('header').css({
            display: 'none'
        })
        $('.s-return').on('tap', function () {
            sessionStorage.removeItem('text')
            window.history.go(-1)
        })
         $('.search-text').val(sessionStorage.getItem('text'))
         if($('.search-text').val()){
            this.seachGoods.bind(this)()
         }
        this.text.on('input', _.debounce(this.change.bind(this), 500));
        $('.s-button').on('tap', this.seachGoods.bind(this))
        let that = this;
        $('.hot-search li').on('tap',function(){
            that.hotSearch.bind(this)(that)
        })
    }
    hotSearch(that){
        $('.search-text').val($(this).text());
        that.seachGoods();
    }
    async change() {
        let that = this;
        let val = $('.search-text').val()
        let result = await searchData({
            keyword: val
        })
        let res = result.data.message; 
        let searchListHtml = searchList({
            list: res
        })
        $('.search-res').html(searchListHtml)
        $('.s-list').on('tap', function () {
            $('.search-text').val($(this).text());
            that.seachGoods();
        })
    }
    async seachGoods() {
        let val = $('.search-text').val();
        let idResult = await searchId({
            keyword: val
        })
        idResult = idResult.data.message;
        var resultArray = [];
        for (var i = 0; i < idResult.length; i++) {
            var searchResult = await searchCont({
                id: idResult[i].goodsId
            })
            if(searchResult.data.message.length === 0){
                 let myRes =   await  $.ajax({
                        type:"post",
                        url:`/api/goods/goods_findOne`,
                        data:{
                            "id":idResult[i]._id
                        }
                    })
                    resultArray.push(myRes.data.message)
            }
            else{
                resultArray.push(searchResult.data.message[0].sku_info[0])
            }
        }
        if(resultArray[0]._id){
            let contListHtml = myContList({
                list : resultArray
            })
            $('.search-res').html(contListHtml)
            $('.list div').on('tap',this.bindTap);
        }
        else{
            let contListHtml = contList({
                list : resultArray
            })
            $('.search-res').html(contListHtml)
            $('.list div').on('tap',this.bindTap);
        }
   
    }
    bindTap() {
     sessionStorage.setItem('text',$('.search-text').val())
        var id = $(this).attr('data-id');
        id = id.substr(0, 7);
        console.log(id);
        location.hash = `particulars=${id}`;
      }
}
export default new Search();