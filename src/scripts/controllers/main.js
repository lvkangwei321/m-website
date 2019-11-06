const mainView = require('../views/main.art');
const postionModel = require('../models/position')
const positionListView = require('../views/list.art')
class Main {
  constructor() {}
  init() {
    this.render();
    this.list = [];
    this.start = 1
    this.totalCount = 0
    this.pageCount = 20
  }

  renderer(list) {
    let positionListHtml = positionListView({
      list
    })
    $('.list').html(positionListHtml)
  }

  
  bindTap() {
    var id = $(this).attr('data-id')
    id = id.substr(0, 7);
    location.hash = `particulars=${id}`;
  }

  search(){
    location.hash = 'search';
  }
  async render() {
    let _ = this;
    this.result = await postionModel({
      start: this.start,
      pageCount: this.pageCount
    })
    this.totalCount = this.result.data.total;
    
    this.$main = $('main')
    this.html = mainView({});
    this.$main.html(this.html)
    let list = this.list = this.result.data.list;
    this.renderer(list)  
    this.$imgFoot = $('.foot img')
    this.$imgHead = $('.head img')
    this.headHeight = $('.head').height();
    $('.title').on('tap',this.search);
    new Swiper('.swiper-container', {
      autoplay: true,
      pagination: {
        el: '.swiper-pagination',
      },
      loop: true
    });
    let bScroll = new BScroll(this.$main.get(0), {
      probeType: 2
    })

    bScroll.scrollTo(0, -this.headHeight)
    bScroll.on('scrollEnd', async function () {
      if (this.y <= 0 && this.y >= -_.headHeight) {
        bScroll.scrollTo(0, -_.headHeight)
        _.$imgHead.removeClass('up')
        _.$imgHead.attr("src", "/assets/images/arrow.png")
        this.result = await postionModel({
          start: this.start,
          pageCount: this.pageCount
        })
        let list = _.list = this.result.data.list;
        _.renderer(list)  
      }

      if (this.y <= this.maxScrollY + _.headHeight && Math.ceil(_.totalCount / _.pageCount) >= _.start) {
        _.start++;
        let result = await postionModel({
          start: _.start,
          pageCount: _.pageCount
        })
        let list = result.data.list;
        _.list = [..._.list, ...list];
        _.renderer(_.list);
        _.$imgFoot.removeClass('down')
        _.$imgFoot.attr("src", "/assets/images/arrow.png")
      }
      if (Math.ceil(_.totalCount / _.pageCount) <= _.start) {
        _.$imgFoot.removeClass('down')
        _.$imgFoot.attr("src", "/assets/images/arrow.png")
        $('.foot b').html("没有更多了")
      }
      this.refresh();
      $('.list div').on('tap', _.bindTap);
    })


    bScroll.on('scroll', function () {
      if (this.y > 0) {
        _.$imgHead.addClass('up')
      }
      if (this.y <= this.maxScrollY + _.headHeight) {
        _.$imgFoot.addClass('down')
      }
    })


    bScroll.on('touchEnd', function () {
      if (this.y > 0) {
        _.$imgHead.attr("src", "/assets/images/ajax-loader.gif")
      }
      if (this.y <= this.maxScrollY + _.headHeight) {
        _.$imgFoot.attr("src", "/assets/images/ajax-loader.gif")
      }
    })
  }
}
export default new Main();