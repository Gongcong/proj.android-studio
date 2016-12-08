/**
 * Created by Administrator on 2016/10/8.
 */

/*****************************
 * 统一定义
 *CMD命令集合,CMD 和JSON详细看文档
 * 和两个接口定义
 */
JS_CMD ={
    //发送的命令
    CMD_GETRESPATH:"COCOS_GET_RESOURCE_PATH", //获取APP的资源目录
    CMD_UNZIPFLIE:"COCOS_UNZIP_RESOURCE", //将游戏OBB包内指定文件解压到指定路径中
    CMD_SHOWDIALOG:"COCOS_SHOW_DIALOG",//显示/关闭异常对话框
    CMD_STARTENGINE:"COCOS_START_ENGINE", //开始游戏引擎
    CMD_PAUSEENGINE:"COCOS_RESUME_ENGINE",//暂停游戏引擎
    CMD_RESUMEENGINE:"COCOS_RESUME_ENGINE",//继续游戏引擎
    CMD_STOPENGINE:"COCOS_STOP_ENGINE",//停止游戏引擎
    CMD_GETCHECKSTATE:"COCOS_GET_CHECK_STATE",//获取游戏引擎状态
    CMD_READMINDVALUE:"COCOS_READ_MIND_VALUE",//读取引擎参数
    CMD_SETMINDTYPE:"COCOS_SET_MIND_TYPE",//设置引擎参数
    CMD_SETTRAININGSOCRE:"COCOS_SET_TRAINING_SCORE",//设置训练得分
    CMD_SETSENSORTABLE:"COCOS_GET_SENSOR_TABLE",//设置心理算法表
    CMD_GETSENSORTABLE:"COCOS_GET_SENSOR_TABLE",//获取心理算法表

    //接收到的命令
    BK_CG_CMD:"onError",  //传感器CMD
    BK_CMD_LICKCHANGE:"onLinkChange",//通信连接状态改变回调
    BK_CMD_BATTERY:"onBattery",// 电池电量改变回调
    BK_CMD_PSYCHOLOGYSTATE:"onPsychologyState",//心理状态回调
    BK_CMD_PSYCHOLOGYCHART:"onPsychologyChart",//心理实时曲线数据回调
    BK_CMD_HEARTRATEDATA:"onHeartRateData",//平均心率回调回调
    BK_CMD_STREESDATA:"onStressData",//压力指数回调回调
    BK_CMD_RELAXDATA:"onRelaxData",//放松指数回调回调
    BK_CMD_HRVDATA:"onHrvData",  //HRV心率变异指标 回调
    BK_CMD_HRVVALIDATION:"onHRVValidation", //HRV有效性 回调
    BK_CMD_REPROT:"onTrainingResult",  //训练报告 回调
    BK_CMD_GAMEEXIT: "onGameExit"//接收到强制游戏退出指令
};
//获取数据
function engineCallback(cmd,content){
    //传递到场景监听器
    cc.log("cmd : " + cmd  + ",content : " + content);
    cc.eventManager.dispatchCustomEvent(GAME_LISTEN_EVENT,{a:cmd,b:content});
};
//发送数据
function notifyJs(cmd,content){
    //调用JSB;
    var result =  jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "js2Native", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", cmd, content);
    return result;

};
var GAME_LISTEN_EVENT = "event_game_status";



/**********************************
 *
 * 游戏自己的定义
 */
var GET_RES_PATH ="";        //定义解压的路径
var MY_FOLDER = "/YOGA/";     //"/XXX" 自己的文件夹
var MY_unzip_res =["res/bg.mp3","res/inc.mp3","res/chimes.mp3"];

