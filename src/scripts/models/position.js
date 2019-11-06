module.exports = function get({start=0,pageCount=2}){
   return  $.ajax({
        url:`/api/goods/goodsAll?start=${start}&pageCount=${pageCount}`,
    })
}