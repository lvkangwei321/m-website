const detailsView = require('../views/details.art');
const postionModel = require('../models/position');
const ListView = require('../views/list.art')
class Details {
    constructor() {}
    init() {
        this.render();
    }
    listRender(list) {
        let listHtml = ListView({
            list: list[0]
        })
        $('.category-cont').html(listHtml);
        $('.category-cont div').on('tap',this.bindTap);
    }
    bindTap() {
        var id = $(this).attr('data-id');
        id = id.substr(0, 7);
        location.hash = `particulars=${id}`;
      }
    async render() {
        $('header').css({
            display:'none'
        })
        let detailsHtml = detailsView({});
        $('main').html(detailsHtml);
        this.contLeft = $('.d-cont-left')
        this.contRight = $('.d-cont-right')
        this.li = $('.d-cont-left ul li')
        var _ = this;
        this.li.on('tap', function () {
            _.change.bind(this)(_);
        })
        if (location.hash = '#details') {
            var result = await postionModel({
                start: 1,
                pageCount: 6
            })
            let list = result.data.list;
            var listArray = [list]
            this.listRender(listArray)
        }
         new BScroll(this.contLeft.get(0), {
            probeType: 2
        })
          new BScroll(this.contRight.get(0), {
            probeType: 2
        })
        $('.return').on('tap',function(){
            window.history.go(-1)
        })
        // console.log($('header'))
       
    }
    async change(_) {
        this.start = $(this).attr('page')
        this.pageCount = 6;
        this.result = await postionModel({
            start: this.start,
            pageCount: this.pageCount
        })
        let list = this.result.data.list;
        var listArray = [list]
        _.listRender(listArray)
        $(this).siblings().removeClass('active');
        $(this).addClass('active')
    }
}
export default new Details();