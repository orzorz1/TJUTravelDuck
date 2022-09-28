<template>
    <div ref="demo" class="demo">
        <div id="demoImg" >
            <img class="map" ref="map" src="../assets/map/new.png">
            <img class="administrationBuilding" src="../assets/map/new/1895.png" :style="{'opacity' :getedCard[0] ? '' :'0'}"  @click="showCard(0)">
            <img class="colosseum" src="../assets/map/new/32.png" :style="{'opacity' :getedCard[1] ? '' :'0'}" @click="showCard(1)">
            <img class="bridge" src="../assets/map/new/bridge.png"  :style="{'opacity' :getedCard[2] ? '' :'0'}" @click="showCard(2)">
            <img class="lake" src="../assets/map/new/lake.png" :style="{'opacity' :getedCard[3] ? '' :'0'}" @click="showCard(3)">
            <img class="library" src="../assets/map/new/library.png" :style="{'opacity' :getedCard[4] ? '' :'0'}" @click="showCard(4)">
            <img class="ssqs" src="../assets/map/new/ssqs.png"  :style="{'opacity' :getedCard[0] ? '' :'0'}" @click="showCard(0)">
            <img class="datong" src="../assets/map/new/datong.png"  :style="{'opacity' :getedCard[5] ? '' :'0'}" @click="showCard(5)">
            <img class="twt" src="../assets/map/new/twt.png">
            <img class="duck" :src="duckState===0 ? require('../assets/map/duck_awaiting.png') : require('../assets/map/duck_now.png')" :style="campu===1 ? 'display:none;' : '' " ref="duck" v-if="duckState!=2">
        </div>
        <transition  name="fade" mode="out-in">
            <div class="Cards" v-for="(card,index) in newCards" v-if="newCards[index].show">
                <img class="card" :src="card.url" />
                <img class="getPosition" @click="getPosition(index)" v-if="!getedCard[index]" src="../assets/icon/clockIn.png"/>
            </div>
        </transition>
        <div class="closeMask" v-for="(card,index) in newCards" v-if="newCards[index].show" @click="closeCard(index)"></div>
    </div>
</template>

<script>
    import Hammer from 'hammerjs'
    import { setTimeout } from 'timers'
	import { mapState, mapGetters } from 'vuex';

    export default {
        name: 'MapNew',
        data() {
            return {
                //打卡
                getedCard:[0,0,0,0,0,0],
                // getedCard:[1,1,1,1,1,1,1],
                //缩放、移动使用
                config: {},
                id: null,
                mc: null,
                timer: false,
                translateX: -300,
                translateY: -10,
                scale: 0.43,
                firstTouch: true,
                relateX: -300,
                relateY: -10,
                oldX: -300,
                oldY: -10,
                oldScale: 0.43,
                first:0,
                duckState:0, //鸭子状态: 0为待出发，1为已出发, 2为不显示
                newCards: [
                    { "name": "1895行政楼和实事求是石", "show": false, "url": require("../assets/cards/1895.png") },
                    { "name": "32教", "show": false, "url": require("../assets/cards/32.png") },
                    { "name": "三问桥", "show": false, "url": require("../assets/cards/bridge.png") },
                    { "name": "青年湖", "show": false, "url": require("../assets/cards/lake.png") },
                    { "name": "郑东图书馆", "show": false, "url": require("../assets/cards/library.png") },
                    { "name": "大通学生中心", "show": false, "url": require("../assets/cards/datong.png") },],
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.picInit()
            })
        },
        beforeMount(){
            let that = this
            if(this.campu===1){
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
                            if(json.result[k] && json.result[k].id===21){
                                that.getedCard[0]=1
                            }else if(json.result[k] && json.result[k].id===22){
                                that.getedCard[1]=1
                            }else if(json.result[k] && json.result[k].id===23){
                                that.getedCard[2]=1
                            }else if(json.result[k] && json.result[k].id===24){
                                that.getedCard[3]=1
                            }else if(json.result[k] && json.result[k].id===25){
                                that.getedCard[4]=1
                            }else if(json.result[k] && json.result[k].id===26){
                                that.getedCard[5]=1
                            }
                        }
                        let c = 0
                        for(let j=0;j<that.getedCard.length;j++){
                            if(that.getedCard[j]===1){c++}
                        }
                        if(c===that.getedCard.length){
                            that.duckState=2
                        }
                        that.newCards[0].show = true
                        that.newCards[0].show = false
                    }
                }
            }
        },
        created(){
            setTimeout(()=>{
                const position = {
                    translateX: -300,
                    translateY: -10,
                    scale: 0.43
                }
                this.selfPosition(position)
            },10)

        },
        computed: {
			...mapState(['disableButton','disableBtn','ableBtn','campu','apiUrl','token']),
		},
        methods: {
            showCard(index){
                if(!this.disableButton){
                    this.newCards[index].show = true
                    this.$store.commit("disableBtn")
                }
            },
            closeCard(index) {
                this.newCards[index].show = false
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
            // 鸭子移动
            duckMove(i){
                setTimeout(()=>{
                    if(i===0){//1895
                        this.$refs.duck.style.left = '1350px'
                        this.$refs.duck.style.top = '1050px'
                    }
                    if(i===1){//32教
                        this.$refs.duck.style.left = '700px'
                        this.$refs.duck.style.top = '1320px'
                    }
                    if(i===2){//三问桥
                        this.$refs.duck.style.left = '830px'
                        this.$refs.duck.style.top = '1020px'
                    }
                    if(i===3){//青年湖
                        this.$refs.duck.style.left = '1050px'
                        this.$refs.duck.style.top = '150px'
                    }
                    if(i===4){//郑东图书馆
                        this.$refs.duck.style.left = '750px'
                        this.$refs.duck.style.top = '700px'
                    }
                    if(i===5){//大通
                        this.$refs.duck.style.left = '750px'
                        this.$refs.duck.style.top = '300px'
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
                    if (this.translateY > -10){
                        this.translateY = -10
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
    }

    .map {
        position: absolute;
        z-index: -1;
        left: 0px;
        top: 0px;
    }

    .administrationBuilding {
        position: absolute;
        left: 1438px;
        top: 952px;
    }

    .colosseum {
        position: absolute;
        left: 530px;
        top: 1206px;
    }

    .bridge {
        position: absolute;
        position: absolute;
        left: 702px;
        top: 1005px;
    }

    .lake {
        position: absolute;
        left: 480px;
        top: 112px;

    }

    .library {
        position: absolute;
        left: 617px;
        top: 532px;
    }

    .ssqs {
        position: absolute;
        left: 1110px;
        top: 1055px;
    }

    .datong {
        position: absolute;
        left: 562px;
        top: 270px;
    }

    .twt {
        position: absolute;
        left: 1246px;
        top: 41px;
    }
    .duck{
        position: absolute;
        left: 1330px;
        top: 190px;
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