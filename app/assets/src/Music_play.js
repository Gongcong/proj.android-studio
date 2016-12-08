/**
 * Created by NJ on 2016.12.1.
 */
var Sound ={
    IF_HASBG_MUSIC:false,
    silence:false,
    /****
     ** playGameBgmusic  背景声音 ,只能播放一个
     * @param bgmusic_url   路径
     * @param loop  是否循环
     */
    playBgmusic:function(bgmusic_url,loop){
        if(!cc.audioEngine.isMusicPlaying())
        {
            cc.audioEngine.playMusic(bgmusic_url,loop);
            IF_HASBG_MUSIC =true;
        }
    },
    /****
     * 控制背景声
     */
    stopBgmusic:function(){
        if((!cc.audioEngine.isMusicPlaying())&&(IF_HASBG_MUSIC ==true)) {
            cc.audioEngine.stopMusic();
            IF_HASBG_MUSIC =false;
        }
    },
    pauseBgmusic:function(){
        if((!cc.audioEngine.isMusicPlaying())&&(IF_HASBG_MUSIC ==true)){
            cc.audioEngine.pauseMusic();
        }
    },
    resumeBgmusic:function(){
        if((!cc.audioEngine.isMusicPlaying())&&(IF_HASBG_MUSIC ==true)) {
            cc.audioEngine.resumeMusic();
        }
    },

    /*****
     * playEffectMusic 播放音效
     * @param url   路径
     * @param loop  是否循环
     * @returns  Effect_ID 音效ID
     */
    playEffectMusic:function(url,loop){
        var Effect_id = cc.audioEngine.playEffect(url,loop);
        return Effect_id;
    },
    /****
     * 控制单个音效
     */
    stopEffectMusic:function(Effect_ID){
        cc.audioEngine.stopEffect(Effect_ID);
    },
    pauseEffectMusic:function(Effect_ID){
        cc.audioEngine.pauseEffect(Effect_ID);
    },
    resumeEffectMusic:function(Effect_ID){
        cc.audioEngine.resumeEffect(Effect_ID);
    },


    /****
     * 控制所有的声音
     */
    stopALLMusic:function(){
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.stopMusic();
    },
    pauseALLMusic:function(){
        cc.audioEngine.pauseAllEffects();
        cc.audioEngine.pauseMusic();
    },

    resumeALLMusic:function(){
        cc.audioEngine.resumeAllEffects();
        cc.audioEngine.resumeMusic();
    },


    /************
     * 静音控制
     *
     */
    toggleOnOff:function(){
        if(Sound.silence){
            Sound.silenbce =false;
            cc.audioEngine.setEffectsVolume(1);
            cc.audioEngine.setMusicVolume(1);
        }else{
            Sound.silenbce =true;
            cc.audioEngine.setEffectsVolume(0);
            cc.audioEngine.setMusicVolume(0);
        }
    }

};





