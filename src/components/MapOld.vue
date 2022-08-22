<template>
    <div ref="demo" class="demo">
        <div id="demoImg" >
            <img class="map" ref="map" src="../assets/map/old.png">
            <img class="jiCaiFeng" src="../assets/map/old/feng.png" v-if="getedCard[0]" @click="showCard(0)">
            <img class="ting" src="../assets/map/old/ting.png" v-if="getedCard[1]" @click="showCard(1)">
            <img class="friendshipLake" src="../assets/map/old/friendshipLake.png"  v-if="getedCard[2]" @click="showCard(2)">
            <img class="dedicationLake" src="../assets/map/old/dedicationLake.png"  v-if="getedCard[3]" @click="showCard(3)">
            <img class="loveNightLake" src="../assets/map/old/loveNightLake.png" v-if="getedCard[4]" @click="showCard(4)">
            <img class="youthLake" src="../assets/map/old/youthLake.png" v-if="getedCard[5]" @click="showCard(5)">
            <img class="daHuo" src="../assets/map/old/daHuo.png"  v-if="getedCard[6]" @click="showCard(6)">
            <img class="nine" src="../assets/map/old/nine.png"  v-if="getedCard[7]" @click="showCard(7)">
            <img class="twt" src="../assets/map/old/twt.png"  v-if="getedCard[8]" @click="showCard(8)">
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Hammer from 'hammerjs'
    import { setTimeout } from 'timers'

    export default {
        name: 'MapNew',
        components: {
        },
        data() {
            return {
                //打卡
                getedCard:[1,1,1,1,1,1,1,1,1],
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
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.picInit()
            })
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
        methods: {
            showCard(index){
                alert("click:"+" "+index)
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
            },
            // 多点触发 - 缩放
            onPinch(ev) {
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
            }
        }
    }
</script>

<style scoped>

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
</style>