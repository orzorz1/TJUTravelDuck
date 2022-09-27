<template>
    <div ref="demo" class="demo">
        <div id="demoImg" >
            <img class="map" ref="map" src="../assets/map/old.png">
            <img class="jiCaiFeng" src="../assets/map/old/feng.png" :style="{'opacity': getedCard[0] ? '':'0' }" @click="showCard(0)">
            <img class="ting" src="../assets/map/old/ting.png" :style="{'opacity': getedCard[1] ? '':'0' }" @click="showCard(1)">
            <img class="friendshipLake" src="../assets/map/old/friendshipLake.png"  :style="{'opacity': getedCard[2] ? '':'0' }" @click="showCard(2)">
            <img class="dedicationLake" src="../assets/map/old/dedicationLake.png"  :style="{'opacity': getedCard[2] ? '':'0' }" @click="showCard(2)">
            <img class="loveNightLake" src="../assets/map/old/loveNightLake.png" :style="{'opacity': getedCard[2] ? '':'0' }" @click="showCard(2)">
            <img class="youthLake" src="../assets/map/old/youthLake.png" :style="{'opacity': getedCard[2] ? '':'0' }" @click="showCard(2)">
            <img class="daHuo" src="../assets/map/old/daHuo.png"  :style="{'opacity': getedCard[3] ? '':'0' }" @click="showCard(3)">
            <img class="nine" src="../assets/map/old/nine.png"  :style="{'opacity': getedCard[4] ? '':'0' }" @click="showCard(4)">
            <img class="twt" src="../assets/map/old/twt.png">
            <img class="duck" :src="duckState===0 ? require('../assets/map/duck_awaiting.png') : require('../assets/map/duck_now.png')" :style="campu===0 ? 'display:none;' : '' " ref="duck">
        </div>
        <transition  name="fade" mode="out-in">
            <div class="Cards" v-for="(card,index) in oldCards" v-if="oldCards[index].show">
                <img class="card" :src="card.url" />
                <img class="getPosition" @click="getPosition(index)" v-if="!getedCard[index]" src="../assets/icon/clockIn.png"/>
            </div>
        </transition>
        <div class="closeMask" v-for="(card,index) in oldCards" v-if="oldCards[index].show" @click="closeCard(index)"></div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Hammer from 'hammerjs'
    import { setTimeout } from 'timers'
    import { mapState, mapGetters } from 'vuex';


    export default {
        name: 'MapNew',
        components: {
        },
        data() {
            return {
                //打卡
                // getedCard:[1,1,1,1,1],
                getedCard:[0,0,0,0,0],
                //缩放、移动使用
                config: {},
                id: null,
                mc: null,
                timer: false,
                translateX: -300,
                translateY: 0,
                scale: 0.45,
                firstTouch: true,
                relateX: -300,
                relateY: 0,
                oldX: -300,
                oldY: 0,
                oldScale: 0.45,
                first:0,
                duckState:0, //鸭子状态: 0为待出发，1为已出发
                oldCards: [
                    { "name": "冯骥才艺术研究院", "show": false, "url": require("../assets/cards/jicaiFeng.png") },
                    { "name": "北洋大学堂纪念亭", "show": false, "url": require("../assets/cards/ting.png") },
                    { "name": "四大湖", "show": false, "url": require("../assets/cards/4lake.png") },
                    { "name": "大学生活动中心", "show": false, "url": require("../assets/cards/dahuo.png") },
                    { "name": "第九教学楼", "show": false, "url": require("../assets/cards/9.png") },],
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.picInit()
            })
        },
        beforeMount(){
            let that = this
            if(this.campu===0){
                for(let k=0; k<this.getedCard.length; k++){
                    this.getedCard[k] = 1
                }
            }else{
                //获取已获得卡片
                var xhr = new XMLHttpRequest();
                xhr.open('GET',that.apiUrl+'/api/v1/card/user?token='+that.token);
                xhr.send(null);
                xhr.onloadend = function(e){
                    that.$store.commit('ableBtn')
                    if(e.target.status===200){
                        var json = JSON.parse(e.target.response)
                        for(let k=0;k<json.result.length;k++){
                            if(json.result[k] && json.result[k].id===11){
                                that.getedCard[0]=1
                            }else if(json.result[k] && json.result[k].id===12){
                                that.getedCard[1]=1
                            }else if(json.result[k] && json.result[k].id===13){
                                that.getedCard[2]=1
                            }else if(json.result[k] && json.result[k].id===14){
                                that.getedCard[3]=1
                            }else if(json.result[k] && json.result[k].id===15){
                                that.getedCard[4]=1
                            }
                        }
                        that.oldCards[0].show = true
                        that.oldCards[0].show = false
                    }
                }
            }
        },
        created(){
            setTimeout(()=>{
                const position = {
                    translateX: -300,
                    translateY: 0,
                    scale: 0.45
                }
                this.selfPosition(position)
            },10)

        },
        computed: {
			...mapState(['disableButton','disableBtn','ableBtn','campu','token','apiUrl']),
		},
        methods: {
            showCard(index){
                if(!this.disableButton){
                    this.oldCards[index].show = true
                    this.$store.commit("disableBtn")
                }
            },
            closeCard(index) {
                this.oldCards[index].show = false
                this.$store.commit("ableBtn")
            },
            picInit() {
                this.id = document.getElementById('demoImg')
                this.mc = new Hammer(this.id)
                this.relateX = (document.body.clientWidth - this.id.offsetWidth) / 2
                this.relateY = (document.body.clientHeight - this.id.offsetHeight) / 2

                this.mc.add(new Hammer.Pan({
                    direction: Hammer.DIRECTION_ALL,
                    threshold: 0,
                    pointers: 0
                }))
                this.mc.add(new Hammer.Pinch({
                    threshold: 0
                })).recognizeWith(this.mc.get('pan'))

                this.mc.on('hammer.input', this.isFinal)
                this.mc.on('panstart panmove', this.onPan)
                this.mc.on('pinchstart pinchmove', this.onPinch)

                this.setPosition()
            },
            isFinal(ev) {
                if (ev.isFinal) {
                    this.oldX = this.translateX
                    this.oldY = this.translateY
                    this.oldScale = this.scale
                }
            },
            //鸭子移动
            duckMove(i){
                setTimeout(()=>{
                    if(i===0){//冯骥才
                        this.$refs.duck.style.left = '1120px'
                        this.$refs.duck.style.top = '660px'
                    }
                    if(i===1){//北洋纪念亭
                        this.$refs.duck.style.left = '1350px'
                        this.$refs.duck.style.top = '1360px'
                    }
                    if(i===2){//四大湖
                        this.$refs.duck.style.left = '400px'
                        this.$refs.duck.style.top = '1320px'
                    }
                    if(i===3){//大活
                        this.$refs.duck.style.left = '300px'
                        this.$refs.duck.style.top = '450px'
                    }
                    if(i===4){//九教
                        this.$refs.duck.style.left = '1050px'
                        this.$refs.duck.style.top = '1060px'
                    }
                },200)
            },
            // 初始化图片地位及缩放
            setPosition() {
                this.selfPosition({
                    translateX: this.relateX,
                    translateY: this.relateY,
                    scale: this.scale
                })
            },
            // 单点触发 - 利落
            onPan(ev) {
                if(!this.disableButton){

                    this.translateX = this.oldX + ev.deltaX
                    this.translateY = this.oldY + ev.deltaY


                    if (this.translateX+document.documentElement.clientWidth*(1-this.scale)/2 > 0){
                        this.translateX = -document.documentElement.clientWidth*(1-this.scale)/2
                    }
                    //如果偏移Y值大于0：表示视图已经滑到最顶部，重置为0
                    if (this.translateY > 0){
                        this.translateY = 0
                    }
                    //如果偏移X值小于（屏幕宽度-元素宽度）：表示视图已经滑到最左侧，重置为0
                    if (this.translateX +document.documentElement.clientWidth*(1-this.scale)/2 + this.$refs.map.width*this.scale < document.documentElement.clientWidth){
                        this.translateX =  document.documentElement.clientWidth - this.$refs.map.width*this.scale - document.documentElement.clientWidth*(1-this.scale)/2
                    }
                    //如果偏移Y值大于（屏幕高度-元素高度）：表示视图已经滑到最左侧，重置为0
                    if (this.translateY+this.$refs.map.height*this.scale < document.documentElement.clientHeight){
                        this.translateY = document.documentElement.clientHeight - this.$refs.map.height*this.scale
                    }
                    const position = {
                        translateX: this.translateX,
                        translateY: this.translateY,
                        scale: this.scale
                    }
                    // console.log(this.translateX+" "+this.translateY)
                    this.selfPosition(position)
                    this.firstTouch = false
                }
            },
            // 多点触发 - 缩放
            onPinch(ev) {
                if(!this.disableButton){
                    this.scale = this.oldScale * ev.scale
                    if (this.firstTouch) {
                        this.oldX = this.relateX
                        this.oldY = this.relateY
                    }
                    if(this.scale<0.41){this.scale=0.41}
                    if(this.scale>1.5){this.scale=1.5}
                    this.translateX = ev.center.x - (ev.center.x - this.translateX) / this.oldScale * this.scale
                    this.translateY = ev.center.y - (ev.center.y - this.translateY) / this.oldScale * this.scale

                    if (this.translateX+document.documentElement.clientWidth*(1-this.scale)/2 > 0){
                        this.translateX = -document.documentElement.clientWidth*(1-this.scale)/2
                    }
                    //如果偏移Y值大于0：表示视图已经滑到最顶部，重置为0
                    if (this.translateY > 0){
                        this.translateY = 0
                    }
                    //如果偏移X值小于（屏幕宽度-元素宽度）：表示视图已经滑到最左侧，重置为0
                    if (this.translateX +document.documentElement.clientWidth*(1-this.scale)/2 + this.$refs.map.width*this.scale < document.documentElement.clientWidth){
                        this.translateX =  document.documentElement.clientWidth - this.$refs.map.width*this.scale - document.documentElement.clientWidth*(1-this.scale)/2
                    }
                    //如果偏移Y值大于（屏幕高度-元素高度）：表示视图已经滑到最左侧，重置为0
                    if (this.translateY+this.$refs.map.height*this.scale < document.documentElement.clientHeight){
                        this.translateY = document.documentElement.clientHeight - this.$refs.map.height*this.scale
                    }
                    this.selfPosition({
                        translateX: this.translateX,
                        translateY: this.translateY,
                        scale: this.scale
                    })
                    // alert(ev.center.x+" "+ev.center.y)
                    // x = ev.center.x * (this.oldSca-this.scale)
                    // y = ev.center.y * (1-this.scale)
                    // (this.canvasTouchRule.double_T_from[0]-this.canvasTouchRule.center[0]-this.transX) * (oldScale/this.scaleReal - 1) + this.transX
                    
                    // //设置transform
                    // this.selfPosition(this.position)
                }
            },
            selfPosition(pos) {
                return this.picAnimate()(() => this.tempPos(pos))
            },
            tempPos(pos) {
                let style = [
                    `translate3d(${pos.translateX}px, ${pos.translateY}px, 0)`,
                    `scale(${pos.scale}, ${pos.scale})`
                    // `scale(${pos.scale > 1.2 ? 1.2 : pos.scale}, ${pos.scale > 1.2 ? 1.2 : pos.scale})`
                ]
                style = style.join(' ')
                this.id.style.transform = style
            },
            picAnimate() {
                return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
                    setTimeout(callback, 1000 / 60)
                }
            },
            getPosition(i){
                this.closeCard(i)
                this.$parent.getLocation(i)
            }
        }
    }
