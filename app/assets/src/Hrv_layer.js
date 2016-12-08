/**
 * Created by PC_JS on 2016/11/18.
 */


var HrvLayer = cc.Layer.extend({
    bar_num:0,
    bar_x:[],
    bar_y:[],
    LP_bar:[],
    H_bar:0,
    fenduan: [20,35,55,80,100],//颜色分区

    ctor:function(p_W,p_H){
        this._super();
        this.bar_num = 3;
        this.H_bar=46;

        for (var i =0 ;i< this.bar_num; i++){
            this.LP_bar[i]= cc.LayerColor.create(cc.color(255, 100, 100, 100), 11, 1);
            this.LP_bar[i].x =36 + 18*i;
            this.LP_bar[i].y =24 ;
            this.addChild(this.LP_bar[i]);
        }
        return true;
    },

    Reflashhrvbar:function(value){
        // 更新进度条的长度
        for(var i = 0,index = 0;i<this.bar_num;i++){

            if(value[i]< this.fenduan[0]){
                index = Math.floor(5*value[i]/this.fenduan[0]);
            }else if(value[i]< this.fenduan[1]){
                index =6+ Math.floor(5*(value[i] - this.fenduan[0])/(this.fenduan[1]-this.fenduan[0]));
            }else if(value[i]< this.fenduan[2]){
                index =12+ Math.floor(5*(value[i] - this.fenduan[1])/(this.fenduan[2]-this.fenduan[1]));
            }
            else if(value[i]< this.fenduan[3]){
                index =18+ Math.floor(5*(value[i] - this.fenduan[2])/(this.fenduan[3]-this.fenduan[2]));
            }
            else {
                index =24;
            }
            var color  = myprogresscolor[index];
            this.LP_bar[i].setColor(color);
            this.LP_bar[i].changeHeight(Math.floor(value[i] * this.H_bar / 100) );
        }
    }

});
