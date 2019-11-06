const layoutView = require('../views/layout.art')
class Index{
    constructor() {
      }
      render() {
        const html = layoutView({}) 
        document.querySelector('#root').innerHTML = html;
        $("footer li").on('tap',this.bindTap)
      }
      bindTap(){
        location.hash = $(this).attr('data-to')
      }
}
export default new Index();