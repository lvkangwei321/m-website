import indexController from '../controllers/'
import mainController from '../controllers/main'
import detailsController from '../controllers/details'
import particularsController from '../controllers/particulars'
import shopcartController from '../controllers/shopcart'
import mineController from '../controllers/mine'
import searchController from '../controllers/search'
import regController from '../controllers/reg'
import loginController from '../controllers/login'
class Router{
    constructor(){
        this.bindEvent();
    }
    bindEvent(){
        window.addEventListener('load',this.pageLoad.bind(this));
        window.addEventListener('hashchange',this.hashChange.bind(this));
    }
    setActiceClass(hash){
        if(localStorage.getItem("id")){
            this.count = localStorage.getItem("id").split("?")
            $(".goods-count").html(this.count.length-1)
        }
        try{
            if($(`footer li`).length !== 0 ){
                $(`footer li[data-to=${hash}]`).addClass('active').siblings().removeClass('active')
            }
        }
      catch(e){

      }
    }
    hashChange(){
        let hash = location.hash.substr(1);
        this.render(hash);
        this.setActiceClass(hash)
    }
    pageLoad(){
        let hash = location.hash.substr(1)||'main';
        indexController.render();
        location.hash = hash;
        this.render(hash);
        this.setActiceClass(hash)
    }
    render(hash){
        hash != 'particulars'? indexController.render() : "";
        let controllers = {
            indexController,
            mainController,
            detailsController,
            particularsController,
            shopcartController,
            mineController,
            searchController,
            regController,
            loginController
        } 
        hash = hash.split('=')[0];
        controllers[hash + 'Controller'].init();
    }
}
new Router();