module.exports = function get({keyword}){
    return  $.ajax({
        url:`/api/goods/goods_search?keywords=${keyword}`,
     })
 }