var psbx = [452,456,460,464,468,472,476,480,484,488,
    492,496,500,504,508,512,516,520,524,528,
    532,536,540,544,548,552,556,560,564,568,
    572,576,580,584,588,592,596,600,604,608,
    612,616,620,624,628,632,636,640,644,648,
    652,656,660,664,668,672,676,680,684,688,
    692,696,700,704,708,712,716,720,724,728,
    732,736,740,736,732,
    728,724,720,716,712,708,704,700,696,692,
    688,684,680,676,672,668,664,660,656,652,
    648,644,640,636,632,628,624,620,616,612,
    608,604,600,596,592,588,584,580,576,572,
    569,564,560,556,552,548,544,540,536,562,
    528,524,520,516,512,508,504,500,496,492,
    488,484,480,476,472,468,464,460,456,452,
    448,444,440,436,432,428,424,420,416,412,
    408,404,400,396,392,388,384,380,376,372,
    368,364,360,356,352,348,344,340,336,332,
    328,324,320,316,312,308,304,300,296,292,
    288,284,280,276,272,268,264,260,256,252,
    248,244,240,236,232,228,224,220,216,212,
    208,204,200,196,192,188,184,180,176,172,
    168,164,160,156,152,148,144,140,136,132,
    128,124,120,116,112,108,104,100,96,92,
    88,84,80,76,72,68,64,60,56,52];

var psby = [326,328,330,332,334,332,330,328,326,324,
    322,320,318,316,314,312,310,308,306,304,
    302,300,298,296,294,292,290,288,286,284,
    282,280,278,276,274,272,270,268,266,264,
    262,260,258,256,254,252,250,248,246,244,
    242,240,238,236,234,232,230,228,226,224,
    222,220,218,216,214,212,210,208,206,204,
    202,200,198,196,194,192,190,188,186,184,
    182,180,178,176,174,172,170,168,166,164,
    162,160,158,156,154,152,150,148,146,144,
    142,140,138,136,134,132,130,128,126,124,
    122,120,118,116,114,112,110,108,106,104,
    102,100,98,96,94,92,90,88,86,84,
    82,80,78,76,74,72,70,68,66,64,
    62,60,58,56,54,52,50,48,46,44,
    48,52,56,60,64,68,72,76,80,84,
    88,92,96,100,104,108,112,116,120,124,
    128,132,136,140,144,148,152,156,160,164,
    168,172,176,180,184,188,192,196,200,204,
    208,212,216,220,224,228,232,236,240,244,
    248,252,256,260,264,268,272,276,280,284,
    288,292,296,300,304,308,312,316,320,324,
    328,332,336,340,344,348,352,356,360,364,
    370,376,382,388,394,400,406,412,418,424,
    430,436,442,448,452];