</script>

<style scoped>
    .fade-enter-active,
	.fade-leave-active {
		transition: all 0.5s ease
	}

	.fade-enter,
	.fade-leave-active {
		opacity: 0
	}


    .demo {
        width: 100%;
        height: 100%;
        /* background-color: blue; */
    
    }

    .map {
        position: absolute;
        z-index: -1;
        left: 0px;
        top: 0px;
    }

    .jiCaiFeng {
        position: absolute;
        left: 1075px;
        top: 472px;
    }

    .ting {
        position: absolute;
        left: 1310px;
        top: 1158px;
    }

    .friendshipLake {
        position: absolute;
        position: absolute;
        left: 25px;
        top: 1430px;
    }
    .dedicationLake {
        position: absolute;
        left: 481px;
        top: 1332px;

    }
    .loveNightLake {
        position: absolute;
        left: 2px;
        top: 1050px;

    }

    .youthLake {
        position: absolute;
        left: 563px;
        top: 412px;
    }

    .daHuo {
        position: absolute;
        left: 200px;
        top: 237px;
    }

    .nine {
        position: absolute;
        left: 1002px;
        top: 890px;
    }

    .twt {
        position: absolute;
        left: 590px;
        top: 38px;
    }
    .duck{
        position: absolute;
        left: 740px;
        top: 170px;
        width: 150px;
        transition: 2s;
    }
    /* 文化卡片 */
    .Cards {
        z-index: 1;
        position: absolute;
        top: 13vh;
        height: 77vh;
        width: 80vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 10vw;
        pointer-events: none;
    }

    .card {
        width: 80vw;
        pointer-events: auto;

    }

    .getPosition {
        margin-top: 1vh;
        width: 35vw;
        pointer-events: auto;
    }
    .closeMask{
        width: 100vw;
        height: 100vh;
        position: absolute;
    }
    
</style>