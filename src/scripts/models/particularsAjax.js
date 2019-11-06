module.exports = function get({id}){
    return  $.ajax({
         url:`/api/goods/goods_details?goodsId=${id}`,
     })
 }