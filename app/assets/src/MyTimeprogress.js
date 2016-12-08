/**
 * Created by PC_JS on 2016/11/17.
 */


var myprogresscolor =[cc.color(255,0,0,200), //红
    cc.color(255,45,0,255),
    cc.color(255,90,0,255),
    cc.color(255,132,0,255),
    cc.color(255,168,0,255),
    cc.color(255,182,0,255),
    cc.color(255,251,0,255), //橙
    cc.color(239,255,0,255),
    cc.color(230,255,0,255),
    cc.color(220,255,0,255),
    cc.color(214,255,0,255),
    cc.color(206,255,0,255),
    cc.color(189,255,0,255), //黄
    cc.color(170,255,0,255),
    cc.color(161,255,0,255),
    cc.color(150,255,0,255),
    cc.color(140,255,0,255),
    cc.color(130,255,0,255),
    cc.color(0,255,0,255),  //绿
    cc.color(0,239,57,255),
    cc.color(0,223,123,255),
    cc.color(0,207,181,255),
    cc.color(0,195,214,255),
    cc.color(0,190,231,255),
    cc.color(0,186,247,255) //蓝
];


var MyTimeprogressLayer = cc.Layer.extend({
    Mytimeprogress:null,
    _X0: 0, // 起点
    _Y0:0,
    _X1:0, //终点
    _Y1:0,
    floor_w:0.000, //统计进度
    fenduan:[],
    Pro_width:0,
    Fix_x:2,
    Fix_y:1,

    Tol_times:0,  //时间 长度ms
    Start_time:0, //开始进度条时间
    ctor:function(rul,width, height ,tol_ts, fenduan_5){
        this._super();
        this.Tol_times = tol_ts;
        this.fenduan =fenduan_5;
        this._X0 = this._X1 =this.Fix_x;
        this._Y0 = this.Fix_y;
        this._Y1 = height - this.Fix_y*2;
        this.Pro_width = width -this.Fix_x*2

        //盖片
        var progressbg = new cc.Sprite(rul);
        progressbg.attr({
            x: width/2,
            y: height/2
        });
        this.addChild(progressbg,6);

        //进度条
        this.Mytimeprogress = new cc.DrawNode();
        this.addChild(this.Mytimeprogress,1);
        this.Mytimeprogress.drawRect(
            cc.p(this._X0,this._Y0),
            cc.p(this._X1,this._Y1),
            cc.color(255,0, 0, 200),
            0.5,
            cc.color(255,0, 0, 200) // 颜色
        );
        return true;
    },

    DrawBycontent:function(current_times,value){
        if(this.Start_time == 0){
            this.Start_time = current_times;
        }
        if((current_times -this.Start_time)<= this.Tol_times ){
            var index =0;
            if(value< this.fenduan[0]){
                index = Math.floor(5*value/this.fenduan[0]);
            }else if(value< this.fenduan[1]){
                index =6+ Math.floor(5*(value - this.fenduan[0])/(this.fenduan[1]-this.fenduan[0]));
            }else if(value< this.fenduan[2]){
                index =12+ Math.floor(5*(value - this.fenduan[1])/(this.fenduan[2]-this.fenduan[1]));
            }
            else if(value< this.fenduan[3]){
                index =18+ Math.floor(5*(value - this.fenduan[2])/(this.fenduan[3]-this.fenduan[2]));
            }
            else {
                index =24;
            }
            var color  = myprogresscolor[index];

            var line_w = this.Fix_x+(current_times/this.Tol_times)*this.Pro_width;
            this._X1 = line_w;
            if(this._X1 >this._X0){
                this.Mytimeprogress.drawRect(
                    cc.p(this._X0,this._Y0),
                    cc.p(this._X1,this._Y1),
                    color,
                    0.5,
                    color
                );
                this._X0 = this._X1;
            }
        }
    }
});