var Game_PlayLayer = cc.Layer.extend({

    /*****精灵*/
    Sprite_ball:null,
    Sprite_heart:null,
    Sprite_heart_vl :null,
    Sprite_butter:null,
    Sprite_water:null,
    Sprite_bg:null,
    Sprite_back:null,
    animation_bf:null,
    animation_s:null,
    Sprite_timelable:null,
    Mytimeprogress:null,
    Mytimeprogress_bg:null,
    hrvprogress:null,
    Hrvbar_bg:null,
    Sprite_curvalue:null,

    /****** 常量*/
    game_toltime:60000*6,            //游戏设定总长度ms
    Ball_Y:[150,450],                //球的两个终点位置
    Ball_X : 476,

    /****** 变量*/
    g_status:0,
    MY_Event:null,
    begin_time:0,
    cur_time:0,
    pause_time:0,
    onespausetime:0,
    pass_time:0,
    cur_val:0,                 //游戏的值
    ballsize:100,
    changesizeflg:0,  //-1变小，0不变，1变大回来

    Show_particeSystem:true,
    moveoverflg:true,
    MY_bg_mic:null,
    MY_inc_mic:null,
    ctor:function(){
        var P_this=this;
        P_this._super();
        var c_size = cc.winSize;
        this.MY_Event = new cc.EventCustom(GAME_LISTEN_EVENT);

/*
        var ret_res = JSON.parse(notifyJs(JS_CMD.CMD_GETRESPATH,""));
        if((ret_res["result"] == 0)&&(ret_res["message"] == "OK")){
            var Body_str = JSON.parse(ret_res["body"]);
            GET_RES_PATH =Body_str["ResPath"] + MY_FOLDER;

            for(var i=0 ; i<MY_unzip_res.length; i++){
                var unzip_josn = "{\"srcPath\":\"" + MY_unzip_res[i] +"\"," + "\"destPath\":\"" + GET_RES_PATH +  MY_unzip_res[i] + "\"}";
                if(JSON.parse( notifyJs( JS_CMD.CMD_UNZIPFLIE, unzip_josn )["result"] )!=0 )
                { //失败
                    GET_RES_PATH ="";
                    return false;
                }
            }
        }else{
            return false;
        }
        */

        if(GET_RES_PATH !=""){

            this.MY_bg_mic = MY_unzip_res[0];
            this.MY_inc_mic =MY_unzip_res[1];
        }

        //进度条
        P_this.Mytimeprogress_bg = new cc.Sprite(res.my_bar);
        var Mypg_W = P_this.Mytimeprogress_bg.getContentSize().width;
        var Mypg_H = P_this.Mytimeprogress_bg.getContentSize().height;
        P_this.Mytimeprogress_bg.attr({
            x: 16 + Mypg_W/2,
            y: 8 + Mypg_H/2
        });
        P_this.addChild(P_this.Mytimeprogress_bg,9);
        var fd_arry = [20,35,55,80,100];//颜色分区
        P_this.Mytimeprogress = new MyTimeprogressLayer(res.my_bar,Mypg_W,Mypg_H,this.game_toltime, fd_arry);
        P_this.Mytimeprogress_bg.addChild( P_this.Mytimeprogress );
        //显示当前值
        P_this.Sprite_curvalue =  new cc.LabelTTF("0", "Arial", 16);
        P_this.Sprite_curvalue.x = 16+ Mypg_W +20 ;
        P_this.Sprite_curvalue.y =  8 + Mypg_H/2  ;
        P_this.addChild(P_this.Sprite_curvalue, 9);


        P_this.Sprite_timelable =  new cc.LabelTTF("00:00:00", "Arial", 16);
        P_this.Sprite_timelable.x = 60 ;
        P_this.Sprite_timelable.y =  c_size.height - 200 ;
        P_this.addChild(P_this.Sprite_timelable, 8);

        //HRV
        P_this.Hrvbar_bg = new cc.Sprite(res.hrv_bar);
        P_this.Hrvbar_bg.attr({
            x: c_size.width -60,
            y: c_size.height/2 +180
        });
        P_this.addChild(P_this.Hrvbar_bg,8);
        P_this.hrvprogress = new HrvLayer(P_this.Hrvbar_bg.getContentSize().width,P_this.Hrvbar_bg.getContentSize().height);
        P_this.Hrvbar_bg.addChild( P_this.hrvprogress );




        //加载球
        P_this.Sprite_ball = new cc.Sprite("res/blueball.png");
        P_this.Sprite_ball.x = this.Ball_X;
        P_this.Sprite_ball.y = this.Ball_Y[1];
        P_this.addChild(P_this.Sprite_ball,6);

        //加载心跳
        P_this.Sprite_heart = new cc.Sprite("res/yoga_heart.png");
        var heart_W = P_this.Sprite_heart.getContentSize().width;
        var heart_H = P_this.Sprite_heart.getContentSize().height;
        P_this.Sprite_heart.attr({
            x: 620 +heart_W/2,
            y: 4 + heart_H/2
        });
        P_this.addChild(P_this.Sprite_heart,3);
        P_this.Sprite_heart_vl = new cc.LabelTTF("", "Arial", 16);
        P_this.Sprite_heart_vl.x = heart_W/2;
        P_this.Sprite_heart_vl.y = heart_H/2 ;
        P_this.Sprite_heart.addChild(P_this.Sprite_heart_vl);



        if(IF_SHOW_BACKBUTTON == true){
            P_this.Sprite_back = new cc.Sprite("res/back.png");
            P_this.Sprite_back.x = c_size.width  - P_this.Sprite_back.getContentSize().width/2;
            P_this.Sprite_back.y = P_this.Sprite_back.getContentSize().height/2;;
            P_this.addChild(P_this.Sprite_back,2);
        }



        //蝴蝶
        var spriteFrameCache = cc.spriteFrameCache;
        spriteFrameCache.addSpriteFrames(res.butterfly_plist,res.butterfly_png);
        P_this.Sprite_butter = new cc.Sprite("#butterfly01.png");
        P_this.Sprite_butter.x = 20 + P_this.Sprite_butter.getContentSize().width/2;
        P_this.Sprite_butter.y =c_size.height-12 -  P_this.Sprite_butter.getContentSize().height/2;;
        P_this.animation_bf = new cc.Animation();
        var i =1, tmp_fl =null;
        for( i =1; i<=62;i++){
             tmp_fl = "butterfly" +(i<10?('0'+i):i)+ ".png";
            P_this.animation_bf.addSpriteFrame( spriteFrameCache.getSpriteFrame(tmp_fl));
        }
        for( i = 6; i>0;i--){
             tmp_fl = "butterfly62.png";
            P_this.animation_bf.addSpriteFrame(spriteFrameCache.getSpriteFrame(tmp_fl));
        }
        for( i =62; i>0;i--){
             tmp_fl = "butterfly" +(i<10?('0'+i):i)+ ".png";
            P_this.animation_bf.addSpriteFrame( spriteFrameCache.getSpriteFrame(tmp_fl));
        }
        P_this.animation_bf.setDelayPerUnit(1/12);
        P_this.addChild(P_this.Sprite_butter,2);


        //水
        P_this.Sprite_water = new cc.Sprite("res/water01.png");
        P_this.Sprite_water.x = c_size.width/2;
        P_this.Sprite_water.y = c_size.height-368;
        var res_file = null, j =0;
        this.animation_s = new cc.Animation();
        for( j =1; j<=38;j++){
            res_file = "res/water" +(j<10?('0'+j):j)+ ".png";
            this.animation_s.addSpriteFrameWithFile(res_file);
        }
        this.animation_s.setDelayPerUnit(1/5);
        P_this.addChild(P_this.Sprite_water,2);


        //加载背景
        P_this.Sprite_bg = new cc.Sprite(res.Bg_png);
        P_this.Sprite_bg.attr({
            x: c_size.width / 2,
            y: c_size.height / 2
        });
        P_this.addChild(P_this.Sprite_bg, 0);

        /*
         自定义监听,EVENT={CMD ,JOSN_data};
         */
        var game_listener = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName:GAME_LISTEN_EVENT,
            callback: function (event) {
                var CMD_BK = event.getUserData().a;
                var jsonData = JSON.parse( event.getUserData().b);

                switch (CMD_BK){
                    case JS_CMD.BK_CG_CMD:
                        switch ( jsonData["errorNo"])
                        {
                            case -1000: //传感器连接成功

                                P_this.g_status = 1;
                                P_this.onespausetime = Date.now()- P_this.onespausetime;
                                P_this.pause_time += P_this.onespausetime;
                                P_this.onespausetime = 0;

                                notifyJs(JS_CMD.CMD_SHOWDIALOG,"{\"show\":0,\"state\":\"SensorError\"}");

                                break;
                            case -1001: //传感器断开
                                P_this.g_status = 0;
                                P_this.onespausetime = Date.now();
                                notifyJs(JS_CMD.CMD_SHOWDIALOG, "{\"show\":1,\"state\":\"SensorError\"}");
                                break;
                            case -1002: //传感器初始化
                                P_this.g_status = 0;
                                notifyJs(JS_CMD.CMD_SHOWDIALOG, "{\"show\":1,\"state\":\"SensorInit\"}");
                                break;
                            default :
                                break;
                        }
                        break;
                    case JS_CMD.BK_CMD_LICKCHANGE:
                        break;
                    case JS_CMD.BK_CMD_PSYCHOLOGYSTATE: //心理状态回调
                        //只用荷花data1  data1*100/12)
                        var value = Math.floor(Math.abs(jsonData["data1"])*100/12);
                        //YOGA当前值,其中50 和除数3000为等级零
                        //var value = Math.floor((50+jsonData["data1"])*jsonData["data2"]/3000);
                        P_this.ball_moveanimation(value);
                        break;
                    case JS_CMD.BK_CMD_PSYCHOLOGYCHART: //心理实时曲线数据回调
                        break;
                    case JS_CMD.BK_CMD_HEARTRATEDATA://平均心率回调回调
                        //心率
                        P_this.Sprite_heart_vl.setString(Math.floor(jsonData["hr"]/100).toString());
                        break;
                    case JS_CMD.BK_CMD_STREESDATA:
                        //压力指数回调回调  Json对象 {  "time": 1000 ,"stress": 890  //压力指数,放大了100倍  ,"value": 0   //备用 }
                        break;
                    case JS_CMD.BK_CMD_HRVDATA:
                        // Json对象 {  "time": 1000 ,"hrv_power": { “tp”: 4994,“vlf”: 48959 ,“lf”: 29 ,“hf”:  849} }
                        var hrv_power = JSON.parse( jsonData["hrv_power"]);
                        var tmp_value =[0,0,0];
                        tmp_value[0] =  Math.floor(hrv_power["vlf"]*100/hrv_power["tp"]);
                        tmp_value[1] =  Math.floor(hrv_power["lf"]*100/hrv_power["tp"]);
                        tmp_value[2] =  Math.floor(hrv_power["hf"]*100/hrv_power["tp"]);
                        P_this.hrvprogress.Reflashhrvbar(tmp_value);
                        break;
                    case JS_CMD.BK_CMD_GAMEEXIT: //接收到强制游戏退出指令
                        P_this.gameovercallback();
                default :break;
                }
            }
        });
        cc.eventManager.addListener(game_listener,-1);
        return true;
    },


    ball_moveanimation:function(var_value){
        //根据当前值计算球的动作
        if((var_value >=0) && (var_value<=100) && (this.g_status==1))
        {
                // 当前值显示
                this.Sprite_curvalue.setString(Math.floor(var_value).toString());
                //进度条显示
                var cur_time = Math.floor( Date.now() -  this.pause_time  - this.begin_time);
                this.Mytimeprogress.DrawBycontent(cur_time,var_value);

                var  str = "{\"score\":"+var_value +", \"finalResult\":"+ "-1}";

                notifyJs(JS_CMD.CMD_SETTRAININGSOCRE,str);

                if((var_value == 100 ) &&( this.cur_val==100)){
                    this.changesizeflg =-1;
                }else if((var_value<=80 )&&(this.ballsize<100)){
                    this.changesizeflg =1;
                }else if((var_value <92)&&( this.changesizeflg ==-1))
                {
                    this.changesizeflg =0;
                }

                if(this.changesizeflg== -1)
                {//球不移动了
                        this.ballsize -=8;
                        if(this.ballsize>20)
                        {
                            var c_g  = this.ballsize/100;
                            var  action = cc.scaleTo(2, c_g, c_g);//cc.spawn(cc.rotateBy(0.5, 360, 360), cc.scaleTo(0.5, c_g, c_g));
                            action.duration =1;
                            this.Sprite_ball.runAction(action);
                        }else
                        {

                            //cc.eventManager.removeAllListeners();
                            //gamefinilsh
                            if(this.Show_particeSystem == true){
                                this.Show_particeSystem =false;

                                var sys =new cc.ParticleSystem(res.particle_pl);
                                sys.x =0;
                                sys.y =0;
                                sys.duration =-1 ;
                                this.Sprite_ball.addChild(sys,1);

                                var action = cc.moveTo(0.5, cc.p(psbx[15], psby[15]));
                                this.Sprite_ball.runAction(action);
/*
                                var finish_callback = cc.callFunc(this.gameovercallback, this ,"over");
                                var moveover_callback =  cc.callFunc(this.moveovercallback, this ,true);

                                var count =  psbx.length;
                                for (var i = 0; i < count;)
                                {
                                    if(this.moveoverflg == true)
                                    {
                                        this.moveoverflg =false;
                                        var action =cc.sequence(cc.moveTo(0.5, cc.p(psbx[i], psby[i])), moveover_callback);
                                        if (i == (count-1)) {
                                            action = cc.sequence(cc.moveTo(0.5, cc.p(psbx[i], psby[i])), finish_callback);
                                        }
                                        this.Sprite_ball.runAction(action);
                                        i++;
                                    }
                                }*/
                            }


                        }
                }else{
                        //球移动了
                        var action =null;
                        var new_y =  this.Ball_Y[1] - Math.floor((this.Ball_Y[1]- this.Ball_Y[0])* var_value/100);

                        if(this.changesizeflg == 1  &&  this.ballsize<100 )
                        {//变回原来的样子
                                var pas_ballsize = this.ballsize;
                                var c_g = 0;
                                this.ballsize +=8;
                                if(this.ballsize>100)
                                {
                                    this.ballsize =100;
                                    c_g =  1/(100-pas_ballsize);
                                }else{
                                    c_g =  1/(100-pas_ballsize) - 1/(100-this.ballsize);
                                }
                                action = cc.spawn( cc.scaleTo(1, c_g, c_g),  cc.moveTo(1, cc.p(this.Ball_X, new_y)));
                        }
                        else{
                                action =  cc.moveTo(1, cc.p(this.Ball_X, new_y));
                        }
                        action.duration =1;
                        this.Sprite_ball.runAction(action);
                        this.cur_val =var_value;
                }
        }
    },

    moveovercallback:function(nodeExecutingAction,data) {
        this.moveoverflg =true;
    },

    onEnter:function(){
        var p_this =this;
        p_this._super();

        var action_b = cc.animate(this.animation_bf);
        action_b.repeatForever();
        p_this.Sprite_butter.runAction(action_b);

        var action_w = cc.animate(this.animation_s);
        action_w.repeatForever();
        p_this.Sprite_water.runAction(action_w);




        notifyJs(JS_CMD.CMD_SETMINDTYPE,"{\"mindType\":8}");
        notifyJs(JS_CMD.CMD_SETMINDTYPE,"{\"mindType\":8,\"value\":0}");

        notifyJs(JS_CMD.CMD_STARTENGINE,"");

        this.scheduleUpdate();
        this.begin_time = Date.now();

        if(GET_RES_PATH != "")
        {
            Sound.playBgmusic(GET_RES_PATH + this.MY_bg_mic , true);
            Sound.playEffectMusic(GET_RES_PATH + this.MY_inc_mic , false);
        }



        var TsChessclass = new chess.MyChessClass();
        var xia = 0;
        var x = 0;
        var y = 0;

        var ret = TsChessclass.OnGameStart(xia);
        cc.log("chess.MyChessClass.OnGameStart(0)  return ===" , ret);

        var ssss = TsChessclass.get_chess_return();
        cc.log(" TsChessclass.get_chess_return() return ===" , ssss);


    },

    gameovercallback:function(nodeExecutingAction,data){
        this.g_status=0;
        this.unscheduleUpdate();
        notifyJs(JS_CMD.CMD_STOPENGINE,"{\"flag\": 1}"); //停止游戏引擎
        Sound.stopALLMusic();
        cc.removeAllActions();
        cc.spriteFrameCache.removeSpriteFrames();
        cc.eventManager.removeAllListeners();
        cc.director.end();
    },


    update:function(){
        if(this.g_status == 1)
        {
            var cur_time = Math.floor( Date.now() -  this.pause_time  - this.begin_time);
            if((cur_time  -this.pass_time)>=1000)
            {//一秒钟

                //传感器没有数据过来的时间段,进度条颜色还得填充
                this.Mytimeprogress.DrawBycontent(cur_time,this.cur_val);

                var var_str ="00:00:00";
                var hour =  Math.floor((cur_time/1000)/3600);
                var min = Math.floor(cur_time/60000);
                var sec = Math.floor(cur_time/1000)%60;
                var_str =( (hour<10)?('0'+hour):hour)  + ":"+ ((min<10)?('0'+min):min) + ":"+ ((sec<10)?('0'+sec):sec ) ;
                this.Sprite_timelable.setString(var_str);
                this.pass_time = cur_time;
            }
            if(cur_time >= this.game_toltime )
            {
                //时间到了 ,结束吧
                this.gameovercallback();
            }
        }
    },

    onExit:function(){
        this._super();
        this.pause();

        //this.gameovercallback(this,null);
    },

    onResume:function()
    {
        this._super();
        this.resume();
    }
});



var Game_Scene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new Game_PlayLayer();
        this.addChild(layer);
    }
});

var GamePlayScene = new Game_Scene();


